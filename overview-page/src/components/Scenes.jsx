import React, { useState } from "react";

const Scenes = () => {
  const [scenes, setScenes] = useState([
    { name: "Pre Show", id: 0, time: "" },
    { name: "Prologue", id: 1, time: "" },
    { name: "Act 1 Scene 1", id: 2, time: "" },
    { name: "Act 1 Scene 2", id: 3, time: "" },
    { name: "Act 1 Scene 3", id: 4, time: "" },
    { name: "Act 1 Scene 4", id: 5, time: "" },
    { name: "Act 1 Scene 5", id: 6, time: "" },
    { name: "Act 1 Scene 6", id: 7, time: "" },
    { name: "Act 1 Scene 7", id: 8, time: "" },
    { name: "Act 1 Scene 8", id: 9, time: "" },
    { name: "Act 1 Scene 9", id: 10, time: "" },
    { name: "Act 1 Scene 10", id: 11, time: "" },
    { name: "Act 1 Scene 11", id: 12, time: "" },
    { name: "Act 1 Scene 12", id: 13, time: "" },
    { name: "Act 1 Scene 13", id: 14, time: "" },
    { name: "Intermission", id: 15, time: "" },
    { name: "Act 2 Scene 1", id: 16, time: "" },
    { name: "Act 2 Scene 2", id: 17, time: "" },
    { name: "Act 2 Scene 3", id: 18, time: "" },
    { name: "Act 2 Scene 4", id: 18, time: "" },
    { name: "Act 2 Scene 5", id: 20, time: "" },
    { name: "Act 2 Scene 6", id: 21, time: "" },
    { name: "Act 2 Scene 7", id: 22, time: "" },
    { name: "Act 2 Scene 8", id: 23, time: "" },
    { name: "Act 2 Scene 9", id: 24, time: "" },
    { name: "Epilogue", id: 25, time: "" },
  ]);

  const [activeScene, setActiveScene] = useState(-1);

  return (
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
  );
};

export default Scenes;
