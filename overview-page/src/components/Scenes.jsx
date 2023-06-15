import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import axios from "axios";

const Scenes = () => {
  const [activeScene, setActiveScene] = useState(-1);
  const [scenes, setScenes] = useState([]);

  useEffect(() => {
    // Get scenes list from server
    axios
      .get("/api/scenes")
      .then((res) => {
        console.log(res.data);
        setScenes(
          res.data.scenes.map((scene) => {
            const sceneTime = scene.time;
            return {
              ...scene,
              time:
                sceneTime.trim() !== ""
                  ? new Date(sceneTime).toLocaleTimeString()
                  : "",
            };
          })
        );

        setActiveScene(res.data.activeScene);
      })
      .catch((err) => {
        setScenes([
          {
            id: 1,
            name: "Error Fetching Scenes",
            time: new Date().toLocaleTimeString(),
          },
        ]);
      });

    function onSetActiveScene(cueId) {
      setActiveScene(cueId);
    }

    function updateScene(scene) {
      setScenes((ss) =>
        ss.map((s) => {
          if (s.id === scene.id) {
            return { ...s, time: new Date(scene.time).toLocaleTimeString() };
          } else {
            return s;
          }
        })
      );
    }

    socket.on("activeScene", onSetActiveScene);
    socket.on("updateScene", updateScene);

    return () => {
      socket.off("activeScene", onSetActiveScene);
      socket.off("updateScene", updateScene);
    };
  }, []);

  function handleAdvanceScene() {
    axios.post("/api/scenes/advance");
  }

  return (
    <div>
      <div className="w-96 h-96 overflow-y-scroll">
        <table className="border-collapse table-auto w-full text-sm">
          <thead className="sticky top-0 border-b dark:border-slate-600 bg-slate-900 ">
            <tr className="">
              <th className=" font-medium p-4 pl-8  pb-3 text-slate-400 dark:text-slate-200 text-left">
                Scene
              </th>
              <th className=" font-medium p-4 pl-8  pb-3 text-slate-400 dark:text-slate-200 text-left">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 ">
            {scenes.map((scene, index) => {
              let active = scene.id === activeScene;

              return (
                <tr key={index} className="h-2">
                  <td
                    className={`border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 ${
                      active ? "dark:text-white" : "dark:text-slate-400"
                    } `}
                  >
                    {scene.name}
                  </td>
                  <td
                    className={`border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500  ${
                      active ? "dark:text-white" : "dark:text-slate-400"
                    }`}
                  >
                    {scene.time}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row">
        <button
          className="text-white flex-grow text-center bg-gray-500 py-2 px-2 mt-2 rounded-md"
          onClick={handleAdvanceScene}
        >
          Advance
        </button>
      </div>
    </div>
  );
};

export default Scenes;
