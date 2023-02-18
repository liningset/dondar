import React, { useRef } from "react";

export default function HMAC({
  currentOp,
  helpers,
  setOutputBinary,
  opInfo,
  isDisabled
}) {
  let chooseAlgRef = useRef(null);
  let keyRef = useRef(null);

  function md5(input) {}
  function sha1(input) {}
  function sha256(input) {}
  function sha384(input) {}
  function sha512(input) {}

  function triggerFn() {}
  return (
    <>
      <div className="div">
        <span>Algorithm</span>
        <select ref={chooseAlgRef}>
          <option value="md5">MD5</option>
          <option value="sha1">SHA-1</option>
          <option value="sha256" selected>
            SHA-256
          </option>
          <option value="sha384">SHA-384</option>
          <option value="sha512">SHA-512</option>
        </select>
      </div>
      <div className="div">
        <span>Key</span>
        <input type="text" ref={keyRef} defaultValue="63 72 79 70 74 69 69" />
      </div>
    </>
  );
}
