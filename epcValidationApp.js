var epcValidationApp = angular.module('epcValidationApp', []);

// Add config to handle image coming from Chrome Extension package
epcValidationApp.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);
}]);

epcValidationApp.controller('EPCValidationController', function ($scope, epcValidatorService) {
  decorateValidationRuleResults = function (result) {
    result.forEach(function(rules) {
      rules.ValidationIssues.forEach(function(issue) {
        if (chrome.extension) {
          issue.ImgUrl = chrome.runtime.getURL("images/" + issue.Type + ".png");
        }
        else {
          issue.ImgUrl = "images/" + issue.Type + ".png"
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
      $scope.validationRules = decorateValidationRuleResults(value);
    });
  }
});


// Services that we can extract outside later

var epcValidatorService = epcValidationApp.service('epcValidatorService', function ($q) {
  this.requestPageValidation = function () {
    var defer = $q.defer();

    chrome.runtime.sendMessage({ action: "CheckEPC", "tabId": chrome.devtools.inspectedWindow.tabId }, function (response) {
      defer.resolve(response);
    });

    return defer.promise
  }
});