import React, { useRef } from "react";

export default function AES({
  currentOp,
  helpers,
  setOutputBinary,
  opInfo,
  isDisabled
}) {
  let chooseAlgRef = useRef(null);
  let chooseAlgModeRef = useRef(null);
  let keyRef = useRef(null);

  function triggerFn() {}
  return (
    <>
      <div className="div">
        <span>Algorithm</span>
        <select ref={chooseAlgRef}>
          <option value="128">AES-128</option>
          <option value="256">AES-256</option>
        </select>
      </div>
      <div className="div">
        <span>Mode</span>
        <select ref={chooseAlgModeRef}>
          <option value="cbc">CBC</option>
          <option value="ctr">CTR</option>
        </select>
      </div>
      <div className="div">
        <span>Key</span>
        <input type="text" ref={keyRef} defaultValue="" />
      </div>
      <div className="div">
        <span>IV</span>
        <input type="text" ref={keyRef} defaultValue="" />
      </div>
    </>
  );
}
