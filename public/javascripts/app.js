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
app.controller('Controller', function ($scope, $http, $localStorage, $location, $window, $timeout, socket) {

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
        $scope.start = false;
        $scope.startMessage = true;
        $scope.initialize = false;
        $scope.client = false;
        $scope.counter = 5;
        $scope.data = [
            {
                process: 0,
                online: false,
                isLeader: false,
                current: false,
                closed: true
            },
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
            },
            {
                process: 7,
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
                case 3001: $scope.processNo = 0;
                    break;
                case 3002: $scope.processNo = 1;
                    break;
                case 3003: $scope.processNo = 2;
                    break;
                case 3004: $scope.processNo = 3;
                    break;
                case 3005: $scope.processNo = 4;
                    break;
                case 3006: $scope.processNo = 5;
                    break;
                case 3007: $scope.processNo = 6;
                    break;
                case 3008: $scope.processNo = 7;
                    break;
            }
        }

    };

    //Waiting for the socket to communicate to the client
    socket.on('process_connection', (data) => {
        //This updates the process status in the GUI based on if its online or offline
        $scope.initialize = true;

        $scope.startMessage = false;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process == data.process) {
                check = false;
                $scope.data[i].online = data.online;
                $scope.data[i].closed = data.closed;
                $scope.showConnectionMessage(data.online, data.process);
            }
        }

        $scope.data.sort(sort_by('process', true, parseInt));
        //$scope.startSimulation();
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

    $scope.onTimeout = function () {
        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout, 1000);
    }
    var mytimeout = $timeout($scope.onTimeout, 1000);

    $scope.stop = function () {
        $timeout.cancel(mytimeout);
    }

    //This method starts the ring election algorithm simulation
    $scope.startSimulation = function () {
        var check = $scope.findFirstOnline();
        if (check == undefined) {
            $scope.logMessage.push({
                id: $scope.logMessage.length,
                message: "No Process online, Connect to atleast one process to start the simulation",
                class: "log-warning"
            });
            $scope.startMessage = false;
        }
        else {
            $scope.start = true;
            $scope.startMessage = false;
            $scope.token = [];
            var max = 0;
            var leader = $scope.findLeader();

            //If a leader cannot be found
            if (!leader) {

                $scope.logMessage.push({
                    id: $scope.logMessage.length,
                    message: "NO LEADER ASSIGNED",
                    class: "log-warning"
                });

                $scope.logMessage.push({
                    id: $scope.logMessage.length,
                    message: "The first process connected will start the election",
                    class: "log-start"
                });

                var first = $scope.findFirstOnline();

                $scope.data[first].current = true;

                $scope.logMessage.push({
                    id: $scope.logMessage.length,
                    message: "Process " + $scope.data[first].process + " starts the election process"
                });

                $scope.token.push($scope.data[first].process);

                var nextOnline = $scope.findNextOnline(first);
                if (nextOnline == first) {
                    $scope.logMessage.push({
                        id: $scope.logMessage.length,
                        message: "Process " + $scope.data[first].process + " is the only online process and is elected the leader",
                        class: "log-leader"
                    });
                    $scope.data[first].current = false;
                    $scope.data[first].isLeader = true;
                }

                $scope.counterMessage = true;
                $scope.message = "Process " + $scope.data[first].process + " will check for the next succesor in "
                $scope.counter = 5;
                $scope.$watch('counter', function () {
                    if ($scope.counter == -1) {
                        //$scope.counter = 5; 
                    }
                });

            }
                //If a leader is found
            else {

            }
        }
        $scope.logMessage.sort(log_sort_by('id', true, parseInt));
    };

    $scope.findFirstOnline = function () {
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].online) {
                return i;
            }
        }
    }

    $scope.findNextOnline = function (id) {
        var found = false;
        for (var i = id; i < $scope.data.length; i++) {
            if (id != i) {
                if ($scope.data[i].online) {
                    found = true;
                    return i;
                }
            }
        }
        if (!found) {
            for (i = 0; i < id; i++) {
                if (id != i) {
                    if ($scope.data[i].online) {
                        return i;
                    }
                }
            }
        }
        return id;
    }

    $scope.findLeader = function () {
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].leader) {
                return true;
            }
        }
        return false;
    }

    //This method simulates a crash
    $scope.crash = function (id) {
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process == id) {
                $scope.data[i].online = false;
                $scope.showConnectionMessage($scope.data[i].online, $scope.data[i].process);
            }
        }

        //$scope.startSimulation();
    };

    //This method restarts a crashed server
    $scope.restart = function (id) {
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process == id) {
                if ($scope.data[i].closed) {
                    var newId = id + 1;
                    var port = "300" + newId;
                    var url = "http://localhost:" + port + "/";
                    $window.open(url);
                }
                else {
                    $scope.data[i].online = true;
                    $scope.showConnectionMessage($scope.data[i].online, $scope.data[i].process);
                }
            }
        }

        //$scope.startSimulation();
    };

});
