function extractText() {
    console.log('Extracting text from selected elements');
    if (selectedElements.length !== 2) {
      console.error('Two elements must be selected');
      alert('Please select two elements before extracting text.');
      return;
    }
  
    const startElement = selectedElements[0];
    const endElement = selectedElements[1];
  
    // Ensure the start element comes before the end element in the DOM
    if (!startElement.compareDocumentPosition(endElement) & Node.DOCUMENT_POSITION_FOLLOWING) {
      [startElement, endElement] = [endElement, startElement];
    }
  
    let extractedContent = '';
    let currentNode = startElement;
    let processedNodes = new Set(); // 用於跟踪已處理的節點

    while (currentNode && currentNode !== endElement.nextSibling) {
      if (!processedNodes.has(currentNode)) {
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
          extractedContent += getFormattedText(currentNode, processedNodes);
        } else if (currentNode.nodeType === Node.TEXT_NODE) {
          extractedContent += currentNode.textContent.trim() + ' ';
        }
        processedNodes.add(currentNode);
      }
      currentNode = getNextNode(currentNode, endElement);
    }
  
    // Remove extra blank lines and trim
    extractedContent = extractedContent.replace(/\n{3,}/g, '\n\n').trim();
  
    copyToClipboard(extractedContent);
    alert('Text extracted and copied to clipboard.');
    console.log('Extracted text:', extractedContent);
  }
  
  function getFormattedText(element, processedNodes) {
    let text = '';
    for (let node of element.childNodes) {
      if (!processedNodes.has(node)) {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent.trim() + ' ';
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toLowerCase();
          if (['div', 'p', 'br', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
            text = text.trim() + '\n' + getFormattedText(node, processedNodes) + '\n';
          } else {
            text += getFormattedText(node, processedNodes);
          }
        }
        processedNodes.add(node);
      }
    }
    return text.trim();
  }
  
  function getNextNode(node, endElement) {
    if (node === endElement) {
      return null;
    }
    if (node.firstChild) {
      return node.firstChild;
    }
    while (node) {
      if (node.nextSibling) {
        return node.nextSibling;
      }
      node = node.parentNode;
    }
    return null;
  }