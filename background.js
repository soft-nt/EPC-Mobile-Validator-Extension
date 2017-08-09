chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.action) {
            case "CheckEPC":
                var tabId = request.tabId;
                if (tabId) {
                    chrome.tabs.executeScript(tabId, { file: "content.js" }, function () {
                        chrome.tabs.sendMessage(tabId, {}, function (results) {
                            //TODO: Process the document
                            sendResponse(results);
                        });
                    });
                }

                break;
        }

        return true;
    });