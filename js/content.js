console.log('content.js loaded and ready');

// Add styles
const style = document.createElement('style');
style.textContent = `
  .selected-element {
    outline: 2px solid #ff4081 !important;
    box-shadow: 0 0 0 4px rgba(255, 64, 129, 0.3) !important;
    transition: all 0.3s ease !important;
  }
  .hover-element {
    outline: 2px dashed #03a9f4 !important;
    box-shadow: 0 0 0 4px rgba(3, 169, 244, 0.3) !important;
    transition: all 0.3s ease !important;
  }
`;
document.head.appendChild(style);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  if (request.action === "startSelection") {
    enableElementSelection();
    toggleSelectionStatus(true); // Ensure status display is visible
    sendResponse({status: "Element selection started"});
    return true;
  }
});

// Listen for messages from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "cropScreenshot") {
    cropScreenshot(request.dataUrl, request.elements);
  }
});

function captureScreenshot() {
  console.log('Capturing screenshot started');
  if (selectedElements.length !== 2) {
    console.error('Two elements must be selected');
    alert('Please select two elements before capturing a screenshot.');
    return Promise.reject(new Error('Two elements must be selected'));
  }
  
  const positions = getElementPositions();
  if (!positions) {
    console.error('Unable to get element positions');
    return Promise.reject(new Error('Unable to get element positions'));
  }
  
  console.log('Element positions:', positions);
  
  isProcessingScreenshot = true;
  console.log('isProcessingScreenshot set to true');
  
  // Temporarily remove visual effect of selected elements
  selectedElements.forEach(el => el.classList.remove('selected-element'));
  console.log('Selected element classes removed');

  positions.top -= 10;
  positions.left -= 10;
  positions.bottom += 10;
  positions.right += 10;

  return new Promise((resolve, reject) => {
    console.log('Sending captureScreenshot message to background');
    chrome.runtime.sendMessage({action: "captureScreenshot"}, (response) => {
      console.log('Received response from captureScreenshot:', response);
      if (chrome.runtime.lastError) {
        console.error("Error capturing screenshot:", chrome.runtime.lastError);
        reject(new Error("Error capturing screenshot: " + chrome.runtime.lastError.message));
      } else if (response.error) {
        console.error("Error in captureScreenshot response:", response.error);
        reject(new Error(response.error));
      } else if (response.status === "Screenshot captured and stored") {
        console.log('Screenshot captured, requesting cropped screenshot');
        chrome.runtime.sendMessage({action: "getCroppedScreenshot", elements: positions}, (croppedResponse) => {
          console.log('Received response from getCroppedScreenshot:', croppedResponse);
          if (chrome.runtime.lastError) {
            console.error("Error getting cropped screenshot:", chrome.runtime.lastError);
            reject(new Error("Error getting cropped screenshot: " + chrome.runtime.lastError.message));
          } else if (croppedResponse.error) {
            console.error("Error in getCroppedScreenshot response:", croppedResponse.error);
            reject(new Error(croppedResponse.error));
          } else if (croppedResponse.status === "Cropping data sent") {
            console.log('Cropping data received, starting cropScreenshot');
            cropScreenshot(croppedResponse.dataUrl, croppedResponse.elements)
              .then(resolve)
              .catch(reject);
          } else {
            console.error('Unexpected response when getting cropped screenshot:', croppedResponse);
            reject(new Error('Unexpected response when getting cropped screenshot'));
          }
        });
      } else {
        console.error('Unexpected response when capturing screenshot:', response);
        reject(new Error('Unexpected response when capturing screenshot'));
      }
    });
  })
  .then((croppedDataUrl) => {
    console.log('Screenshot captured and cropped successfully');
    showPreview(croppedDataUrl);
    return croppedDataUrl;
  })
  .catch((error) => {
    console.error('Error capturing or cropping screenshot:', error);
    alert('Failed to capture screenshot: ' + error.message);
    throw error;
  })
  .finally(() => {
    // Restore visual effect of selected elements
    selectedElements.forEach(el => el.classList.add('selected-element'));
    console.log('Selected element classes restored');
    isProcessingScreenshot = false;
    console.log('isProcessingScreenshot set to false');
  });
}

function getElementPositions() {
  if (selectedElements.length !== 2) {
    console.error('Two elements must be selected');
    return null;
  }
  const [first, second] = selectedElements;
  if (!first || !second) {
    console.error('Selected elements are not valid');
    return null;
  }
  const firstRect = first.getBoundingClientRect();
  const secondRect = second.getBoundingClientRect();
  
  return {
    top: Math.min(firstRect.top, secondRect.top),
    left: Math.min(firstRect.left, secondRect.left),
    bottom: Math.max(firstRect.bottom, secondRect.bottom),
    right: Math.max(firstRect.right, secondRect.right)
  };
}

function cropScreenshot(dataUrl, elements) {
  return new Promise((resolve, reject) => {
    console.log('Starting to crop screenshot');
    const img = new Image();
    img.onload = function() {
      console.log('Image loaded for cropping');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const dpr = window.devicePixelRatio;
      const width = (elements.right - elements.left) * dpr;
      const height = (elements.bottom - elements.top) * dpr;
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 
        elements.left * dpr, elements.top * dpr, width, height, 
        0, 0, width, height
      );
      
      const croppedDataUrl = canvas.toDataURL();
      console.log('Screenshot cropped successfully');
      resolve(croppedDataUrl);
    };
    img.onerror = function() {
      console.error('Failed to load image for cropping');
      reject(new Error('Failed to load image for cropping'));
    };
    img.src = dataUrl;
  });
}

console.log('content.js setup complete');

if (typeof enableElementSelection === 'undefined' ||
    typeof showOptions === 'undefined' ||
    typeof showPreview === 'undefined') {
  console.error('Required functions are not defined. Make sure all necessary scripts are loaded.');
}

function selectElement(element) {
  console.log('Element selected');
  selectedElements.push(element);
  element.classList.add('selected-element');
  element.classList.remove('hover-element');

  console.log('Number of selected elements:', selectedElements.length);
  updateSelectionStatus(); // Add this line
  if (selectedElements.length === 2) {
    document.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('mouseout', handleMouseOut);
    document.removeEventListener('click', handleClick);
    document.body.style.cursor = 'default';
    showOptions();
  }
}

// Call updateSelectionStatus in other places where the selection state might change
