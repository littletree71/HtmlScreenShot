# HtmlScreenShot Chrome Extension

## Background

HtmlScreenShot is a powerful Chrome extension designed to enhance web developers' and designers' workflow. It allows users to easily select HTML elements on a webpage, capture screenshots, extract text, and copy HTML code. This tool is particularly useful for web design analysis, bug reporting, and content extraction.

## Features

- Select two HTML elements on any webpage
- Capture screenshots of the selected area
- Extract text from the selected elements
- Copy HTML code of the selected elements
- User-friendly interface with visual feedback

## Installation

1. Clone this repository or download the ZIP file and extract it.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the HtmlScreenShot extension icon in your Chrome toolbar.
2. Click the "Start Selection" button in the popup.
3. Select two HTML elements on the webpage by clicking on them.
4. Choose an action from the options menu that appears:
   - Screenshot: Capture an image of the selected area
   - Extract Text: Copy the text content of the selected elements
   - Copy HTML: Copy the HTML code of the selected elements
5. For screenshots, you can choose to download the image or copy it to your clipboard.

## File Structure

- `manifest.json`: The extension's configuration file
- `popup.html`: The HTML file for the extension's popup
- `popup.js`: JavaScript file for the popup's functionality
- `content.js`: Main content script that runs on web pages
- `background.js`: Background script for handling extension events
- `utils.js`: Utility functions used across the extension
- `elementSelection.js`: Handles the element selection process
- `optionsMenu.js`: Manages the options menu display and functionality
- `screenshotPreview.js`: Handles the screenshot preview and actions
- `styles.css`: CSS styles for the extension's UI elements
- `htmlCopy.js`: Manages the HTML copying functionality, including parent element handling
- `textExtraction.js`: Handles the extraction of text content from selected elements

## Development

To modify or extend the extension:

1. Edit the relevant files based on the functionality you want to change.
2. Test your changes by reloading the extension in `chrome://extensions/`.
3. For major changes, increment the version number in `manifest.json`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
