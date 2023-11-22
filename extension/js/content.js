// Function to get the selected text
function getSelectedText() {
    let text = '';
    if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

// Function to determine which color to use based on sentiment score
function getSentimentColor(score) {
    if (score > 0.1) return 'lightgreen'; // Positive sentiment
    if (score < -0.1) return 'salmon'; // Negative sentiment
    return 'lightyellow'; // Neutral sentiment
}

// Function to wrap selected text in a span and apply background color
function highlightSelection(color) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = color;
    span.textContent = selection.toString();

    range.deleteContents();
    range.insertNode(span);

    // Optionally, remove the selection
    selection.removeAllRanges();
}

// Listen for mouseup event to detect text selection
document.addEventListener('mouseup', () => {
    let selectedText = getSelectedText();
    if (selectedText.length > 0) {
        console.log('Selected text:', selectedText);
        // Send the selected text to the background script
        chrome.runtime.sendMessage({ text: selectedText }, function(response) {
            // Use the response here to apply the color
            // Assume the background script sends back a response with a sentiment score
            if (response && response.sentimentScore !== undefined) {
                const color = getSentimentColor(response.sentimentScore); // Use the sentiment score to get the color
                highlightSelection(color); // Highlight the selection with the color
            }
        });
    }
});
