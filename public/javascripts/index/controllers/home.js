module.exports = ['$http', '$scope', '$rootScope', function ($http, $scope, $rootScope) {
    $scope.trains = {};
    $http.get('/trains-config.json').success(function(data) {
        $scope.config = data;
    }).error($rootScope.$error);
    $http.get('/trains-1-to-2.json').success(function(data) {
        $scope.trains.a = data;
    }).error($rootScope.$error);
    $http.get('/trains-2-to-1.json').success(function(data) {
        $scope.trains.b = data;
    }).error($rootScope.$error);
    $scope.objLength = function (obj) {
        return Object.keys(obj).length;
    }
}];