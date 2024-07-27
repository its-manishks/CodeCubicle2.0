document.getElementById("getSubtitles").addEventListener("click", () => {
    console.log("Get Subtitles button clicked");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const sendMessageToContentScript = (retryCount = 0) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "GET_VIDEO_ID" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError.message);
                    if (retryCount < 5) {
                        setTimeout(() => sendMessageToContentScript(retryCount + 1), 1000);
                    } else {
                        document.getElementById("subtitles").innerText = 'Error: ' + chrome.runtime.lastError.message;
                    }
                    return;
                }

                if (response && response.videoId) {
                    console.log('Received video ID:', response.videoId);
                    fetch(`http://localhost:5000/get_subtitles?video_id=${response.videoId}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.subtitles) {
                                console.log('Subtitles fetched:', data.subtitles);
                                document.getElementById("subtitles").innerText = data.subtitles;
                            } else {
                                console.log('Error:', data.error);
                                document.getElementById("subtitles").innerText = 'Error fetching subtitles: ' + data.error;
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            document.getElementById("subtitles").innerText = 'Error fetching subtitles';
                        });
                } else {
                    console.log('No video ID found in response');
                    document.getElementById("subtitles").innerText = 'No video ID found';
                }
            });
        };
        sendMessageToContentScript();
    });
});

document.getElementById("convertToSignLanguage").addEventListener("click", () => {
    const subtitles = document.getElementById("subtitles").innerText;
    if (!subtitles) {
        document.getElementById("signLanguage").innerText = 'No subtitles to convert';
        return;
    }

    fetch('http://localhost:5000/convert_to_sign_language', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subtitles: subtitles })
    })
        .then(res => res.json())
        .then(data => {
            if (data.sign_language) {
                console.log('Sign language conversion:', data.sign_language);
                document.getElementById("signLanguage").innerText = data.sign_language;
            } else {
                console.log('Error:', data.error);
                document.getElementById("signLanguage").innerText = 'Error converting to sign language: ' + data.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("signLanguage").innerText = 'Error converting to sign language';
        });
});
