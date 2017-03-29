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
app.controller('Controller', function ($scope, $http, $localStorage, $location, $window, socket) {

    //Custom function to sort the array
    var sort_by = function (field, reverse, primer) {

        var key = primer ?
            function (x) { return primer(x[field]) } :
            function (x) { return x[field] };

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a < b) - (b < a));
        }
    }

    //Custom function to sort the log messages
    var log_sort_by = function (field, reverse, primer) {

        var key = primer ?
            function (x) { return primer(x[field]) } :
            function (x) { return x[field] };

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }

    //Initialization method. Called when the page is loaded
    $scope.init = function () {

        $scope.startMessage = true;
        $scope.initialize = false;
        $scope.client = false;
        //$scope.data = [];
        $scope.data = [
            {
                process: 1,
                online: false,
                isLeader: false,
                current: false,
                closed: true
            },
            {
                process: 2,
                online: false,
                isLeader: false,
                current: false,
                closed: true
            },
            {
                process: 3,
                online: false,
                isLeader: false,
                current: false,
                closed: true
            },
            {
                process: 4,
                online: false,
                isLeader: false,
                current: false,
                closed: true
            },
            {
                process: 5,
                online: false,
                isLeader: false,
                current: false,
                closed: true
            },
            {
                process: 6,
                online: false,
                isLeader: false,
                current: false,
                closed: true
            }
        ];

        $scope.message = [];
        $scope.logMessage = [];

        //Checks to see if the window is the client window or the process window
        if ($location.port() == 3000) {
            $scope.client = true;
        }
        else {
            //If it is a process window, the appropriate process number is assigned
            switch ($location.port()) {
                case 3001: $scope.processNo = 1;
                    break;
                case 3002: $scope.processNo = 2;
                    break;
                case 3003: $scope.processNo = 3;
                    break;
                case 3004: $scope.processNo = 4;
                    break;
                case 3005: $scope.processNo = 5;
                    break;
                case 3006: $scope.processNo = 6;
                    break;
            }
        }

    };

    //Waiting for the socket to communicate to the client
    socket.on('process_connection', (data) => {
        //This updates the process status in the GUI based on if its online or offline
        $scope.initialize = true;
        var check = true;
        $scope.startMessage = false;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process == data.process) {
                check = false;
                $scope.data[i].online = data.online;
                $scope.data[i].closed = data.closed;
                $scope.showConnectionMessage(data.online, data.process);
                console.log($scope.logMessage);
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
            $scope.showConnectionMessage(data.online, data.process);
        } 
        $scope.data.sort(sort_by('process', true, parseInt));
        $scope.startSimulation();
    });

    //This method updates the status of the process on the log
    $scope.showConnectionMessage = function (online, process) {
        switch (online) {
            case true: $scope.logMessage.push({
                id: $scope.logMessage.length,
                message: "Process: " + process + " has come online",
                class: "log-online"
            });
                break;
            case false:
                $scope.logMessage.push({
                    id: $scope.logMessage.length,
                    message: "Process: " + process + " has gone offline",
                    class: "log-offline"
                });
                break;
        }
        $scope.logMessage.sort(log_sort_by('id', true, parseInt));
    };

    //This method starts the ring election algorithm simulation
    //$scope.startSimulation = function () {

    //    $scope.startMessage = false;

    //    var max = 0;
    //    for (var i = 0; i < $scope.data.length; i++) {
    //        if ($scope.data[i].online) {
    //            $scope.logMessage.push({
    //                id: $scope.logMessage.length,
    //                message: $scope.data[i].process +" sends message"
    //            });
    //            if ($scope.data[i].process > max) {
    //                max = $scope.data[i].process;
    //            }
    //        }
    //        $scope.data[i].isLeader = false;
    //    }
    //    $scope.data[max - 1].isLeader = true;
    //    $scope.logMessage.push({
    //        id: $scope.logMessage.length,
    //        message: "Process " + max + " is chosen as the leader as it is the largest"
    //    });
    //    $scope.logMessage.push({
    //        id: $scope.logMessage.length,
    //        message: "-----------------------------------------"
    //    });
    //    $scope.logMessage.sort(log_sort_by('id', true, parseInt));
    //};

    $scope.startSimulation = function () {

    };

    //This method simulates a crash
    $scope.crash = function (id) {
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process == id) {
                $scope.data[i].online = false;
                $scope.showConnectionMessage($scope.data[i].online, $scope.data[i].process);
            }
        }

        $scope.startSimulation();
    };

    //This method restarts a crashed server
    $scope.restart = function (id) {
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process == id) { 
                if ($scope.data[i].closed) {
                    var port = "300" + id;
                    var url = "http://localhost:" + port + "/";
                    $window.open(url);
                }
                else {
                    $scope.data[i].online = true;
                    $scope.showConnectionMessage($scope.data[i].online, $scope.data[i].process);
                }
            }
        }

        $scope.startSimulation();
    };

});
