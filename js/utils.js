console.log('utils.js loaded');

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
  
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
  
  function updateSelectionStatus() {
    const statusBox = document.getElementById('selection-status');
    if (statusBox) {
      statusBox.textContent = `Selected: ${selectedElements.length} / 2`;
    }
  }
  
  function toggleSelectionStatus(show) {
    const statusBox = document.getElementById('selection-status');
    if (statusBox) {
      statusBox.style.display = show ? 'block' : 'none';
    }
  }