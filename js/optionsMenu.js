let isProcessingScreenshot = false;

function showOptions() {
  console.log('Showing options menu');
  disableElementSelection();
  
  const optionsMenu = document.createElement('div');
  optionsMenu.id = 'html-screenshot-options-menu';
  optionsMenu.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #2c2c2c;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    padding: 16px;
    z-index: 9999;
    font-family: Arial, sans-serif;
  `;
  
  const options = [
    { text: 'Screenshot', icon: '📷', color: '#3f51b5' },
    { text: 'Extract Text', icon: '📝', color: '#009688' },
    { text: 'Copy HTML', icon: '📋', color: '#ff9800' },
    { text: 'Close', icon: '❌', color: '#f44336' }
  ];
  
  options.forEach(option => {
    const button = document.createElement('button');
    applyButtonStyle(button, option.color, option.icon);
    button.textContent = option.text;
    button.addEventListener('click', () => handleOption(option.text));
    optionsMenu.appendChild(button);
  });

  document.body.appendChild(optionsMenu);

  function handleClickOutside(event) {
    if (!optionsMenu.contains(event.target)) {
      closeOptionsMenu();
      document.removeEventListener('click', handleClickOutside);
    }
  }

  setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 0);
}

function handleOption(option) {
  console.log('Selected option:', option);
  if (selectedElements.length !== 2) {
    alert('Please select two elements before performing any action.');
    return;
  }
  
  switch (option) {
    case 'Screenshot':
      captureScreenshot().then(() => {
        closeOptionsMenu();
      }).catch((error) => {
        console.error('Error during screenshot capture:', error);
        alert('Failed to capture screenshot. Please try again.');
        closeOptionsMenu();
      });
      break;
    case 'Extract Text':
      extractText();
      closeOptionsMenu();
      break;
    case 'Copy HTML':
      copyHTML();
      closeOptionsMenu();
      break;
    case 'Close':
      closeOptionsMenu();
      break;
  }
}

function closeOptionsMenu() {
  const optionsMenu = document.getElementById('html-screenshot-options-menu');
  if (optionsMenu) {
    optionsMenu.remove();
  }
  if (!isProcessingScreenshot) {
    clearSelectedElements();
    toggleSelectionStatus(false); // Hide status display
  }
  updateSelectionStatus();
}

function clearSelectedElements() {
  selectedElements.forEach(el => el.classList.remove('selected-element'));
  selectedElements = [];
}