//----------------------SUBMITTED BY--------------------
//----------------------NEIL JONES----------------------
//----------------------1001371689----------------------

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

        $scope.counter = 0; $scope.counter1 = 0; $scope.counter2 = 0; $scope.counter3 = 0;
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

        $scope.logMessage = [];
        $scope.token = [];

        $scope.token1 = [];
        $scope.token2 = [];
        $scope.coordinator = [];

        $scope.firstRun = true;

        $scope.timer1 = false;
        $scope.timer2 = false;
        $scope.timer3 = false;

        $scope.multiElection = false;
        $scope.cMessage = false;
        $scope.cMessage1 = false;
        $scope.cMessage2 = false;
        $scope.tokenMessage = true;
        $scope.tokenMessage1 = true;
        $scope.tokenMessage2 = true;

        $scope.lastProcess = -1;

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

                if(data.online)
                {
                    $scope.data[i].online = true;

                    var message = "Process: " + i + " has come online. Election initiated";
                    var type = "";

                    $scope.message(message, type);
                    $scope.counter = i;

                    $scope.token = [];

                    $scope.resetLeader();
                    
                }

                $scope.data[i].closed = data.closed;
                //$scope.showConnectionMessage(data.online, data.process);
            }
        }

        $scope.data.sort(sort_by('process', true, parseInt));
    });


    //This method simulates a crash
    $scope.crash = function (id) {
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].process == id) {
                $scope.data[i].online = false;
                $scope.data[i].isLeader = false;
                //$scope.showConnectionMessage($scope.data[i].online, $scope.data[i].process);
            }
        }
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

                    var message = "Process: " + i + " has come online. Election initiated";
                    var type = "";

                    $scope.message(message, type);
                    $scope.counter = i;
                    $scope.resetLeader();

                }
            }
        }
    };

    //the counter function that times each process.
    $scope.$watch('counter', function () {

        if (!$scope.multiElection) {

            //Counter logic
            var mod = $scope.counter % 8;

            //Triggered only if the leader is not found
            if (!$scope.checkLeader()) {

                //Visually assigning a process
                $scope.assignCurrent(mod);

                //Checking to see if the process is online
                if ($scope.data[mod].online) {


                    if ($scope.tokenMessage) {
                        if ($scope.token == "") {
                            var message = "Process: " + mod + " starts the ELECTION";
                            var type = "log-token";

                            $scope.message(message, type);

                            $scope.token.push(mod);

                            var message = "Process: " + mod + " sends ELECTION MESSAGE " + $scope.token;
                            var type = "log-token";

                            $scope.message(message, type);
                        }
                        else {
                            if ($scope.token[0] == mod) {
                                var message = "Process: " + mod + " gets back the ELECTION message";
                                var type = "log-token";

                                $scope.message(message, type);

                                $scope.tokenMessage = false;
                                $scope.cMessage = true;
                                $scope.coordinatorMessage(mod);
                            }
                            else {
                                $scope.token.push(mod);
                                var message = "Process: " + mod + " sends ELECTION MESSAGE " + $scope.token;
                                var type = "log-token";

                                $scope.message(message, type);
                            }
                        }
                    }
                    else if ($scope.cMessage) {
                        $scope.coordinatorMessage(mod);
                    }
                }
            }
        }
            //Multi election 
        else if ($scope.multiElection) {
            if ($scope.firstRun) {
                var mod = $scope.counter % 8;
                var id = mod;
                if (!$scope.checkLeader()) {
                    if (id == 2 || id == 5) {
                        $scope.timer1 = true;
                        $scope.timer2 = true;

                        $scope.counter1 = 2;
                        $scope.counter2 = 5;

                        $scope.firstRun = false;
                    }
                }
            }
        }
    })


    $scope.$watch('counter1', function () {
        if ($scope.timer1) {
            var mod = $scope.counter1 % 8;
            //console.log($scope.token1);
            //Triggered only if the leader is not found
            if (!$scope.checkLeader()) {

                //Visually assigning a process
                $scope.assignCurrent(mod);

                //Checking to see if the process is online
                if ($scope.data[mod].online) {

                    if ($scope.tokenMessage1) {
                        if ($scope.token1 == "") {
                            var message = "Process: " + mod + " starts the ELECTION(1)";
                            var type = "";

                            $scope.message(message, type);

                            $scope.token1.push(mod);

                            var message = "Process: " + mod + " sends ELECTION(1) MESSAGE " + $scope.token1;
                            var type = "log-token1";

                            $scope.message(message, type);
                        }
                        else {
                            if ($scope.token1[0] == mod) {
                                var message = "Process: " + mod + " gets back the ELECTION(1) message";
                                var type = "log-token1";

                                $scope.message(message, type);

                                $scope.tokenMessage1 = false;
                                $scope.cMessage1 = true;
                                $scope.coordinatorMessageMulti(mod);
                            }
                            else {
                                var flag = false;
                                for (var i = 0; i < $scope.token1.length; i++) {
                                    if ($scope.token1[i] == mod) {
                                        flag = true;
                                    }
                                }

                                if (!flag) {
                                    $scope.token1.push(mod);
                                    var message = "Process: " + mod + " sends ELECTION(1) MESSAGE " + $scope.token1;
                                    var type = "log-token1";

                                    $scope.message(message, type);
                                }

                            }
                        }
                    }
                    else if ($scope.cMessage1) {
                        $scope.coordinatorMessageMulti(mod);
                    }
                }
            }

        }
    })

    $scope.$watch('counter2', function () {
        if ($scope.timer2) {
            var mod = $scope.counter2 % 8;
            //console.log($scope.token2);
            //Triggered only if the leader is not found
            if (!$scope.checkLeader()) {

                //Visually assigning a process
                $scope.assignCurrent(mod);

                //Checking to see if the process is online
                if ($scope.data[mod].online) {

                    if ($scope.tokenMessage2) {
                        if ($scope.token2 == "") {
                            var message = "Process: " + mod + " starts the ELECTION(2)";
                            var type = "";

                            $scope.message(message, type);

                            $scope.token2.push(mod);

                            var message = "Process: " + mod + " sends ELECTION(2) MESSAGE " + $scope.token2;
                            var type = "log-token2";

                            $scope.message(message, type);
                        }
                        else {
                            if ($scope.token2[0] == mod) {
                                var message = "Process: " + mod + " gets back the ELECTION(2) message";
                                var type = "log-token2";

                                $scope.message(message, type);

                                $scope.tokenMessage2 = false;
                                $scope.cMessage2 = true;
                                $scope.coordinatorMessageMulti(mod);
                            }
                            else {
                                var flag = false;
                                for (var i = 0; i < $scope.token2.length; i++) {
                                    if ($scope.token2[i] == mod) {
                                        flag = true;
                                    }
                                }

                                if (!flag) {
                                    $scope.token2.push(mod);
                                    var message = "Process: " + mod + " sends ELECTION(2) MESSAGE " + $scope.token2;
                                    var type = "log-token2";

                                    $scope.message(message, type);
                                }
                            }
                        }
                    }
                    else if ($scope.cMessage2) {
                        $scope.coordinatorMessageMulti(mod);
                    }
                }
            }

        }
    })


    $scope.coordinatorMessageMulti = function (id) {
        if ($scope.cMessage1) {
            $scope.timer1 = false;
        }
        if ($scope.cMessage2) {
            $scope.timer2 = false;
        }
        if ($scope.cMessage1 && $scope.cMessage2) {
            $scope.timer3 = true;
            $scope.counter3 = id;
            //$scope.coordinatorMultiMessage(id);
        }
    }

    //The function that sends the coordinator message around the ring
    $scope.coordinatorMessage = function (id) {
        if ($scope.coordinator == "") {

            $scope.coordinator.push(id);
            var message = "Process: " + id + " sends the COORDINATOR message " + $scope.findMax();
            var type = "log-cMessage";

            $scope.message(message, type);
        }
        else {
            if ($scope.coordinator[0] == id) {
                var message = "Process: " + id + " gets back the COORDINATOR message";
                var type = "log-cMessage";

                $scope.message(message, type);

                $scope.assignLeader();
            }
            else {

                $scope.coordinator.push(id);

                var message = "Process: " + id + " sends the COORDINATOR message " + $scope.findMax();
                var type = "log-cMessage";

                $scope.message(message, type);

            }
        }
    }


    $scope.$watch('counter3', function () {
        if ($scope.timer3) {
            var id = $scope.counter3 % 8;
            if ($scope.data[id].online) {
                $scope.assignCurrent(id);
                if ($scope.coordinator == "") {

                    $scope.coordinator.push(id);
                    var message = "Process: " + id + " sends the COORDINATOR message " + $scope.findMultiMax();
                    var type = "log-cMessage";

                    $scope.message(message, type);
                }
                else {
                    if ($scope.coordinator[0] == id) {
                        var message = "Process: " + id + " gets back the COORDINATOR message";
                        var type = "log-cMessage";

                        $scope.message(message, type);

                        $scope.assignMultiLeader();
                    }
                    else {

                        var flag = false;
                        for (var i = 0; i < $scope.coordinator.length; i++) {
                            if ($scope.coordinator[i] == id) {
                                flag = true;
                            }
                        }

                        if (!flag) {
                            $scope.coordinator.push(id);
                        }

                        var message = "Process: " + id + " sends the COORDINATOR message " + $scope.findMultiMax();
                        var type = "log-cMessage";

                        $scope.message(message, type);

                    }
                }
            }
        }
    })


    //Function to start the timer
    $scope.onTimeout = function () {
        $scope.counter++;
        $scope.counter1++;
        $scope.counter2++;
        $scope.counter3++;
        mytimeout = $timeout($scope.onTimeout, 1000);
    }
    var mytimeout = $timeout($scope.onTimeout, 1000);

    //Function to stop the timer
    $scope.stop = function () {
        $scope.counterMessage = false;
        $timeout.cancel(mytimeout);
    }

    //Function to check for a leader
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

    //Function to assign the leader
    $scope.assignLeader = function () {

        //Calling the function that finds the maximum process number
        var max = $scope.findMax();

        if (max > -1) {
            if ($scope.data[max].online) {
                $scope.data[max].isLeader = true;
                var message = "Process: " + max + " has been elected the LEADER";
                var type = "log-leader";

                $scope.message(message, type);

                $scope.resetCurrent();
            }

            //Resetting the parameters
            $scope.token = [];
            $scope.coordinator = [];

            $scope.tokenMessage = true;
            $scope.cMessage = false;
        }
        //Communicating with the socket
        socket.emit('proces', $scope.data);
    }

    $scope.assignMultiLeader = function () {

        //Calling the function that finds the maximum process number
        var max = $scope.findMultiMax();

        if (max > -1) {
            if ($scope.data[max].online) {
                $scope.data[max].isLeader = true;
                var message = "Process: " + max + " has been elected the LEADER";
                var type = "log-leader";

                $scope.message(message, type);

                $scope.resetCurrent();
            }

            //Resetting the parameters
            $scope.token1 = [];
            $scope.token2 = [];

            $scope.coordinator = [];

            $scope.tokenMessage1 = true;
            $scope.tokenMessage2 = true;

            $scope.cMessage1 = false;
            $scope.cMessage2 = false;

            $scope.timer1 = false;
            $scope.timer2 = false;
            $scope.timer3 = false;

            $scope.firstRun = true;
        }

        //Communicating with the socket
        socket.emit('proces', $scope.data);
    }

    //Function to find the max process number
    $scope.findMax = function () {
        var max = -1;
        for (var i = 0; i < $scope.token.length; i++) {
            if (max < $scope.token[i]) {
                max = $scope.token[i]
            }
        }
        return max;
    }

    $scope.findMultiMax = function () {
        var max = -1;
        for (var i = 0; i < $scope.token1.length; i++) {
            if (max < $scope.token1[i]) {
                max = $scope.token1[i]
            }
        }

        for (var i = 0; i < $scope.token2.length; i++) {
            if (max < $scope.token2[i]) {
                max = $scope.token2[i]
            }
        }

        return max;
    }

    //Function to reset the current process in the GUI
    $scope.resetCurrent = function () {
        for (var i = 0; i < $scope.data.length; i++) {
            $scope.data[i].current = false;
        }

        //Communicating with the socket
        socket.emit('proces', $scope.data);
    }

    //Function to reset the leader process in the GUI
    $scope.resetLeader = function () {
        for (var i = 0; i < $scope.data.length; i++) {
            $scope.data[i].isLeader = false;
        }

        //Communicating with the socket
        socket.emit('proces', $scope.data);
    }

    //Function to return leader id
    $scope.leaderId = function () {
        var id = -1;
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].isLeader) {
                id = i;
            }
        }

        return id;
    }

    //Function to assign the colour to the current process in the UI
    $scope.assignCurrent = function (id) {
        $scope.resetCurrent();
        $scope.data[id].current = true;

        //Communicating with the socket
        socket.emit('proces', $scope.data);
    }

    //Function to display the message on the log
    $scope.message = function (message, type) {
        $scope.logMessage.push({
            id: $scope.logMessage.length,
            message: message,
            class: type
        });

        socket.emit('data', message);

        $scope.logMessage.sort(log_sort_by('id', true, parseInt));
    }

});
