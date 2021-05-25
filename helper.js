module.exports = {
    check_port: (port) => {
        if(!port || typeof port !== 'number') return false;

        return port > 0 && port <= 65535; // Total Ports: 2^16
    }
}