const socket = new WebSocket(
    `ws://${window.location.host}/ws/research/`
);

socket.onopen = () => {

    console.log("✅ WebSocket Connected");

};

socket.onclose = () => {

    console.log("❌ WebSocket Closed");

};

socket.onerror = (error) => {

    console.error(error);

};

socket.onmessage = (event) => {

    const data = JSON.parse(event.data);

    console.log("WebSocket:", data);

    if (typeof updateFromStatus === "function") {

        updateFromStatus(data);

    }

};