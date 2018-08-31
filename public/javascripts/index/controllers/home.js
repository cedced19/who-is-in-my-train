module.exports = ['$http', '$scope', '$window', 'notie', function ($http, $scope, $window, notie) {
    $scope.trains = {};
    $scope.hours = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    function onError() { // Send message error
        notie.alert(3, 'Une erreur est survenue.', 3);
    }

    $scope.dates = [];
    for (var k = 0; k < 5; k++) {
        var now = new Date();
        now.setDate(now.getDate() + k);
        $scope.dates.push(now);
    }

    $http.get('/trains-config.json').success(function (data) {
        $scope.config = data;
    }).error(onError);
    $http.get('/trains-1-to-2.json').success(function (data) {
        $scope.trains.a = data;
    }).error(onError);
    $http.get('/trains-2-to-1.json').success(function (data) {
        $scope.trains.b = data;
    }).error(onError);

    $scope.authenticate = function (cb) {
        if (typeof $scope.user == 'object') return cb();
        $http.get('/api/profile').success(function (data) {
            if (data.hasOwnProperty('error')) {
                $scope.user = false;
            } else {
                $scope.user = data;
            }
            if (cb) cb();
        }).error(function () {
            $scope.user = false;
            if (cb) cb();
        });
    }

    $scope.authenticate(function () {
        $http.get('/api/planned-trains').success(function (data) {
            $scope.$evalAsync(function () {
                data.forEach(function (el) {
                    var i = $scope.trains[(el.train_type) ? 'a' : 'b'].findIndex(function (k) {
                        return k.id == el.train_id && el.train_date == k[(el.train_type) ? 'departure' : 'arrival'];
                    });
                    if (typeof i != 'undefined') {
                        var train = $scope.trains[(el.train_type) ? 'a' : 'b'][i];
                        if (Array.isArray(train.planned)) {
                            train.planned.push(el);
                        } else {
                            train.planned = [el];
                        }
                        if (el.user_id == $scope.user.id) {
                            train.isTakingTrain = el;
                        } 
                    }
                });
            });
        }).error(onError);
    });

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

    $scope.isTakingTrain = function (train) {
        if (typeof train.takingTrain == 'undefined' && typeof train.planned == 'undefined') {
            return false;
        }
        if (typeof train.planned != 'undefined') {
            if (train.planned.find(function (el) {
                return el.user_name == $scope.user.name
            })) {
                return true
            }
        }
        return false
    }

    $scope.takeTrain = function (train, departure) {
        $scope.authenticate(function () {
            if ($scope.user) {
                if (typeof train.planned != 'undefined') {
                    if (train.planned.find(function (el) {
                        return el.user_name == $scope.user.name;
                    })) {
                        return notie.alert(3, 'Vous prenez déjà ce train', 3);
                    }
                }
                $http.post('/api/planned-trains', {
                    train_date: (departure) ? train.departure : train.arrival,
                    train_id: train.id,
                    train_type: departure
                }).success(function (data) {
                    if (Array.isArray(train.planned)) {
                        train.planned.push(data);
                    } else {
                        train.planned = [data];
                    }
                    train.takingTrain = data;
                    notie.alert(1, 'Train enregistré', 3);
                }).error(onError);
            } else {
                $window.open('/login', '_blank');
                notie.alert(3, 'Vous devez vous connecter', 3);
            }
        });
    }
}];