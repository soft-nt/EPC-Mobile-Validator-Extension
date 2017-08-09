

$(document).ready(function () {
    $("#button").click(function () {
        chrome.runtime.sendMessage({ action: "CheckEPC", "tabId": chrome.devtools.inspectedWindow.tabId }, function (response) {
            // var doc = response.document;
            $("#result").text("asdasd" + JSON.stringify(response));        
        });
        
    });
});