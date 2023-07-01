import React, { useEffect, useRef } from "react";

export default function RC4({
  currentOp,
  helpers,
  setOutputBinary,
  opInfo,
  isDisabled,
}) {
  let keyRef = useRef(null);
  let dropBytesRef = useRef(null);

  function validate(input) {
    if (input.length === 0) return false;

    let keyIsHex = /^([\da-f]{1,2}(\s+)?)+$/i.test(keyRef.current.value);
    let dropBytesIsNumber = false;
    let dropBytesHasValidRange = false;
    if (!isNaN(dropBytesRef.current.value)) {
      dropBytesIsNumber = true;
      if (
        Number(dropBytesRef.current.value) >= 0 &&
        Number(dropBytesRef.current.value) < 100
      )
        dropBytesHasValidRange = true;
    }
    if (keyIsHex) {
      if (dropBytesIsNumber && dropBytesHasValidRange) {
        return true;
      } else {
        helpers.haltMessage(
          opInfo,
          "Drop bytes must be a number between 0 and 99"
        );
        return false;
      }
    } else {
      helpers.haltMessage(opInfo, "Key is not hexadecimal bytes");
      return false;
    }
  }
  //*key scheduling algorithm*
  function KSA(key) {
    let S = [];
    for (let i = 0; i < 256; i++) S.push(i);
    let j = 0;
    S.forEach((num, i) => {
      j = (j + num + key[i % key.length].charCodeAt()) % 256;
      let temp = S[i];
      S[i] = S[j];
      S[j] = temp;
    });
    return S;
  }

  console.log(PRGA(5, KSA("pwd12")));
  //*psuedo-random generation algorithm*
  function PRGA(len, KSAoutput) {
    let KSA = KSAoutput;
    let output = [];
    let [i, j] = [0, 0];
    for (let index = 0; index < len; index++) {
      i = (i + 1) % 256;
      j = (j + KSA[i]) % 256;
      let temp = KSA[i];
      KSA[i] = KSA[j];
      KSA[j] = temp;
      output.push(KSA[(KSA[i] + KSA[j]) % 256]);
    }
    return output;
  }

  function encrypt() {}
  function decrypt() {}

  function triggerFn() {
    let inputBinary = helpers.getFromStorage("outputBins");
    if (validate(inputBinary)) {
      let result = "";
      switch (currentOp) {
        case "encode":
          break;

        case "decode":
          break;
      }
      helpers.updateStorage({
        outputBins: helpers.charToBin(result.split("")),
      });
    }
  }

  useEffect(() => {
    if (!isDisabled) triggerFn();
  });
  return (
    <>
      <div className="div">
        <span>Key</span>
        <input type="text" ref={keyRef} defaultValue="64 6f 6e 64 61 72" />
      </div>
      <div className="div">
        <span>Drop bytes</span>
        <div className="range">
          <button
            className="subtract"
            onClick={() => {
              if (Number(dropBytesRef.current.value) !== 0) {
                dropBytesRef.current.value =
                  (Number(dropBytesRef.current.value) - 1) % 100 || 0;
                setOutputBinary(helpers.getFromStorage("inputBins"));
              }
            }}
          >
            <i className="fas fa-minus"></i>
          </button>
          <input
            type="text"
            defaultValue="0"
            ref={dropBytesRef}
            onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
          />
          <button
            className="add"
            onClick={() => {
              dropBytesRef.current.value =
                (Number(dropBytesRef.current.value) + 1) % 100 || 0;
              setOutputBinary(helpers.getFromStorage("inputBins"));
            }}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </>
  );
}
