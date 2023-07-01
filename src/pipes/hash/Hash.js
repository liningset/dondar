import React, { useRef, useState, useEffect } from "react";
import MD5 from "./md5";

export default function Hash({
  currentOp,
  helpers,
  setOutputBinary,
  opInfo,
  isDisabled,
}) {
  let chooseAlgRef = useRef(null);

  function triggerFn() {
    helpers.updateStorage({
      outputBins: helpers.charToBin(
        MD5(helpers, helpers.getFromStorage("outputBins").join("")).split("")
      ),
    });
  }
  useEffect(() => {
    if (!isDisabled) triggerFn();
  });
  return (
    <div className="div">
      <span>Algorithm</span>
      <select ref={chooseAlgRef}>
        <option value="md5">MD5</option>
        <option value="224">SHA-224</option>
        <option value="256" selected>
          SHA-256
        </option>
        <option value="384">SHA-384</option>
        <option value="512">SHA-512</option>
        <option value="512/224">SHA-512/224</option>
        <option value="512/224">SHA-512/256</option>
      </select>
    </div>
  );
}
