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
app.run(['$rootScope', '$http', 'notie', function ($rootScope, $http,  notie) {
    $rootScope.$error = function () { // Send message error
        notie.alert(3, 'Une erreur est survenue.', 3);
    }
    $rootScope.authenticate = function (cb) {
        if (typeof $rootScope.user == 'object') return cb();
        $http.get('/api/profile').success(function (data) {
            if (data.hasOwnProperty('error')) {
                $rootScope.user = false;
            } else {
                $rootScope.user = data;
            }
            if (cb) cb();
        }).error(function () {
            $rootScope.user = false;
            if (cb) cb();
        });
    }
    $rootScope.authenticate();
}]);
app.controller('HomeCtrl', require('./controllers/home.js'));