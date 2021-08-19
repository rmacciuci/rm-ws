const { Emitter } = require("@socket.io/redis-emitter");
const { createClient } = require("redis");

class Sender {
    special_id = "uuid";
    default_path = "/";

    constructor(action, ...args) {
        this.action = action;
        this.args   = args;

        if(global.socket_settings.redisSettings) {
            this.collection = global.socket_settings.collection;
            this.redisClient = createClient(global.socket_settings.redisSettings);
            this.emitter = new Emitter(this.redisClient)
        }
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
        this.emitter.emit(this.action, ...this.args);
        return true;
    }

    send_to_rooms(rooms) {
        if(!this.action) return
        for(let room of rooms) {
            try {
                this.emitter.to(room).emit(this.action, ...this.args);
            } catch (e) {
                continue;
            }
        }

        return true;
    }

    async send_by_client_id(client_ids) {
        if(!this.action) return

        // Obtenemos los connectionId
        let ids = await this.collection.find({ userId: { $in: client_ids } }, { connectionId: 1 })        

        ids = ids.map(e => e.connectionId)
        this.send_by_socket_id(ids);

        return true;
    }

    send_by_socket_id(socket_ids) {
        if(!this.action) return
        for(let socket_id of socket_ids) {
            try {
                this.emitter.to(socket_id).emit(this.action, ...this.args);
            } catch (e) {
                continue;
            }
        }

        return true;
    }
}

module.exports = Sender;