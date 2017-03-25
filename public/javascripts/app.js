const app = angular.module('app', ['ngStorage']);

//Factory definition to integrate socket.io in order to use sockets with node.js
app.factory('socket', function ($rootScope) {
    const socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

//Controller definition 
app.controller('Controller', function ($scope, $http, $localStorage, $location,$window, socket) {


    var sort_by = function (field, reverse, primer) {

        var key = primer ?
            function (x) { return primer(x[field]) } :
            function (x) { return x[field] };

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a < b) - (b < a));
        }
    }

    $scope.init = function () {
        $scope.data = [];
        $scope.message = [];
        $scope.startMessage = true;
        $scope.logMessage = [];
        $scope.start = true;
        $scope.client = false;
        if ($location.port() == 3000) {
            $scope.client = true;
        };
    };
    //test data
    // $scope.data = [{ process: 1, online: true }, { process: 2, online: true }, { process: 3, online: true }, { process: 4, online: true }, { process: 5, online: true }, { process: 6, online: true }];

    socket.on('process_connection', (data) => {
        var check = true;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process == data.process) {
                check = false;
                $scope.data[i].online = data.online;
                $scope.data[i].closed = data.closed;
            }
        }

        if (check) {
            $scope.data.push({
                process: data.process,
                online: data.online,
                isLeader: false,
                current: false,
                closed: data.closed
            });
        }
        
        console.log(data);
    });

    $scope.start = function () {

        $scope.startMessage = false;
        $scope.start = false;

        var max = 0;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].online) {
                $scope.logMessage.push($scope.data[i].process + " sends message to " + $scope.data[i].successor);
                if ($scope.data[i].process > max) {
                    max = $scope.data[i].process;
                }
            }
        }
        $scope.data[max - 1].isLeader = true;
        $scope.logMessage.push("Process " + max + " is chosen as the leader as it is the largest");
    };

    $scope.stop = function () {
        $scope.start = true;
    };

    $scope.displayCurrent = function (id) {
        $scope.data[id].current = true;

        $scope.message.push({
            currentProcess: id,
            successor: $scope.data[id].successor
        });
    };

    $scope.crash = function (id) {
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process == id) {
                $scope.data[i].online = false;
                socket.emit('test');
            }
        }
    };

    $scope.restart = function (id) {
        for (var i = 0; i < $scope.data.length; i++) { 
            if ($scope.data[i].process == id) {
                if ($scope.data[i].closed)
                {
                    var port = "300" + id;
                    var url = "http://localhost:"+port+"/";
                    $window.open(url);
                }
                else
                {
                    $scope.data[i].online = true; 
                }
            }
        }
    };

});
