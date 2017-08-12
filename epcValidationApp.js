var epcValidationApp = angular.module('epcValidationApp', []);

epcValidationApp.controller('EPCValidationController', function PhoneListController($scope, epcValidatorService) {
    $scope.result = "Nicolas";

    $scope.validatePage = function () {
        epcValidatorService.requestPageValidation().then(function(value) {
            // $("#result").text("asdasd" + JSON.stringify(value));
            $scope.result = JSON.stringify(value);
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