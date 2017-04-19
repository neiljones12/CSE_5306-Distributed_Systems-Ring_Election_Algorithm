'use strict';
class Routes {

    constructor(app, socket) {
        this.app = app;
        this.io = socket;

        //Initializing process Ports
        this.process_1 = 3001;
        this.process_2 = 3002;
        this.process_3 = 3003;
        this.process_4 = 3004;
        this.process_5 = 3005;
        this.process_6 = 3006;
        this.process_7 = 3007;
        this.process_8 = 3008;

        this.token = [];
        this.coordinator = []
    }

    appRoutes() {

        this.app.get('/', (request, response) => {
            response.render('index');
        });

    }

    //This function takes care of the inter process communication.
    //The data is sent back and forth from the client and processes via sockets.
    socketEvents() {
        var socket = this.io;

        socket.on('connect', function (data) {
            data.on('data', function (data) { 
                console.log(data);
            }); 
        });

        
        var process1 = this.app.listen(this.process_1);
        var socket1 = require('socket.io').listen(process1);

        //Socket communication for process 1
        socket1.on('connect', function (data) {

            var obj = {
                process: 0,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);
            
            data.on('election', function (data) {
                this.token.push(data.process);
                console.log(data.message);
            });

            data.on('coordinator', function (data) {
                this.coordinator.push(data.process);
                console.log(data.message);
            });

            data.on('leader', function (data) {
                this.leader.push(data.process);
                console.log(data.message);
            });

            data.on('disconnect', function (data) {

                var obj = {
                    process: 0,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });

         
        //Socket communication for process 2
        var process2 = this.app.listen(this.process_2);
        var socket2 = require('socket.io').listen(process2);

        socket2.on('connect', function (data) {

            var obj = {
                process: 1,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('election', function (data) {
                this.token.push(data.process);
                console.log(data.message);
            });

            data.on('coordinator', function (data) {
                this.coordinator.push(data.process);
                console.log(data.message);
            });

            data.on('leader', function (data) {
                this.leader.push(data.process);
                console.log(data.message);
            });

            data.on('disconnect', function (data) {

                var obj = {
                    process: 1,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });

        //Socket communication for process 3
        var process3 = this.app.listen(this.process_3);
        var socket3 = require('socket.io').listen(process3);

        socket3.on('connect', function (data) {

            var obj = {
                process: 2,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('election', function (data) {
                this.token.push(data.process);
                console.log(data.message);
            });

            data.on('coordinator', function (data) {
                this.coordinator.push(data.process);
                console.log(data.message);
            });

            data.on('leader', function (data) {
                this.leader.push(data.process);
                console.log(data.message);
            });

            data.on('disconnect', function (data) {

                var obj = {
                    process: 2,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });

        //Socket communication for process 4
        var process4 = this.app.listen(this.process_4);
        var socket4 = require('socket.io').listen(process4);

        socket4.on('connect', function (data) {

            var obj = {
                process: 3,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('election', function (data) {
                this.token.push(data.process);
                console.log(data.message);
            });

            data.on('coordinator', function (data) {
                this.coordinator.push(data.process);
                console.log(data.message);
            });

            data.on('leader', function (data) {
                this.leader.push(data.process);
                console.log(data.message);
            });

            data.on('disconnect', function (data) {

                var obj = {
                    process: 3,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });

        //Socket communication for process 5
        var process5 = this.app.listen(this.process_5);
        var socket5 = require('socket.io').listen(process5);

        socket5.on('connect', function (data) {

            var obj = {
                process: 4,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('election', function (data) {
                this.token.push(data.process);
                console.log(data.message);
            });

            data.on('coordinator', function (data) {
                this.coordinator.push(data.process);
                console.log(data.message);
            });

            data.on('leader', function (data) {
                this.leader.push(data.process);
                console.log(data.message);
            });

            data.on('disconnect', function (data) {

                var obj = {
                    process: 4,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });

        //Socket communication for process 6
        var process6 = this.app.listen(this.process_6);
        var socket6 = require('socket.io').listen(process6);

        socket6.on('connect', function (data) {

            var obj = {
                process: 5,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('election', function (data) {
                this.token.push(data.process);
                console.log(data.message);
            });

            data.on('coordinator', function (data) {
                this.coordinator.push(data.process);
                console.log(data.message);
            });

            data.on('leader', function (data) {
                this.leader.push(data.process);
                console.log(data.message);
            });

            data.on('disconnect', function (data) {

                var obj = {
                    process: 5,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });

        //Socket communication for process 7
        var process7 = this.app.listen(this.process_7);
        var socket7 = require('socket.io').listen(process7);

        socket7.on('connect', function (data) {

            var obj = {
                process: 6,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('election', function (data) {
                this.token.push(data.process);
                console.log(data.message);
            });

            data.on('coordinator', function (data) {
                this.coordinator.push(data.process);
                console.log(data.message);
            });

            data.on('leader', function (data) {
                this.leader.push(data.process);
                console.log(data.message);
            });

            data.on('disconnect', function (data) {

                var obj = {
                    process: 6,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });

        var process8 = this.app.listen(this.process_8);
        var socket8 = require('socket.io').listen(process8);

        socket8.on('connect', function (data) {

            var obj = {
                process: 7,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('election', function (data) {
                this.token.push(data.process);
                console.log(data.message);
            });

            data.on('coordinator', function (data) {
                this.coordinator.push(data.process);
                console.log(data.message);
            });

            data.on('leader', function (data) {
                this.leader.push(data.process);
                console.log(data.message);
            });

            data.on('disconnect', function (data) {

                var obj = {
                    process: 7,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });

    }

    routesConfig() {
        this.appRoutes();
        this.socketEvents();
    }
}
module.exports = Routes;