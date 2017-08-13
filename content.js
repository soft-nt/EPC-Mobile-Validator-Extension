var validationResults = [];
var ruleEngines = [];

/*
------------- BEGIN RULE ENGINES -------------
each function needs to return that JSON format
{
    "RuleId": "Rule Id",
    "RuleDescription": ""
    "ValidationIssues": [
      {
        "Type": "Type of error (error; warning)",
        "Description": "Deeper explanation of the error"
      }
    ]
  }
*/

// Rule engine - H1 size validation no more than 10px
ruleEngines.push(function () {
  var fontMaxSize = 10;

  var result = {
    "RuleId": "RuleH1Size",
    "RuleDescription": "H1 to H3 elements should not be greater than " + fontMaxSize,
    "ValidationIssues": []
  };

  var h1Elts = document.querySelectorAll("h1,h2,h3");

  h1Elts.forEach(function (element) {
    var eltStyle = window.getComputedStyle(element);
    var fontSize = parseFloat(eltStyle.getPropertyValue("font-size"));

    if (fontSize > fontMaxSize && element.textContent) {
      // Creating the issue
      result.ValidationIssues.push({
        "Type": "error",
        "Description": "The text with the content \"" + element.textContent + "\" has a size of " + fontSize
      });
    }
  }, this);

  return result;
});

/*
------------- END RULE ENGINES -------------
*/

// Processing the validation message
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Just retrieving the document content
  ruleEngines.forEach(function (ruleEngineFct) {
    validationResults.push(ruleEngineFct());
  }, this);

  sendResponse(validationResults);

  return true;
});