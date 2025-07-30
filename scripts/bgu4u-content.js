"use strict";

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    checkOnLoad();
} else {
    document.addEventListener('DOMContentLoaded', async function () {
        checkOnLoad();
    });
}

async function checkOnLoad() {
    const storage = await chrome.storage.local.get(['allowCourseValidation']);
    if (storage.allowCourseValidation && storage.allowCourseValidation > 0) {
        console.log('Checking for Course validation');

        setTimeout(() => {
            console.error('Connection error');
            chrome.runtime.sendMessage({
                type: 'CONNECTION_ERROR'
            });
        }, 10000);

        validateCourseDetails();
    }
}

function validateCourseDetails() {
    console.log('Validating course details');

    // Extract course number from URL
    const urlParams = new URLSearchParams(window.location.search);
    const department = urlParams.get('ex_department');
    const degreeLevel = urlParams.get('ex_degree_level');
    const course = urlParams.get('ex_course');
    const lang = urlParams.get('lang') || 'he';

    let courseNumber = '';
    if (department && degreeLevel && course) {
        courseNumber = `${department}.${degreeLevel}.${course}`;
    }

    console.log('Course Number:', courseNumber);

    let courseName = '';
    const courseNameElement = document.querySelector("#infoi > h1");
    if (courseNameElement) {
        courseName = courseNameElement.innerHTML.split('<br>')[1].trim();
        console.log('Course Name:', courseName);
        chrome.runtime.sendMessage({
            type: 'COURSE_FOUND',
            courseName: courseName,
            courseNumber: courseNumber,
            lang: lang
        });
    } else {
        chrome.runtime.sendMessage({
            type: 'COURSE_NOT_FOUND'
        });
    }
}
