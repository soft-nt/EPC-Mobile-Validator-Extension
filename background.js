chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        var tabId = request.tabId;
        if (tabId) {
            chrome.tabs.executeScript(tabId, { file: "content.js" }, function () {
                chrome.tabs.sendMessage(tabId, request, function (results) {
                    //TODO: Process the document
                    sendResponse(results);
                });
            });
        }

        return true;
    });