var validationResults = [];
var ruleEngines = [];

/*
------------- BEGIN RULE ENGINES -------------
each function needs to return that JSON format
{
    "RuleId": "Rule Id",
    "RuleArea" : "Typography",
    "RuleDescription": ""
    "ValidationIssues": [
      {
        "Type": "Type of error (error; warning)",
        "Description": "Deeper explanation of the error",
        "EltLinkId": "Id attached to the element"
      }
    ]
  }
*/

function createGuid() {  
  function s4() {  
     return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);  
  }  
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();  
}  

function AssignAndGetEltId(elt){
  var guid = createGuid();
  elt.setAttribute('link-id', guid);
  //elt.style.border = "solid red";
  return guid;
}

function highlightElt(eltId) {

}

// Rule engine - The minimum font size on the page is 13
ruleEngines.push(function () {
  var fontMinSize = 10;

  var result = {
    "RuleId": "MinFontSize",
    "RuleArea" : "Typography",
    "RuleDescription": "The minimum font size on the page is " + fontMinSize,
    "ValidationIssues": []
  };

  //var h1Elts = document.querySelectorAll("h1,h2,h3");
  var elts = document.querySelectorAll("h1,h2,h3,h4,td,th");

  elts.forEach(function (element) {
    var eltStyle = window.getComputedStyle(element);
    var fontSize = parseFloat(eltStyle.getPropertyValue("font-size"));

    if (fontSize < fontMinSize && element.textContent) {
      // Creating the issue
      result.ValidationIssues.push({
        "Type": "error",
        "Description": "The text with the content \"" + element.textContent + "\" has a size of " + fontSize,
        "EltLinkId": AssignAndGetEltId(element)
      });
    }
  }, this);

  return result;
});

// Rule engine - The max font size on the page is 20
ruleEngines.push(function () {
  var fontMaxSize = 20;

  var result = {
    "RuleId": "MaxFontSize",
    "RuleArea" : "Typography",
    "RuleDescription": "The maximum font size on the page is " + fontMaxSize,
    "ValidationIssues": []
  };

  //var h1Elts = document.querySelectorAll("h1,h2,h3");
  var elts = document.querySelectorAll("h1,h2,h3,h4,td,th");

  elts.forEach(function (element) {
    var eltStyle = window.getComputedStyle(element);
    var fontSize = parseFloat(eltStyle.getPropertyValue("font-size"));

    if (fontSize > fontMaxSize && element.textContent) {
      // Creating the issue
      result.ValidationIssues.push({
        "Type": "error",
        "Description": "The text with the content \"" + element.textContent + "\" has a size of " + fontSize,
        "EltLinkId": AssignAndGetEltId(element)
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

  switch (request.action) {
    case "CheckEPC":
      sendResponse(validationResults);
      break;
    case "Start-Highlight":
      
      break;
    case "End-Highlight":
      break;
  }
  

  return true;
});