
function Router(action, callback) {
    // Verificamos que no exista una ruta con la misma accion
    if(!action || global.socket_settings.routes.includes(action)) {
        throw new Error("Error al crear la ruta");
        process.exit();
    }


    let route = {
        action,
        callback
    }

    global.socket_settings.routes.push(route);
    return route;
}

module.exports = Router;