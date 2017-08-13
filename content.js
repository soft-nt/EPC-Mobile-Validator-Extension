var validationResults = [
  {
    "RuleName": "Rule 1",
    "ValidationIssues": [
      {
        "Type": "error",
        "Description": "Something"
      }
    ]
  }
];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Just retrieving the document content
  sendResponse(validationResults);
});

