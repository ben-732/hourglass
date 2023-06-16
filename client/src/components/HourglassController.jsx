import axios from "axios";
import React, { useState } from "react";

const HourglassController = () => {
  const hourglassStates = ["aran", "off", "strobe", "standard"];

  return (
    <div className="bg-slate-800 p-4 rounded-md w-60  mx-2">
      <span className="block text-center">Hourglass Control</span>
      <div className="flex flex-row flex-wrap justify-center ">
        {hourglassStates.map((s) => (
          <HourglassButton state={s} key={s} />
        ))}
      </div>
    </div>
  );
};

function HourglassButton({ state }) {
  const [changeStatus, setChangeStatus] = useState("");
  return (
    <button
      onClick={() => {
        setChangeStatus("loading");
        axios
          .post("/api/hourglass/update", { state })
          .then(() => {
            setChangeStatus("");
          })
          .catch(() => {
            setChangeStatus("error");
          });
      }}
      className="px-2 py-1 w-24 bg-blue-600 m-1 capitalize rounded-md "
    >
      {state} {changeStatus && ` - ${changeStatus}`}
    </button>
  );
}

export default HourglassController;
