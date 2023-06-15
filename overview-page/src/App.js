import { useEffect, useState } from "react";

import { socket } from "./socket";
import Connections from "./components/Connections";
import Scenes from "./components/Scenes";

function App() {
  const [time, setTime] = useState("NAN");

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const Title = ({ children }) => (
    <h1 className="text-2xl font-bold">{children}</h1>
  );

  return (
    <div className="dark:bg-neutral-900 h-screen w-full flex flex-col items-center p-8 dark:text-white">
      <span className="something dark:text-white text-lg font-bold">
        Comms:
      </span>

      <span className="py-8 text-3xl">{time}</span>

      <Connections socketConnection={isConnected} />

      <Scenes />

      {/* <audio src="rtp"></audio> */}
    </div>
  );
}

export default App;
