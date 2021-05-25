// External modules
const http          = require('http');
const socketIO      = require('socket.io');
const redis_adapter = require('socket.io-redis');

// Internal ports
const { check_port } = require('./helper');
const Middleware    = require('./src/Middleware');
const Router        = require('./src/Router');
const Sender = require('./src/Send');

class Server {
    redis_settings      = {};
    socketIO_settings   = {};
    app_server          = null;
    port                = null;
    server              = null;
    io                  = null;
    routes              = null;

    constructor({ socket_settings, app_server, redis_settings, port }) {
        this.redis_settings         = redis_settings ;
        this.socketIO_settings      = socket_settings || {};
        this.app_server             = app_server;
        this.port                   = port;
    }

    set_server() {
        this.server = null;

        if(this.app_server && this.port && check_port(this.port)) {
            this.server = http.createServer(this.app_server); // Init HTTP Server
        } else if(this.port && check_port(this.port)) {
            this.server = this.port; // Set Port
        } else throw new Error("Error in required parameters");
        return this;
    }

    set_global_socket() {

        global.socket = this.io;

        console.log('------------');
        console.log('            ');
        console.log(`${this.app_server ? "HTTP" : "WebSocket"} server inited in port: ${this.port}`);
        console.log('            ');
        console.log('------------');
    }

    init() {
        try {
            this.set_server(); // Set server
    
            // Set IO Server
            this.io = new socketIO.Server(
                this.server,
                this.socketIO_settings
            );

            if(this.redis_settings) {
                this.io.adapter(redis_adapter(this.redis_settings)); // Set redis settings and init this.
            }

            // Seteamos los middlewares
            global.socket_settings.middlewares.map(mdl => {
                global.socket_settings.routes.map(({ name }) => {
                    this.io.of(name).use(mdl); // Ejecutamos los middlewares principales
                })
            });

            global.socket_settings.routes.map(({ name, routes }) => {
                this.io.of(name).on('connection', socket => {
                    console.log(`Module: ${name}`,'Connected Client, Total:', this.io.engine.clientsCount);
                    routes.map(({ action, callback }) => {
                        socket.on(action, (...args) => callback(socket, ...args))
                    });
    
                    socket.on('disconnect'  , () => {
                        console.log(`Module: ${name}`,'Disconnected Client, Total:', this.io.engine.clientsCount);
                    })
                })
            })

            this.server.listen(this.port, () => {
                this.set_global_socket()
            });
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}

function init_rmws() {
    global.socket_settings = {
        routes: [],
        middlewares: []
    }

    global.socket_actions = {
        Middleware,
        Router,
        Sender,
        Server
    }
    return true;
}
module.exports    = init_rmws;