
function Router(action_array, callback) {
    let basePath = "/";
    let action   = null;

    if(action_array instanceof Array && action_array.length == 2) {
        basePath = action_array[0];
        action   = action_array[1];
    } else if(typeof action_array == 'string') {
        action = action_array;
    } else return false;

    // Verificamos que no exista una ruta con la misma accion
    if(!action || global.socket_settings.routes.includes(action)) {
        throw new Error("Error al crear la ruta");
        process.exit();
    }

    // Creamos la ruta
    let route = {
        basePath,
        action,
        callback
    }

    // Buscamos el grupo
    let groupExists = global.socket_settings.routes.findIndex(e => e.name == basePath);
    if(groupExists == -1) {
        // Creamos el grupo
        let aux_group = {
            name: basePath,
            routes: [route]
        }
        global.socket_settings.routes.push(aux_group);
    } else {
        // Agregamos la ruta
        global.socket_settings.routes[groupExists].routes.push(route);
    }

    return route;
}

module.exports = Router;