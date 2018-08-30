module.exports = ['$http', '$scope', '$rootScope', function ($http, $scope, $rootScope) {
    $scope.trains = {};
    $scope.hours = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
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
    $scope.hoursValid = function (a, b) {
        return Number(a)>Number(b)
    }

    $scope.verifyHours = function (train, departure) {
        var a = Number($scope.firstHour);
        var b = Number($scope.secondHour);
        if (a < b && a != 0 && b != 0) {
            var date = 0;
            if (departure) {
                date = (new Date (train.departure)).getHours();
            } else {
                date = (new Date (train.arrival)).getHours();
            }
            if (a < date && b > date) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}];