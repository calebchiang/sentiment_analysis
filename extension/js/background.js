chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("Message received in background.js:", message);
    fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message.text }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Sentiment score:', data.score);

            // Store the sentiment score
            chrome.storage.local.set({ sentiment: data.score }, function() {
                console.log('Sentiment score saved to local storage.');
            });

            // Respond to content.js with the sentiment score
            sendResponse({ sentimentScore: data.score });
        })
        .catch(error => {
            console.error('Error:', error);
            sendResponse({ sentimentScore: null }); // Send null if there was an error
        });

    return true; // Indicates an asynchronous response (response will be sent later)
});
