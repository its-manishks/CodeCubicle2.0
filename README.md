# Gesture based video extension for dumb and deaf users

## Overview

The Gesture based video extension for dumb and deaf users is a tool designed to capture subtitles from YouTube videos and display them in the extension popup. This extension can be particularly useful for users who want to read or analyze the subtitles of a video separately. Additionally, the extension can convert the extracted subtitles into sign language, enhancing accessibility for hearing-impaired users.

## Features

- Extracts subtitles from YouTube videos.
- Displays the extracted subtitles in the extension popup.
- Handles multiple languages, including manually created and auto-generated subtitles.
- Converts extracted subtitles to sign language.

## Project Structure

- **youtube-subtitles-extension**: Contains the Chrome extension files including manifest, content script, popup script, and styles.
- **youtube-subtitles-server**: Contains the Flask server that fetches the subtitles using the YouTube Transcript API.

## Tech Stack

### Frontend

- **HTML**: Structure of the Chrome extension popup interface.
- **CSS**: Styling for the buttons and other elements in the popup interface.
- **JavaScript**: Handles interactions within the Chrome extension, such as fetching subtitles and converting them to sign language.

### Backend

- **Python**: The main language used to create the Flask server.
- **Flask**: A micro web framework used to create the server that handles requests from the Chrome extension.
- **Flask-CORS**: A Flask extension used to handle Cross-Origin Resource Sharing (CORS) to allow the Chrome extension to communicate with the Flask server.
- **YouTube Transcript API**: A Python library used to fetch subtitles from YouTube videos.

### Chrome Extension

- **Manifest V3**: Configuration file (`manifest.json`) that defines the metadata and permissions for the Chrome extension.

## Setup

### Prerequisites

- Python 3.6 or higher
- Node.js and npm (for Chrome extension development)

### Installation

1. **Clone the repository and set up the environment:**
   
   ```bash
   git clone https://github.com/your-repo/youtube-subtitles-capture.git
   cd youtube-subtitles-capture
   cd youtube-subtitles-server
   python -m venv venv
   venv\Scripts\activate  # For Windows
   pip install -r requirements.txt
   python server.py
   ```

2. **Load the Chrome extension:**

   ```bash
   Open Chrome and go to chrome://extensions/.
   Enable "Developer mode".
   Click "Load unpacked" and select the youtube-subtitles-extension directory.
   ```

3. **Use the extension:**

   ```bash
   Open a YouTube video with subtitles.
   Click the extension icon in the Chrome toolbar.
   Click the "Get Subtitles" button to fetch and display the subtitles.
   Click the "Convert to Sign Language" button to convert the subtitles to sign language.
   ```

## Authors

- [**Shovik Chakraborty**](https://github.com/cshovik)
- [**Aditya Vikram Singh**](https://github.com/brucewayneoptimusprime)
- [**Manish Kumar**](https://www.github.com/its-manishks)
- [**Nikhil Sharma**](https://github.com/NikhilSharma2707)

