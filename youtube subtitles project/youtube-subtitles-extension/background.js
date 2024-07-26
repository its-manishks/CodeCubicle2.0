chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
});

chrome.action.onClicked.addListener((tab) => {
    console.log("Action button clicked");
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });
});
