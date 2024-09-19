let selectedElements = [];
let hoverElement = null;

function enableElementSelection() {
  console.log('Enabling element selection');
  document.body.style.cursor = 'crosshair';
  document.addEventListener('mouseover', handleMouseOver);
  document.addEventListener('mouseout', handleMouseOut);
  document.addEventListener('click', handleClick);
  showSelectionStatus();
  toggleSelectionStatus(true); // Show status box
}

function handleMouseOver(event) {
  if (hoverElement) {
    hoverElement.classList.remove('hover-element');
  }
  hoverElement = event.target;
  hoverElement.classList.add('hover-element');
  event.stopPropagation();
}

function handleMouseOut(event) {
  if (hoverElement) {
    hoverElement.classList.remove('hover-element');
    hoverElement = null;
  }
}

function handleClick(event) {
  event.preventDefault();
  if (hoverElement) {
    selectElement(hoverElement);
    hoverElement.classList.remove('hover-element');
    hoverElement = null;
  }
}

function selectElement(element) {
  console.log('Element selected');
  selectedElements.push(element);
  element.classList.add('selected-element');

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

function showSelectionStatus() {
  const statusBox = document.createElement('div');
  statusBox.id = 'selection-status';
  statusBox.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 15px;
    border-radius: 20px;
    font-family: Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;
    z-index: 9999;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  `;
  document.body.appendChild(statusBox);
  updateSelectionStatus();
}

function updateSelectionStatus() {
  const statusBox = document.getElementById('selection-status');
  if (statusBox) {
    const count = selectedElements.length;
    statusBox.textContent = `Selected: ${count} / 2`;
    
    // Add animation effect
    statusBox.style.transform = 'scale(1.1)';
    statusBox.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
    
    // Change color based on the number of selected elements
    if (count === 0) {
      statusBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    } else if (count === 1) {
      statusBox.style.backgroundColor = 'rgba(255, 165, 0, 0.8)'; // Orange
    } else if (count === 2) {
      statusBox.style.backgroundColor = 'rgba(0, 128, 0, 0.8)'; // Green
    }
    
    // Reset animation effect
    setTimeout(() => {
      statusBox.style.transform = 'scale(1)';
      statusBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    }, 300);
  }
}

function disableElementSelection() {
  document.removeEventListener('mouseover', handleMouseOver);
  document.removeEventListener('mouseout', handleMouseOut);
  document.removeEventListener('click', handleClick);
  document.body.style.cursor = 'default';
  toggleSelectionStatus(false); // Hide status box
}