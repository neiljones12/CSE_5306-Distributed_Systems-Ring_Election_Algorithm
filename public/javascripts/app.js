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

    socket.on('server_1_connection', (data) => {
        $scope.data.push({
            server: 1
        });
    });
    socket.on('server_2_connection', (data) => { 
        $scope.data.push({
            server: 2
        });
    });
    socket.on('server_3_connection', (data) => {
        $scope.data.push({
            server: 3
        });
    });
    socket.on('server_4_connection', (data) => {
        $scope.data.push({
            server: 4
        });
    });
    socket.on('server_5_connection', (data) => {
        $scope.data.push({
            server: 5
        });
    });
    socket.on('server_6_connection', (data) => {
        $scope.data.push({
            server: 6
        });
    });

});
