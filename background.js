// notiFlag = true;
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === 'complete' && tab.url) {
//         const url1 = "https://bgu4u22.bgu.ac.il/";
//         const url2 = "https://reports4u22.bgu.ac.il/";
//         if ((tab.url.includes(url1) || tab.url.includes(url2)) && notiFlag) {
//             chrome.notifications.create({
//                 type: "basic",
//                 iconUrl: "images/icon-128.png",
//                 title: "Matching URL Opened",
//                 message: `You opened matching BGU URL`
//             });


//             chrome.action.setIcon({
//                 path: {
//                     16: "images/alert-icon-16.png",
//                     32: "images/alert-icon-32.png",
//                     48: "images/alert-icon-48.png",
//                     128: "images/alert-icon-128.png"
//                 },
//             });

//             notiFlag = false;
//         }
//         if(!tab.url.includes(url1) && !tab.url.includes(url2)){
//             notiFlag = true;
//         }
//     }
// });
