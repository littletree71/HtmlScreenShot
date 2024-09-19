async function copyHTML() {
    console.log('Copying HTML');
    
    selectedElements.forEach(el => el.classList.remove('selected-element'));
    
    getHTMLBetweenElements().then(htmlContent => {  
        selectedElements.forEach(el => el.classList.add('selected-element'));
        
        navigator.clipboard.writeText(htmlContent).then(() => {
            console.log('HTML copied to clipboard');
            alert('HTML copied to clipboard');
        }).catch(err => {
            console.error('Error copying HTML to clipboard:', err);
            // Fallback to execCommand if clipboard API fails
            const textarea = document.createElement('textarea');
            textarea.value = htmlContent;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            console.log('HTML copied to clipboard using execCommand');
            alert('HTML copied to clipboard');
        });
    }).catch(err => {
        console.error('Error getting HTML between elements:', err);
        alert('Failed to copy HTML. Please try again.');
    });
}

function getHTMLBetweenElements() {
    return new Promise((resolve, reject) => {
        if (selectedElements.length !== 2) {
            console.error('Two elements must be selected');
            return reject('Two elements must be selected');
        }
        
        let [first, second] = selectedElements;
        
        // Find the common ancestor and determine which element has a higher-level parent
        const firstParents = getParents(first);
        const secondParents = getParents(second);
        let commonAncestor = null;
        let higherLevelElement = null;
        
        for (let i = 0; i < firstParents.length && i < secondParents.length; i++) {
            if (firstParents[i] === secondParents[i]) {
                commonAncestor = firstParents[i];
            } else {
                higherLevelElement = firstParents.length > secondParents.length ? first : second;
                break;
            }
        }
        
        // Get the highest level parent that's not common
        let highestParent = commonAncestor;
        if (higherLevelElement) {
            const parents = higherLevelElement === first ? firstParents : secondParents;
            highestParent = parents[parents.indexOf(commonAncestor) - 1] || highestParent;
        }
        
        // Clone the highest parent
        const parentClone = highestParent.cloneNode(false);
        
        // Get the content between selected elements
        const range = document.createRange();
        range.setStartBefore(first);
        range.setEndAfter(second);
        const fragment = range.cloneContents();
        
        // Append the content to the parent clone
        parentClone.appendChild(fragment);
        
        const div = document.createElement('div');
        div.appendChild(parentClone);
        
        // Remove red border
        div.querySelectorAll('.selected-element').forEach(el => el.classList.remove('selected-element'));
        
        // Get all styles 
        const styles = Array.from(document.styleSheets)
            .map(styleSheet => {
                try {
                    return Array.from(styleSheet.cssRules)
                        .map(rule => rule.cssText)
                        .join('');
                } catch (e) {
                    console.warn('Access to stylesheet %s is denied. Ignoring...', styleSheet.href);
                    return '';
                }
            })
            .join('');
        
        // Add style to HTML 
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        div.prepend(styleElement);
        
        // Add meta charset tag
        const metaElement = document.createElement('meta');
        metaElement.setAttribute('charset', 'UTF-8');
        div.prepend(metaElement);
        
        // Convert images to base64
        const images = div.querySelectorAll('img');
        const promises = Array.from(images).map(img => {
            const src = img.src;
            return fetch(src)
                .then(response => response.blob())
                .then(blob => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        img.src = reader.result;
                        resolve();
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                }))
                .catch(err => console.error('Error converting image to Base64:', err));
        });
        
        Promise.all(promises).then(() => {
            resolve(new XMLSerializer().serializeToString(div));
        }).catch(reject);
    });
}

function getParents(element) {
    const parents = [element];
    while (element.parentElement) {
        parents.unshift(element.parentElement);
        element = element.parentElement;
    }
    return parents;
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}