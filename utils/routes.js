'use strict';
class Routes {

    constructor(app, socket) {
        this.app = app;
        this.io = socket; 

        //process Ports
        this.process_1 = 3001;
        this.process_2 = 3002;
        this.process_3 = 3003;
        this.process_4 = 3004;
        this.process_5 = 3005;
        this.process_6 = 3006;

        //Refresh Rates
        this.time_1 = 3000;
        this.time_2 = this.time_1 + 3000;
        this.time_3 = this.time_2 + 3000;
        this.time_4 = this.time_3 + 3000;
        this.time_5 = this.time_4 + 3000;
        this.time_6 = this.time_5 + 3000;
    }

    appRoutes() {

        this.app.get('/', (request, response) => {
            response.render('index');
        });

    }

    socketEvents() {
        var socket = this.io;

        var process1 = this.app.listen(this.process_1);
        var socket1 = require('socket.io').listen(process1);

        socket1.on('connect', function (data) {
            console.log("process 1 connected");

            var obj = {
                process: 1,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('disconnect', function (data) {
                console.log("process 1 disconnect");

                var obj = {
                    process: 1,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });



        var process2 = this.app.listen(this.process_2);
        var socket2 = require('socket.io').listen(process2);

        socket2.on('connect', function (data) {
            console.log("process 2 connected");

            var obj = {
                process: 2,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('disconnect', function (data) {
                console.log("process 2 disconnect");
                
                var obj = {
                    process: 2,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });

        var process3 = this.app.listen(this.process_3);
        var socket3 = require('socket.io').listen(process3);

        socket3.on('connect', function (data) {
            console.log("process 3 connected");
            
            var obj = {
                process: 3,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('disconnect', function (data) {
                console.log("process 3 disconnect");
                
                var obj = {
                    process: 3,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });

        var process4 = this.app.listen(this.process_4);
        var socket4 = require('socket.io').listen(process4);

        socket4.on('connect', function (data) {
            console.log("process 4 connected");
            
            var obj = {
                process: 4,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('disconnect', function (data) {
                console.log("process 4 disconnect");
                
                var obj = {
                    process: 4,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });

        var process5 = this.app.listen(this.process_5);
        var socket5 = require('socket.io').listen(process5);

        socket5.on('connect', function (data) {
            console.log("process 5 connected");
            
            var obj = {
                process: 5,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('disconnect', function (data) {
                console.log("process 5 disconnect");
                
                var obj = {
                    process: 5,
                    online: false,
                    closed: true
                };

                socket.emit('process_connection', obj);
            });
        });

        var process6 = this.app.listen(this.process_6);
        var socket6 = require('socket.io').listen(process6);

        socket6.on('connect', function (data) {
            console.log("process 6 connected");

            var obj = {
                process: 6,
                online: true,
                closed: false
            };

            socket.emit('process_connection', obj);

            data.on('disconnect', function (data) {
                console.log("process 6 disconnect");
                
                var obj = {
                    process: 6,
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