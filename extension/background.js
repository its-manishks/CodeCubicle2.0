let audioContext;
let mediaStreamSource;
let audioWorkletNode;
let recognition;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "captureAudio") {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            mediaStreamSource = audioContext.createMediaStreamSource(stream);

            audioContext.audioWorklet.addModule('worklet-processor.js').then(() => {
                audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');
                mediaStreamSource.connect(audioWorkletNode);
                audioWorkletNode.connect(audioContext.destination);

                // Initialize SpeechRecognition
                initializeRecognition();

                audioWorkletNode.port.onmessage = (event) => {
                    console.log('Audio data received in background:', event.data);
                };
            }).catch(err => console.error('Error loading AudioWorklet module:', err));
        }).catch(err => console.error('Error accessing audio stream:', err));
    }
});

function initializeRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.error('SpeechRecognition API not supported in this browser.');
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log(`Transcript: ${transcript}`);

        const normalizedTranscript = transcript.toUpperCase();
        console.log(`Normalized Transcript: ${normalizedTranscript}`);

        const letters = normalizedTranscript.split('').filter(char => /^[A-Z]$/.test(char));
        console.log(`Letters: ${letters}`);

        chrome.runtime.sendMessage({ action: "displayLetters", letters: letters });
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error detected: ' + event.error);
    };

    recognition.start();
    console.log('SpeechRecognition started.');
}






