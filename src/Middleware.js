function Middleware(fn) {
    global.socket_settings.middlewares.push(fn);
    return fn;
}

module.exports = Middleware;