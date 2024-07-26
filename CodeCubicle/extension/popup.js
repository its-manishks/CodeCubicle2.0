const textBox = document.getElementById('text-box');
const imageDisplay = document.getElementById('image-display');

// Listen for messages from background or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "displayLetters") {
        const letters = message.letters;
        textBox.textContent = letters.join(' ');

        let currentIndex = 0;

        const displayNextImage = () => {
            if (currentIndex < letters.length) {
                console.log(`Current letter: ${letters[currentIndex]}`);
                displayImage(letters[currentIndex], displayNextImage);
                currentIndex++;
            } else {
                console.log("All images displayed.");
            }
        };

        displayNextImage();
    }
});

function displayImage(letter, callback) {
    const imageFile = `${letter.toUpperCase()}.jpg`;
    console.log(`Attempting to display image: ${imageFile}`);
    imageDisplay.src = chrome.runtime.getURL(imageFile); // Use chrome.runtime.getURL for correct path
    imageDisplay.onload = () => {
        console.log(`Image loaded: ${imageDisplay.src}`);
        setTimeout(callback, 500); // Adjust timing for image transition
    };
    imageDisplay.onerror = (error) => {
        console.error(`Error loading image: ${imageFile}`, error);
        callback();
    };
}

// Initialize capturing audio when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: "captureAudio" });
});




  


