console.log('course validation script loaded');

setTimeout(() => {
    console.error('Course name not found');
    chrome.runtime.sendMessage({
        type: 'CONNECTION_ERROR'
    });
}, 10000);


if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', validateCourse);
} else {
    validateCourse();
}

function validateCourse() {
    let courseName = '';
    courseNameElement = document.querySelector("#infoi > h1");
    if (courseNameElement) {
        courseName = courseNameElement.innerHTML.split('<br>')[1].trim();
    }
    console.log('Course Name:', courseName);
    chrome.runtime.sendMessage({ type: 'VALIDATE_COURSE', courseName: courseName });
}
