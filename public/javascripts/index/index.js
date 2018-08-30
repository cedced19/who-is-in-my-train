require('angular'); /*global angular*/
require('angular-route');
require('ng-notie');
require('./angular-locale_fr-fr.js');


var app = angular.module('WhoIsInMyTrain', ['ngNotie', 'ngRoute']);
app.config(['$routeProvider', function($routeProvider) {
        // Route configuration
        $routeProvider
        .when('/', {
            templateUrl: '/views/home.html',
            controller: 'HomeCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
app.controller('HomeCtrl', require('./controllers/home.js'));