var epcValidationApp = angular.module('epcValidationApp', []);

epcValidationApp.controller('EPCValidationController', function ($scope, epcValidatorService) {
  decorateValidationRuleResults = function (result) {
    result.forEach(function(rules) {
      rules.ValidationIssues.forEach(function(issue) {
        if (chrome.extension) {
          issue.Img = chrome.extension.getURL("images/" + issue.Type + ".png");
        }
        else {
          issue.Img = "images/" + issue.Type + ".png"
        }
      }, this);
    }, this);
    
    return result;
  }
  
  $scope.validationRules = decorateValidationRuleResults([
    {
      "RuleName": "Rule 1",
      "ValidationIssues": [
        {
          "Type": "error",
          "Description": "Something"
        },
        {
          "Type": "warning",
          "Description": "Something"
        },
        {
          "Type": "error",
          "Description": "Something"
        }
      ]
    },
    {
      "RuleName": "Rule 2",
      "ValidationIssues": [
        {
          "Type": "error",
          "Description": "Sosad sadadsad mething"
        }
      ]
    }
  ]);

  $scope.validatePage = function () {
    epcValidatorService.requestPageValidation().then(function (value) {
      $scope.validationRules = value;
    });
  }
});


// Services that we can extract outside later

var epcValidatorService = epcValidationApp.service('epcValidatorService', function ($q) {
  this.requestPageValidation = function () {
    var defer = $q.defer();

    chrome.runtime.sendMessage({ action: "CheckEPC", "tabId": chrome.devtools.inspectedWindow.tabId }, function (response) {
      alert(response);
      defer.resolve(response);
    });

    return defer.promise
  }
});