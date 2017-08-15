var epcValidationApp = angular.module('epcValidationApp', []);

// Add config to handle image coming from Chrome Extension package
epcValidationApp.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);
}]);

epcValidationApp.controller('EPCValidationController', function ($scope, epcValidatorService) {
  decorateValidationRuleResults = function (result) {
    var nbRulesWIssues = 0;
    var nbRules = 0;

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

// Creating the component for the result with the HTML to Canvas view
epcValidationApp.directive('ruleIssue', function() {
  return {
    restrict: 'E',
    replace: false,
    require: "^ngModel",
    scope: {
      modelValue: '=ngModel'
    },
    template: '<img width="16px" height="16px" ng-src="{{modelValue.ImgUrl}}" /> {{modelValue.Description}} {{modelValue.Img}}',
    link: function($scope, $element, $attr) {
      /*html2canvas($scope.modelValue.elt, {
        onrendered: function(canvas) {
        	angular.element($element).append(canvas);
        },
        height : 50
      });*/
    }
  }
})