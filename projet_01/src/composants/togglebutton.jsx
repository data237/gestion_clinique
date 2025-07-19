import React, { useState } from "react";
import "./ToggleButton.css"; // crée ce fichier à côté

function ToggleButton(){
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => setIsOn(!isOn)} className={`toggle-button ${isOn ? "on" : ""}`}>
      <div  className={ `circle  ${isOn ? "active" : ""}`}></div>
    </button>
  );
};

export default ToggleButton;
