// console.log('bgu4u content script loaded');
// //print the tab id
// if(document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', validateCourse);
// } else {
//     validateCourse();
// }

// function validateCourse() {
//     const frame = document.querySelector('frame[name="main"]');

//     frame.onload = function () {
//         setTimeout(() => {
//             const win = frame.contentWindow;
//             if (win && typeof win.goType === "function") {
//                 console.log(win.goType(1));
//             } else {
//                 console.error("goType is still not available.");
//             }
//         }, 1000); // Wait 1 second
//     };
// }
