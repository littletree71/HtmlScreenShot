console.log('Background script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message in background:', request);
  if (request.action === "captureScreenshot") {
    console.log('Capturing screenshot in background');
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, (dataUrl) => {
      console.log('Screenshot captured, storing in local storage');
      if (chrome.runtime.lastError) {
        console.error('Error capturing screenshot:', chrome.runtime.lastError);
        sendResponse({error: chrome.runtime.lastError.message});
      } else {
        chrome.storage.local.set({tempScreenshot: dataUrl}, () => {
          if (chrome.runtime.lastError) {
            console.error('Error storing screenshot:', chrome.runtime.lastError);
            sendResponse({error: "Failed to store screenshot: " + chrome.runtime.lastError.message});
          } else {
            console.log('Screenshot stored successfully');
            sendResponse({status: "Screenshot captured and stored"});
          }
        });
      }
    });
    return true;
  } else if (request.action === "getCroppedScreenshot") {
    console.log('Getting cropped screenshot from storage');
    chrome.storage.local.get(['tempScreenshot'], (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving screenshot:', chrome.runtime.lastError);
        sendResponse({error: "Failed to retrieve screenshot: " + chrome.runtime.lastError.message});
      } else if (result.tempScreenshot) {
        console.log('Screenshot retrieved, sending cropping data');
        sendResponse({
          status: "Cropping data sent",
          dataUrl: result.tempScreenshot,
          elements: request.elements
        });
        chrome.storage.local.remove('tempScreenshot');
      } else {
        console.error('No screenshot found in storage');
        sendResponse({error: "No screenshot found"});
      }
    });
    return true;
  } else if (request.action === "downloadScreenshot") {
    // Generate a filename based on the current date and time
    const filename = `screenshot_${new Date().toISOString().replace(/[:\.]/g, '-')}.png`;
    
    // Use chrome.downloads API to download the image
    chrome.downloads.download({
      url: request.dataUrl,
      filename: filename,
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError);
        sendResponse({status: "error", message: chrome.runtime.lastError.message});
      } else {
        console.log("Download started with ID:", downloadId);
        sendResponse({status: "success", downloadId: downloadId});
      }
    });
    
    return true;  // Keep the message channel open for asynchronous response
  }
});

console.log('Background script setup complete');
