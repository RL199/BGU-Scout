"use strict";

console.log('###Moodle content script loaded###');

// Initialize based on document state
chrome.storage.local.get(['auto_add_moodle_courses'], function (result) {
    if (result.auto_add_moodle_courses) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeCourseList);
        } else {
            initializeCourseList();
        }
    }
});

function initializeCourseList() {
    const observer = new MutationObserver((mutations, obs) => {
        const courseList2 = document.querySelector("#page-container-2 > div > div");
        const courseList3 = document.querySelector("#page-container-3 > div > div")
        checkForCourseList(courseList2, obs);
        checkForCourseList(courseList3, obs);
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function checkForCourseList(courseList, obs) {
    if (courseList) {
        const courseNumberList = document.querySelector("#calendar-course-filter-1");

        obs.disconnect();

        let courseItems = courseList.querySelectorAll('.card');
        const coursesToSave = {};
        
        courseItems.forEach(courseItem => {
            let courseName = (courseItem.innerText
                .trim()
                .match(/(.*)\n/)?.[0]
                ?.replace(/\n/g, '') || courseItem.innerText.trim())

            // Apply cleanup to course name
            courseName = trimCourseName(courseName);

            const courseLink = courseItem.querySelector('a').href;
            const courseCode = courseLink.match(/id=(\d+)/)[1];
            let courseNumber = courseNumberList.querySelector(`option[value="${courseCode}"]`).innerText.substring(0, 8);
            courseNumber = courseNumber.substring(0, 3) + '.' + courseNumber[3] + '.' + courseNumber.substring(4, 8);
            coursesToSave[courseNumber] = courseName;
        });

        chrome.storage.local.get(['saved_courses', 'course_name_preferred_lang'], function (result) {
            const savedCourses = result.saved_courses || {};
            const preferredLang = result.course_name_preferred_lang || (navigator.language.startsWith('he') ? 'he' : 'en');
            
            for (const courseNumber in coursesToSave) {
                if (savedCourses[courseNumber]) {
                    delete coursesToSave[courseNumber];
                }
            }
            
            // Convert to new format with language detection
            const newSavedCourses = { ...savedCourses };
            for (const courseNumber in coursesToSave) {
                const courseName = coursesToSave[courseNumber];
                const detectedLang = detectLanguage(courseName);
                
                newSavedCourses[courseNumber] = {
                    names: {
                        [detectedLang]: courseName
                    }
                };
            }
            
            chrome.storage.local.set({ 'saved_courses': newSavedCourses }, function () {
                console.log('Courses saved:', newSavedCourses);
            });
        });
    }
}

function trimCourseName(courseName) {
    // First pass: Handle semester indicators with numbers
    courseName = courseName
        // Handle semester indicators: "סמ 1", "סמ2", "S 2", "S2", etc.
        .replace(/\s*(סמ|S|sem|semester|סמסטר)\s*[0-9]+\s*/gi, ' ')

        // Handle year ranges like "2023-2024"
        .replace(/\s*\d{4}-\d{4}\s*/g, ' ')

        // Handle Hebrew academic years like "תשפ"ג", "תשפ"ד", etc.
        .replace(/\s*-?\s*תשפ"[א-י]\s*/g, ' ')

        // Normalize spaces and clean up any double spaces created
        .replace(/\s+/g, ' ')
        .trim();

    // Second pass: Handle standalone semester words if they're at word boundaries
    const semesterWords = ['course', 'קורס'];
    semesterWords.forEach(word => {
        // Create word boundary pattern for standalone words
        const boundaryPattern = new RegExp(`\\s${word}\\s|^${word}\\s|\\s${word}$|^${word}$`, 'gi');
        courseName = courseName.replace(boundaryPattern, ' ').trim();
    });

    // One more normalization pass
    return courseName.replace(/\s+/g, ' ').trim();
}

// Detect language of course name
function detectLanguage(text) {
    // Simple Hebrew detection - if the text contains Hebrew characters
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text) ? 'he' : 'en';
}
