chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  // Just retrieving the document content
  sendResponse(document);
});

