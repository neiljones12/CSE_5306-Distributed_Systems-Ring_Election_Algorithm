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

        $scope.counter = 0;
        $scope.counterMessage = false;

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
        $scope.counter++;
        mytimeout = $timeout($scope.onTimeout, 1000);
    }
    var mytimeout = $timeout($scope.onTimeout, 1000);

    $scope.stop = function () {
        $scope.counterMessage = false;
        $timeout.cancel(mytimeout);
    }

    $scope.resetCurrent = function () {
        for (var i = 0; i < $scope.data.length; i++) {
            $scope.data[i].current = false;
        }
    }

    $scope.resetLeader = function () {
        for (var i = 0; i < $scope.data.length; i++) {
            $scope.data[i].isLeader = false;
        }
    }

    $scope.nextProcess = function (process) {
        $scope.resetCurrent();
        $scope.data[process].current = true;

        $scope.logMessage.push({
            id: $scope.logMessage.length,
            message: "Process " + $scope.data[process].process + " is the current process"
        });

        $scope.token.push($scope.data[process].process);

        $scope.logMessage.push({
            id: $scope.logMessage.length,
            message: "Token array passed: " + $scope.token,
            class: "log-leader"
        });

        $scope.logMessage.sort(log_sort_by('id', true, parseInt));
    }

    $scope.tokenCompleted = function (process) {
        $scope.resetCurrent();
        $scope.data[process].current = true;

        $scope.logMessage.push({
            id: $scope.logMessage.length,
            message: "The token message has come back to the process that started it",
            class: "log-online"
        });

        var max = -1;
        for (var i = 0; i < $scope.token.length; i++) {
            if (max < $scope.token[i]) {
                max = $scope.token[i];
            }
        }

        $scope.logMessage.push({
            id: $scope.logMessage.length,
            message: "The new elected leader is process: " + max,
            class: "log-leader"
        });

        $scope.logMessage.sort(log_sort_by('id', true, parseInt));
    }

    $scope.assignLeader = function () {
        var max = -1;
        for (var i = 0; i < $scope.token.length; i++) {
            if (max < $scope.token[i]) {
                max = $scope.token[i];
            }
        }

        if (max > -1) {
            $scope.data[max].isLeader = true;
        }

        $scope.logMessage.push({
            id: $scope.logMessage.length,
            message: "The new elected leader is process: " + max,
            class: "log-leader"
        });

        $scope.logMessage.sort(log_sort_by('id', true, parseInt));

        $scope.token = [];
        $scope.resetCurrent();
    };

    $scope.checkLeader = function () {
        var result = false;
        for (var i = 0; i < $scope.data.length; i++) {
            {
                if ($scope.data[i].isLeader) {
                    result = true;
                }
            }
        }

        return result;
    }

    $scope.checkToken = function (value) {
        var result = false;
        for (var i = 0; i < $scope.token.length; i++) {
            {
                if ($scope.token[i] == value) {
                    result = true;
                }
            }
        }

        return result;
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

            $scope.$watch('counter', function () {
                var mod = $scope.counter % 8;
                console.log(mod);
                switch (mod) {
                    case 0:
                        if ($scope.data[0].online) {
                            if (!$scope.checkLeader()) {
                                if (!$scope.checkToken(0)) {
                                    $scope.resetCurrent();
                                    $scope.data[0].current = true;
                                    $scope.token.push(0);

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 0 + " forwards the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));
                                }
                                else if ($scope.token[0] == 0) {

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 0 + " recieves the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));

                                    $scope.assignLeader();
                                }
                            }
                        }
                        break;
                    case 1:
                        if ($scope.data[1].online) {
                            if (!$scope.checkLeader()) {
                                if (!$scope.checkToken(1)) {
                                    $scope.resetCurrent();
                                    $scope.data[1].current = true;
                                    $scope.token.push(1);

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 1 + " forwards the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));
                                }
                                else if ($scope.token[0] == 1) {

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 1 + " recieves the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));

                                    $scope.assignLeader();
                                }
                            }
                        }
                        break;
                    case 2:
                        if ($scope.data[2].online) {
                            if (!$scope.checkLeader()) {
                                if (!$scope.checkToken(2)) {
                                    $scope.resetCurrent();
                                    $scope.data[2].current = true;
                                    $scope.token.push(2);

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 2 + " forwards the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));
                                }

                                else if ($scope.token[0] == 2) {

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 2 + " recieves the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));

                                    $scope.assignLeader();
                                }
                            }
                        }
                        break;
                    case 3:
                        if ($scope.data[3].online) {
                            if (!$scope.checkLeader(3)) {
                                if (!$scope.checkToken()) {
                                    $scope.resetCurrent();
                                    $scope.data[3].current = true;
                                    $scope.token.push(3);

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 3 + " forwards the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));
                                }
                                else if ($scope.token[0] == 3) {

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 3 + " recieves the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));

                                    $scope.assignLeader();
                                }
                            }
                        }
                        break;
                    case 4:
                        if ($scope.data[4].online) {
                            if (!$scope.checkLeader()) {
                                if (!$scope.checkToken(4)) {
                                    $scope.resetCurrent();
                                    $scope.data[4].current = true;
                                    $scope.token.push(4);

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 4 + " forwards the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));
                                }
                                else if ($scope.token[0] == 4) {

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 4 + " recieves the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));

                                    $scope.assignLeader();
                                }
                            }
                        }
                        break;
                    case 5:
                        if ($scope.data[5].online) {
                            if (!$scope.checkLeader()) {
                                if (!$scope.checkToken(5)) {
                                    $scope.resetCurrent();
                                    $scope.data[5].current = true;
                                    $scope.token.push(5);

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 5 + " forwards the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));
                                }
                                else if ($scope.token[0] == 5) {

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 5 + " recieves the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));

                                    $scope.assignLeader();
                                }
                            }
                        }
                        break;
                    case 6:
                        if ($scope.data[6].online) {
                            if (!$scope.checkLeader()) {
                                if (!$scope.checkToken(6)) {
                                    $scope.resetCurrent();
                                    $scope.data[6].current = true;
                                    $scope.token.push(6);

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 6 + " forwards the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));
                                }
                                else if ($scope.token[0] == 6) {

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 6 + " recieves the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));

                                    $scope.assignLeader();
                                }
                            }
                        }
                        break;
                    case 7:
                        if ($scope.data[7].online) {
                            if (!$scope.checkLeader()) {
                                if (!$scope.checkToken(7)) {
                                    $scope.resetCurrent();
                                    $scope.data[7].current = true;
                                    $scope.token.push(7);

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 7 + " forwards the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));
                                }
                                else if ($scope.token[0] == 7) {

                                    $scope.logMessage.push({
                                        id: $scope.logMessage.length,
                                        message: "Process: " + 7 + " recieves the token message " + $scope.token
                                    });

                                    $scope.logMessage.sort(log_sort_by('id', true, parseInt));

                                    $scope.assignLeader();
                                }
                            }
                        }
                        break;
                }
            });








            //var max = 0;


            //var first = $scope.findFirstOnline();
            //$scope.data[first].current = true;

            //$scope.logMessage.push({
            //    id: $scope.logMessage.length,
            //    message: "Process " + $scope.data[first].process + " starts the election process"
            //});

            //$scope.token.push($scope.data[first].process);





            //isTokenComplete = false;


            //var second = $scope.findNextOnline(first);
            //if (second != first) {
            //    $scope.nextProcess(second);
            //}
            //else {
            //    $scope.tokenCompleted(second);
            //    isTokenComplete = true;
            //}

            //if (!isTokenComplete) {
            //    var third = $scope.findNextOnline(second);
            //    if (third != first) {
            //        $scope.nextProcess(third);
            //    }
            //    else {
            //        $scope.tokenCompleted(third);
            //        isTokenComplete = true;
            //    }
            //}


            //if (!isTokenComplete) {
            //    var fourth = $scope.findNextOnline(third);
            //    if (fourth != first) {
            //        $scope.nextProcess(fourth);
            //    }
            //    else {
            //        $scope.tokenCompleted(fourth);
            //        isTokenComplete = true;
            //    }
            //}


            //if (!isTokenComplete) {
            //    var fifth = $scope.findNextOnline(fourth);
            //    if (fifth != first) {
            //        $scope.nextProcess(fifth);
            //    }
            //    else {
            //        $scope.tokenCompleted(fifth);
            //        isTokenComplete = true;
            //    }
            //}


            //if (!isTokenComplete) {
            //    var sixth = $scope.findNextOnline(fifth);
            //    if (sixth != first) {
            //        $scope.nextProcess(sixth);
            //    }
            //    else {
            //        $scope.tokenCompleted(sixth);
            //        isTokenComplete = true;
            //    }
            //}


            //if (!isTokenComplete) {
            //    var seventh = $scope.findNextOnline(sixth);
            //    if (seventh != first) {
            //        $scope.nextProcess(seventh);
            //    }
            //    else {
            //        $scope.tokenCompleted(seventh);
            //        isTokenComplete = true;
            //    }
            //}


            //if (!isTokenComplete) {
            //    var eighth = $scope.findNextOnline(seventh);
            //    if (eighth != first) {
            //        $scope.nextProcess(eighth);
            //    }
            //    else {
            //        $scope.tokenCompleted(eighth);
            //        isTokenComplete = true;
            //    }
            //}


            //var last = $scope.findNextOnline(eighth);
            //if (last == first) {
            //    $scope.tokenCompleted(last);
            //    isTokenComplete = true;
            //}


            //$scope.assignLeader();

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
                $scope.data[i].isLeader = false;
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

        $scope.logMessage.push({
            id: $scope.logMessage.length,
            message: "Process: " + id + " has come online. Election process initiated",
            class: "log-online"
        });
        $scope.logMessage.sort(log_sort_by('id', true, parseInt));
        $scope.startSimulation();
    };

});
