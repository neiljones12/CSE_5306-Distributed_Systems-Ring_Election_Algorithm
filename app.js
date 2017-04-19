//----------------------SUBMITTED BY--------------------
//----------------------NEIL JONES----------------------
//----------------------1001371689----------------------

'use strict';

//Importing the libraries
const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const net = require('net');

//Importing the configuration files
const routes = require('./utils/routes');
const config = require('./utils/config');


class Server { 
    //Constructor initialization
    constructor() {
        this.port = process.env.PORT || 3000;
        this.host = 'localhost'; 
        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketio(this.http);
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());

    }

    //Application configuration
    appConfig() {
        this.app.use(
            bodyParser.json()
        );
        new config(this.app);
    }

    //Including app Routes starts
    includeRoutes() {
        new routes(this.app, this.socket).routesConfig();
    }

    //Including app Routes ends
    appExecute() {

        this.appConfig();
        this.includeRoutes();

        this.http.listen(this.port, this.host, () => {
            console.log(`Listening on http://${this.host}:${this.port}` + `\n`);
        });
    }

}

const app = new Server();

//Executing the server
app.appExecute();