import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import axios from "axios";

const Connections = ({ socketConnection }) => {
  const [hourglassStats, setHourglassStats] = useState({
    hourglass1: {
      connected: false,
      lastUpdated: null,
    },
    hourglass2: {
      connected: false,
      lastUpdated: null,
    },
  });

  useEffect(() => {
    // Get initial hourglass status from server
    axios.get("/api/hourglass/status").then((res) => {
      setHourglassStats(res.data.status);
    });

    function onHourglassStatus(value) {
      console.log(value);
      setHourglassStats(value);
    }

    socket.on("hourglassStatus", onHourglassStatus);

    return () => {
      socket.off("hourglassStatus", onHourglassStatus);
    };
  }, []);

  return (
    <div className="bg-slate-800 p-4 rounded-md">
      <span className="font-light text-lg">Connections:</span>
      <div className="flex flex-col">
        <div className="flex flex-row items-center ">
          <span
            className={`${
              socketConnection ? "bg-green-400" : "bg-red-400"
            } w-3 h-3 block rounded-full`}
          />
          <span className="text-sm mx-1 capitalize">SocketIO client</span>
        </div>
        {["hourglass1", "hourglass2"].map((hourglass) => (
          <div className="flex flex-row items-center " key={hourglass}>
            <span
              className={`${
                hourglassStats[hourglass].connected
                  ? "bg-green-400"
                  : "bg-red-400"
              } w-3 h-3 block rounded-full`}
            />
            <span className="text-sm mx-1 capitalize">{hourglass}</span>

            <span className="dark:text-gray-500 text-sm">
              {hourglassStats[hourglass].lastUpdated
                ? new Date(
                    hourglassStats[hourglass].lastUpdated
                  ).toLocaleTimeString()
                : "No Time"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
