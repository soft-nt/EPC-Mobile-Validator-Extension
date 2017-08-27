var contentInjected = false;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("Is content injected: " + contentInjected);
        
        var tabId = request.tabId;
        if (tabId) {
            // Injecting only once
            if (contentInjected == false) {
                chrome.tabs.executeScript(tabId, { file: "content.js" }, function () {
                    chrome.tabs.sendMessage(tabId, request, function (results) {
                        contentInjected = true;
                        //TODO: Process the document
                        sendResponse(results);
                    });
                });
            }
            else {
                chrome.tabs.sendMessage(tabId, request, function (results) {
                    //TODO: Process the document
                    sendResponse(results);
                });
            }
        }

        return true;
    });