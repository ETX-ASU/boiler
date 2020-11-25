import React from 'react';
import "./ToggleSwitch.scss";

function ToggleSwitch(props) {
  return (
    <div className="toggle-switch">
      <div className="switch">
        <div>
          <input type="checkbox" id={`cbox-${props.id}`} checked={props.value} onChange={props.handleToggle} />
          <label htmlFor={`cbox-${props.id}`}>
            <span></span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default ToggleSwitch;
