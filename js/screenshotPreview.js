function showPreview(dataUrl) {
  console.log('Showing preview of cropped screenshot');
  const previewContainer = document.createElement('div');
  previewContainer.id = 'html-screenshot-preview';
  previewContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border: 2px solid #333;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    padding: 20px;
    z-index: 9999;
  `;

  const img = document.createElement('img');
  img.src = dataUrl;
  img.style.maxWidth = '100%';
  img.style.maxHeight = '70vh';
  previewContainer.appendChild(img);

  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'center';
  buttonContainer.style.marginTop = '10px';
  previewContainer.appendChild(buttonContainer);

  const downloadButton = document.createElement('button');
  applyButtonStyle(downloadButton, '#3f51b5', '💾');
  downloadButton.textContent = 'Download';
  downloadButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({action: "downloadScreenshot", dataUrl: dataUrl});
    closePreview();
  });

  const copyButton = document.createElement('button');
  applyButtonStyle(copyButton, '#009688', '📋');
  copyButton.textContent = 'Copy';
  copyButton.addEventListener('click', () => {
    copyImageToClipboard(dataUrl);
    alert('Image copied to clipboard');
    closePreview();
  });

  const closeButton = document.createElement('button');
  applyButtonStyle(closeButton, '#f44336', '❌');
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => {
    closePreview();
  });

  buttonContainer.appendChild(downloadButton);
  buttonContainer.appendChild(copyButton);
  buttonContainer.appendChild(closeButton);

  document.body.appendChild(previewContainer);
  console.log('Preview shown');
}

function closePreview() {
  const previewContainer = document.getElementById('html-screenshot-preview');
  if (previewContainer) {
    previewContainer.remove();
  }
  isProcessingScreenshot = false;
  clearSelectedElements();
  toggleSelectionStatus(false); // Hide status display
  updateSelectionStatus();
}

function copyImageToClipboard(dataUrl) {
  const img = new Image();
  img.src = dataUrl;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(blob => {
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item]);
    });
  };
}