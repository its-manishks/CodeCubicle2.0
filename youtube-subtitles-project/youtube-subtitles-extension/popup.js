document.getElementById("getSubtitles").addEventListener("click", () => {
    console.log("Get Subtitles button clicked");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Define a function to send the message
        const sendMessageToContentScript = (retryCount = 0) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "GET_VIDEO_ID" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError.message);
                    // Retry sending the message up to 5 times
                    if (retryCount < 5) {
                        setTimeout(() => sendMessageToContentScript(retryCount + 1), 1000);
                    } else {
                        document.getElementById("subtitles").innerText = 'Error: ' + chrome.runtime.lastError.message;
                    }
                    return;
                }

                if (response && response.videoId) {
                    console.log('Received video ID:', response.videoId);  // Log the received video ID
                    fetch(`http://localhost:5000/get_subtitles?video_id=${response.videoId}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.subtitles) {
                                console.log('Subtitles fetched:', data.subtitles);  // Log the fetched subtitles
                                document.getElementById("subtitles").innerText = data.subtitles;
                            } else {
                                console.log('Error:', data.error);  // Log the error message
                                document.getElementById("subtitles").innerText = 'Error fetching subtitles: ' + data.error;
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            document.getElementById("subtitles").innerText = 'Error fetching subtitles';
                        });
                } else {
                    console.log('No video ID found in response');  // Log if no video ID is found
                    document.getElementById("subtitles").innerText = 'No video ID found';
                }
            });
        };

        // Initially try to send the message
        sendMessageToContentScript();
    });
});