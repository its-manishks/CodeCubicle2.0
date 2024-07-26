// Create and style the floating container
const floatingContainer = document.createElement('div');
floatingContainer.id = 'floating-container';
floatingContainer.innerHTML = `
    <div id="text-box">Listening...</div>
    <img id="image-display" src="" alt="Letter Image">
`;
document.body.appendChild(floatingContainer);

const style = document.createElement('style');
style.textContent = `
    #floating-container {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 200px;
        height: 200px;
        background-color: #fff;
        border: 1px solid #ddd;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    #image-display {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
`;
document.head.appendChild(style);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "displayLetters") {
        const letters = message.letters;
        const textBox = document.getElementById('text-box');
        textBox.textContent = letters.join(' ');

        let currentIndex = 0;
        const imageDisplay = document.getElementById('image-display');

        const displayNextImage = () => {
            if (currentIndex < letters.length) {
                const letter = letters[currentIndex];
                const imageFile = `${letter.toUpperCase()}.jpg`;
                imageDisplay.src = chrome.runtime.getURL(imageFile);
                imageDisplay.onload = () => setTimeout(displayNextImage, 500);
                imageDisplay.onerror = () => displayNextImage(); // Continue even if image fails
                currentIndex++;
            }
        };

        displayNextImage();
    }
});








  