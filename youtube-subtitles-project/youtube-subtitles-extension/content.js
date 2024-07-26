console.log('Content script loaded');  // Ensure content script is loaded

function getVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');
    console.log('Extracted video ID:', videoId);  // Log the extracted video ID
    return videoId;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "GET_VIDEO_ID") {
        console.log('Message received in content script');  // Log when a message is received
        const videoId = getVideoId();
        sendResponse({ videoId: videoId });
    }
});
