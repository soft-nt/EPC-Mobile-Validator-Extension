chrome.devtools.panels.create("EPC Mobile Validator", "", "panel.html", function(panel) {
        chrome.runtime.sendMessage({action: "CheckEPC", "tabId": chrome.devtools.inspectedWindow.tabId}, function(response) {
    });
});
