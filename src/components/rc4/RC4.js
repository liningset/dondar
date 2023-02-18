import React, { useRef } from "react";

export default function RC4({
  currentOp,
  helpers,
  setOutputBinary,
  opInfo,
  isDisabled
}) {
  let keyRef = useRef(null);

  function triggerFn() {}
  return (
    <>
      <div className="div">
        <span>Key</span>
        <input type="text" ref={keyRef} />
      </div>
      <div className="div">
        <span>Drop bytes</span>
        <div className="range">
          <button className="subtract">
            <i className="fas fa-minus"></i>
          </button>
          <input type="text" pattern="-?[0-9]{1,7}|0+" defaultValue="3" />
          <button className="add">
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </>
  );
}
