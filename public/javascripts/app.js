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
app.controller('Controller', function ($scope, $http, $localStorage, $location, socket) {

    $scope.data = [];
    $scope.start = false;
    //test data
    $scope.data = [{ process: 1, online: true }, { process: 2, online: true }, { process: 3, online: true }, { process: 4, online: true }, { process: 5, online: true }, { process: 6, online: true }];

    socket.on('process_1_connection', (data) => {
        var isExist = false;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process != undefined && $scope.data[i].process == 1) {
                isExist = true;
            }
        }

        if (!isExist) {
            $scope.data.push({
                process: 1,
                online: data,
                successor: 2,
                isLeader: false
            });
        }
        else {
            for (var i = 0; i < $scope.data.length; i++) {
                if ($scope.data[i].process != undefined && $scope.data[i].process == 1) {
                    $scope.data[i].online = data
                }
            }
        }
    });

    socket.on('process_2_connection', (data) => {
        var isExist = false;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process != undefined && $scope.data[i].process == 2) {
                isExist = true;
            }
        }

        if (!isExist) {
            $scope.data.push({
                process: 2,
                online: data,
                successor: 3,
                isLeader: false
            });
        }
        else {
            for (var i = 0; i < $scope.data.length; i++) {
                if ($scope.data[i].process != undefined && $scope.data[i].process == 2) {
                    $scope.data[i].online = data
                }
            }
        }
    });

    socket.on('process_3_connection', (data) => {
        var isExist = false;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process != undefined && $scope.data[i].process == 3) {
                isExist = true;
            }
        }

        if (!isExist) {
            $scope.data.push({
                process: 3,
                online: data,
                successor: 4,
                isLeader: false
            });
        }
        else {
            for (var i = 0; i < $scope.data.length; i++) {
                if ($scope.data[i].process != undefined && $scope.data[i].process == 3) {
                    $scope.data[i].online = data
                }
            }
        }
    });

    socket.on('process_4_connection', (data) => {
        var isExist = false;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process != undefined && $scope.data[i].process == 4) {
                isExist = true;
            }
        }

        if (!isExist) {
            $scope.data.push({
                process: 4,
                online: data,
                successor: 5,
                isLeader: false
            });
        }
        else {
            for (var i = 0; i < $scope.data.length; i++) {
                if ($scope.data[i].process != undefined && $scope.data[i].process == 4) {
                    $scope.data[i].online = data
                }
            }
        }
    });

    socket.on('process_5_connection', (data) => {
        var isExist = false;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process != undefined && $scope.data[i].process == 5) {
                isExist = true;
            }
        }

        if (!isExist) {
            $scope.data.push({
                process: 5,
                online: data,
                successor: 6,
                isLeader: false
            });
        }
        else {
            for (var i = 0; i < $scope.data.length; i++) {
                if ($scope.data[i].process != undefined && $scope.data[i].process == 5) {
                    $scope.data[i].online = data
                }
            }
        }
    });

    socket.on('process_6_connection', (data) => {
        var isExist = false;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process != undefined && $scope.data[i].process == 6) {
                isExist = true;
            }
        }

        if (!isExist) {
            $scope.data.push({
                process: 6,
                online: data,
                successor: 1,
                isLeader: false
            });
        }
        else {
            for (var i = 0; i < $scope.data.length; i++) {
                if ($scope.data[i].process != undefined && $scope.data[i].process == 6) {
                    $scope.data[i].online = data
                }
            }
        }
    });

});
