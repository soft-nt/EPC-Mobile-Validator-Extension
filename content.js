chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Just retrieving the document content
  sendResponse({"Test": "asdasd"});
});

