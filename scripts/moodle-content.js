console.log('###Moodle content script loaded###');

// Initialize based on document state
chrome.storage.sync.get(['enable_moodle_courses'], function(result) {
    if (result.enable_moodle_courses) {
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

        console.log('Course list found:', courseList);
        let courseItems = courseList.querySelectorAll('.card');
        console.log('Course items:', courseItems);
        const coursesToSave = {};
        courseItems.forEach(courseItem => {
            const courseName = courseItem.innerText
                .trim()
                .match(/(.*)\n/)?.[0]
                ?.replace(/\n/g, '') || courseItem.innerText.trim();
            console.log('Course name:', courseName);
            const courseLink = courseItem.querySelector('a').href;
            const courseCode = courseLink.match(/id=(\d+)/)[1];
            console.log('Course code:', courseCode);
            let courseNumber = courseNumberList.querySelector(`option[value="${courseCode}"]`).innerText.substring(0, 8);
            courseNumber = courseNumber.substring(0, 3) + '.' + courseNumber[3] + '.' + courseNumber.substring(4, 8);
            console.log('Course number:', courseNumber);
            coursesToSave[courseNumber] = courseName;
        });
        console.log('Courses to save:', coursesToSave);
        chrome.storage.sync.get(['saved_courses'], function(result) {
            const savedCourses = result.saved_courses || {};
            const newSavedCourses = { ...savedCourses, ...coursesToSave };
            chrome.storage.sync.set({ 'saved_courses': newSavedCourses }, function() {
                console.log('Courses saved:', newSavedCourses);
            });
        });
    }
}
