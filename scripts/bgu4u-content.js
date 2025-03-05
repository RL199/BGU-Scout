"use strict";

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    checkOnLoad();
} else {
    document.addEventListener('DOMContentLoaded', async function () {
        checkOnLoad();
    });
}

async function checkOnLoad() {
    await chrome.storage.local.get(['allowCourseValidation'], function (result) {
        if (result.allowCourseValidation) {
            console.log('Checking for Course validation');
            
            setTimeout(() => {
                console.error('Connection error');
                chrome.runtime.sendMessage({
                    type: 'CONNECTION_ERROR'
                });
            }, 10000);

            validateCourseDetails();
        }
    });
}

function validateCourseDetails() {
    console.log('Validating course details');
    let courseName = '';
    const courseNameElement = document.querySelector("#infoi > h1");
    if (courseNameElement) {
        courseName = courseNameElement.innerHTML.split('<br>')[1].trim();
        console.log('Course Name:', courseName);
        chrome.runtime.sendMessage({ type: 'COURSE_FOUND', courseName: courseName });
    } else {
        chrome.runtime.sendMessage({
            type: 'COURSE_NOT_FOUND'
        });
    }
}
