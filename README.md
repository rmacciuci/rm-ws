# SocketIO + Redis - RM WebSocket

Este paquete creado para Node JS sirve para utilizar websocket con Socket IO.

### Example

```javascript
const init_rmws = require('rm-ws'); // Include Package
const express = require('express'); // Include Express Framework

const app = express();

init_rmws(); // Init RM WebSocket
const { Router, Middleware, Server, Sender } = global.socket_actions; // Obteins Controllers

// Set middlewares
function middleware_example(socket, next) {
    // Set Client ID
    socket.uuid = "exampleOfId";
    socket.uuid2 = "exampleOfId2";
    console.log("New Client Connected");
    next();
}

Middleware(middleware_example); // Set a middleware

function controller_example(socket, args, arg2) {
    console.log('fn controller', socket.io ,args, arg2);

    socket.join('home');

    socket.emit('hello', "Mensaje recibido", socket.io);
}

function controller_example_by_route(socket) {
    console.log('path /home', socket.uuid);
    console.log('route', socket.handshake)

    socket.join('home');

    socket.emit('hello', "Mensaje recibido de /home", socket.uuid);
}

setTimeout(() => {
    setInterval(() => {
        let msg1 = new Sender('room_msg', "este es un mensaje grupal");
        msg1.send_to_rooms(["home"]);
        console.log('interval')

        let msg2 = new Sender('room_msg', "Mensaje solo par el usuario id ramiromacciuci");
        
        // If we need change ID default (uuid) for uuid2 use 
        msg2.set_special_id('uuid2')

        msg2.send_by_client_id(["exampleOfId"]);
    }, 1000);
}, 2000);

Router('ruta1', controller_example); // Seteamos una ruta

Router(['/home', 'home'], controller_example_by_route); // Seteamos ruta con namespace

const server = new Server({
    socket_settings: {
        path: "/ws", // Main Path
        perMessageDeflate: false,
        allowEIO3: true, // Permitimos la version 3 de socketio
        cors: {
            methods: ["GET", "POST"], // Habilitamos CORS
            origin: 'http://localhost:3000', // WHITE LIST
            allowedHeaders: ["my_custom_header"], // Headers permitidos
            credentials: true, // Recibimos credenciales
        }
    },
    app_server: app,
    port: 8080,
    redis_settings: {
        host: 'localhost',
        port: 6379
    }
})

server.init();

```

#### Sobre el autor

[Ramiro Macciuci](https://ramiromacciuci.com.ar)
Ciudad de Buenos Aires, Argentina.

