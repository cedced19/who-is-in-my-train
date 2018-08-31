require('angular'); /*global angular*/
require('ng-notie');
require('./angular-locale_fr-fr.js');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' });
}
var app = angular.module('WhoIsInMyTrain', ['ngNotie']);
app.controller('HomeCtrl', require('./controllers/home.js'));