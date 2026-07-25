"use strict";

console.log('###Moodle content script loaded###');

// Filled in by scripts/moodle-ajax-hook.js, which runs in the page context and
// taps Moodle's /lib/ajax/service.php responses. The course number is no longer
// part of the served HTML, so the course objects in those responses are the only
// place left to read it from.
const COURSE_DATA_STORE_ID = 'bgu-scout-moodle-course-data';
const COURSE_DATA_EVENT = 'bgu-scout:moodle-course-data';
const SAVE_DEBOUNCE_MS = 300;

let saveTimeout = null;

chrome.storage.local.get(['auto_add_moodle_courses'], function (result) {
    if (result.auto_add_moodle_courses) {
        // Responses trickle in as the dashboard renders, so re-read on every update.
        document.addEventListener(COURSE_DATA_EVENT, scheduleSave);
        scheduleSave();
    }
});

function scheduleSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveDiscoveredCourses, SAVE_DEBOUNCE_MS);
}

function readCourseData() {
    const store = document.getElementById(COURSE_DATA_STORE_ID);
    if (!store || !store.textContent) {
        return [];
    }

    try {
        return JSON.parse(store.textContent);
    } catch (error) {
        console.error('Failed to read Moodle course data:', error);
        return [];
    }
}

// "202150610120262" -> "202.1.5061"
function parseCourseNumber(idnumber) {
    const digits = String(idnumber ?? '').replace(/\D/g, '');
    if (digits.length < 8) {
        return null;
    }

    return `${digits.substring(0, 3)}.${digits[3]}.${digits.substring(4, 8)}`;
}

function saveDiscoveredCourses() {
    const coursesToSave = {};

    readCourseData().forEach(course => {
        const courseNumber = parseCourseNumber(course.idnumber);
        if (!courseNumber) {
            return;
        }

        const courseName = trimCourseName((course.fullname || '').trim());
        if (!courseName) {
            return;
        }

        coursesToSave[courseNumber] = courseName;
    });

    if (Object.keys(coursesToSave).length === 0) {
        return;
    }

    chrome.storage.local.get(['saved_courses', 'course_name_preferred_lang'], function (result) {
        const savedCourses = result.saved_courses || {};
        const preferredLang = result.course_name_preferred_lang || (navigator.language.startsWith('he') ? 'he' : 'en');

        for (const courseNumber in coursesToSave) {
            if (savedCourses[courseNumber]) {
                delete coursesToSave[courseNumber];
            }
        }

        if (Object.keys(coursesToSave).length === 0) {
            return;
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

function trimCourseName(courseName) {
    // First pass: Handle semester indicators with numbers
    courseName = courseName
        // Handle semester indicators: "סמ 1", "סמ2", "S 2", "S2", etc.
        // The indicator has to stand on its own - without the boundary guards the
        // trailing "s" of a name like "Data Systems 2" reads as a semester marker.
        .replace(/(?<![\p{L}\p{N}_])(סמסטר|סמ|semester|sem|s)\s*[0-9]+(?![\p{L}\p{N}_])/giu, ' ')

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
