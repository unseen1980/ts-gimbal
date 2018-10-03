window.onload = function() {
    const socket = io();
    setInterval(() => {
        socket.emit('hello', 'world!');
    }, 1000);
}