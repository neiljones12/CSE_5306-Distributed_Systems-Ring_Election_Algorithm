'use strict';
class Routes {

    constructor(app, socket) {
        this.app = app;
        this.io = socket;
        this.name = "";
        this.users = [];
        this.connection = [];

        this.server_1 = 3001;
        this.server_2 = 3002;
        this.server_3 = 3003;
        this.server_4 = 3004;
        this.server_5 = 3005;
        this.server_6 = 3006;

        this.time_1 = 3000;
        this.time_2 = 3000;
        this.time_3 = 3000;
        this.time_4 = 3000;
        this.time_5 = 3000;
        this.time_6 = 3000;
    }

    appRoutes() {

        this.app.get('/', (request, response) => {
            response.render('index');
        });

    }

    socketEvents() { 
        var socket = this.io;

        var server1 = this.app.listen(this.server_1);
        var socket1 = require('socket.io').listen(server1);

        socket1.on('connect', function (data) {
            console.log("Server 1 connected");
            socket.emit('server_1_connection', true);
        }); 

        var server2 = this.app.listen(this.server_2);
        var socket2 = require('socket.io').listen(server2);
        
        socket2.on('connect', function (data) {
            console.log("Server 2 connected");
            socket.emit('server_2_connection', true);
        });

        var server3 = this.app.listen(this.server_3);
        var socket3 = require('socket.io').listen(server3);
        
        socket3.on('connect', function (data) {
            console.log("Server 3 connected");
            socket.emit('server_3_connection', true);
        });

        var server4 = this.app.listen(this.server_4);
        var socket4 = require('socket.io').listen(server4);
        
        socket4.on('connect', function (data) {
            console.log("Server 4 connected");
            socket.emit('server_4_connection', true);
        });

        var server5 = this.app.listen(this.server_5);
        var socket5 = require('socket.io').listen(server5);
        
        socket5.on('connect', function (data) {
            console.log("Server 5 connected");
            socket.emit('server_5_connection', true);
        });

        var server6 = this.app.listen(this.server_6);
        var socket6 = require('socket.io').listen(server6);
        
        socket6.on('connect', function (data) {
            console.log("Server 6 connected");
            socket.emit('server_6_connection', true);
        });

    }

    routesConfig() {
        this.appRoutes();
        this.socketEvents();
    }
}
module.exports = Routes;