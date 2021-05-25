class Sender {
    special_id = "uuid";
    default_path = "/";

    constructor(action, ...args) {
        this.action = action;
        this.args   = args;
    }

    set_special_id(id) {
        if(!id) return;
        this.special_id = id;
    }

    set_default_path(path) {
        if(!path) return;
        this.default_path = path;
    }

    send_all() {
        if(!this.action) return
        global.socket.emit(this.action, ...this.args);
        return true;
    }

    send_to_rooms(rooms) {
        if(!this.action) return
        for(let room of rooms) {
            try {
                global.socket.to(room).emit(this.action, ...this.args);
            } catch (e) {
                continue;
            }
        }

        return true;
    }

    send_by_client_id(client_ids) {
        if(!this.action) return
        const clients = global.socket.of(this.default_path).sockets;

        const client_to_send = [];

        clients?.forEach(e => {
            const id = e[this.special_id];

            if(client_ids.includes(id)) {
                client_to_send.push(e.id);
            }
        })

        this.send_by_socket_id(client_to_send);

        return true;
    }

    send_by_socket_id(socket_ids) {
        if(!this.action) return
        for(let socket_id of socket_ids) {
            try {
                global.socket.to(socket_id).emit(this.action, ...this.args);
            } catch (e) {
                continue;
            }
        }

        return true;
    }
}

module.exports = Sender;