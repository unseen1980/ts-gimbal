window.onload = function() {
    const socket = io();
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const tracker = new tracking.ObjectTracker('face');

    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    tracking.track('#video', tracker, {
        camera: true
    });

    tracker.on('track', ({ data }) => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        data.forEach(({ x, y, width, height }) => {
            console.log(`x:${x},y:${y}`);

            socket.emit("change:interval", { x, y });

            context.strokeStyle = 'red';
            context.strokeRect(x, y, width, height);
            context.font = '18px Helvetica';
            context.fillStyle = "red";
            context.fillText(`x: ${x}px`, x + width + 10, y + 21);
            context.fillText(`y: ${y}px`, x + width + 10, y + 32);
        });
    });
}