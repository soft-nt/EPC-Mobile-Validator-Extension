var epcValidationApp = angular.module('epcValidationApp', []);

// Add config to handle image coming from Chrome Extension package
epcValidationApp.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);
}]);

epcValidationApp.controller('EPCValidationController', function ($scope, epcValidatorService) {
  decorateValidationRuleResults = function (result) {
    var nbRulesWIssues = 0;
    var nbRules = 0;

    $scope.highlightImg = chrome.runtime.getURL("images/highlight.png");

    result.forEach(function (rules) {
      nbRules++;
      if (rules.ValidationIssues.length > 0) {
        nbRulesWIssues++;
      }

      rules.ValidationIssues.forEach(function (issue) {
        if (chrome.extension) {
          issue.ImgUrl = chrome.runtime.getURL("images/" + issue.Type + ".png");
        }
        else {
          issue.ImgUrl = "images/" + issue.Type + ".png"
        }
      }, this);
    }, this);

    result.RulesSummary = nbRulesWIssues + "/" + nbRules;

    return result;
  }

  $scope.validationRules = [];

  $scope.validatePage = function () {
    epcValidatorService.requestPageValidation().then(function (value) {
      $scope.validationRules = decorateValidationRuleResults(value);
    });
  }

  $scope.startHighlight = function (linkId) {
    epcValidatorService.startHighlight(linkId);
  }

  $scope.endHighlight = function (linkId) {
    epcValidatorService.endHighlight(linkId);
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

  this.startHighlight = function (linkId) {
    var defer = $q.defer();

    chrome.runtime.sendMessage({ action: "Start-Highlight", "linkId": linkId, "tabId": chrome.devtools.inspectedWindow.tabId }, function (response) {
      defer.resolve(response);
    });

    return defer.promise
  }

  this.endHighlight = function (linkId) {
    var defer = $q.defer();

    chrome.runtime.sendMessage({ action: "End-Highlight", "linkId": linkId, "tabId": chrome.devtools.inspectedWindow.tabId }, function (response) {
      defer.resolve(response);
    });

    return defer.promise
  }
});