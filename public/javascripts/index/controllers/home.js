module.exports = ['$http', '$scope', '$rootScope', '$window', 'notie', function ($http, $scope, $rootScope, $window, notie) {
    $scope.trains = {};
    $scope.hours = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    $scope.dates = [];
    for (var k = 0; k < 5; k++) {
        var now = new Date();
        now.setDate(now.getDate() + k);
        $scope.dates.push(now);
    }

    $http.get('/trains-config.json').success(function (data) {
        $scope.config = data;
    }).error($rootScope.$error);
    $http.get('/trains-1-to-2.json').success(function (data) {
        $scope.trains.a = data;
    }).error($rootScope.$error);
    $http.get('/trains-2-to-1.json').success(function (data) {
        $scope.trains.b = data;
    }).error($rootScope.$error);

    $scope.objLength = function (obj) {
        return Object.keys(obj).length;
    }
    $scope.hoursValid = function (a, b) {
        return Number(a) > Number(b)
    }

    $scope.verifyHours = function (train, departure) {
        var a = Number($scope.firstHour);
        var b = Number($scope.secondHour);
        if (a < b && a != 0 && b != 0) {
            var date = 0;
            if (departure) {
                date = (new Date(train.departure)).getHours();
            } else {
                date = (new Date(train.arrival)).getHours();
            }

            if (a <= date && date < b) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    $scope.verifyDate = function (train, departure) {
        if ($scope.date != '' && typeof $scope.date != 'undefined') {
            var date = 0;
            if (departure) {
                date = (new Date(train.departure)).getDate();
            } else {
                date = (new Date(train.arrival)).getDate();
            }
            if ((new Date($scope.date)).getDate() == date) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    $scope.takeTrain = function (train, departure) {
        $rootScope.authenticate(function () {
            if ($rootScope.user) {
                $http.post('/api/take_train', {
                    train_date: (departure) ? train.departure : train.arrival,
                    train_id: train.id
                }).success(function (data) {
                    notie.alert(1, 'Train enregistré', 3);
                }).error($rootScope.$error);
            } else {
                $window.open('/login', '_blank');
                notie.alert(3, 'Vous devez vous connecter', 3);
            }
        });
    }
}];