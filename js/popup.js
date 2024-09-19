console.log('popup.js loaded');

function applyButtonStyle(button, color = '#4CAF50', icon = '') {
  button.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 16px;
    margin: 5px;
    border: none;
    border-radius: 4px;
    background-color: ${color};
    color: #ffffff;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  `;
  
  if (icon) {
    button.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${button.textContent}`;
  }

  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = adjustColor(color, 20);
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)';
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = color;
    button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
  });
  button.addEventListener('mousedown', () => {
    button.style.backgroundColor = adjustColor(color, -20);
    button.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.4)';
  });
  button.addEventListener('mouseup', () => {
    button.style.backgroundColor = adjustColor(color, 20);
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)';
  });
}

function adjustColor(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

document.addEventListener('DOMContentLoaded', function() {
  var startSelectionButton = document.getElementById('startSelection');
  applyButtonStyle(startSelectionButton, '#3f51b5', '🔍');
  startSelectionButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0].status === 'complete') {
        chrome.tabs.sendMessage(tabs[0].id, {action: "startSelection"}, function(response) {
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError.message);
          } else if (response) {
            console.log('Response:', response);
          }
        });
      } else {
        console.log('Page is still loading. Please wait and try again.');
        // You can add a user prompt here
      }
    });
  });
});
