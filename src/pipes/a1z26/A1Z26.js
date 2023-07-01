import React, { useEffect, useRef } from "react";

export default function A1Z26({
  currentOp,
  isDisabled,
  helpers,
  opInfo,
  setOutputBinary
}) {
  const seperatorInputRef = useRef(null);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function encode(text) {
    let indexes = [];
    for (let char of text) {
      if (alphabet.includes(char.toLowerCase())) {
        indexes.push(alphabet.indexOf(char.toLowerCase()) + 1);
      }
    }
    return indexes.join(seperatorInputRef.current.value).split("");
  }
  function decode(text) {
    let sanitizedText = text.replace(/(^[^\d]+)|([^\d]+$)/g, "");
    let matches = sanitizedText.split(seperatorInputRef.current.value);

    let convertedArr = matches.map(item => alphabet[item - 1]);

    return convertedArr.join("").split("");
  }

  function triggerFn() {
    if (seperatorInputRef.current.validity.valid) {
      let inputBinary = helpers.getFromStorage("outputBins");
      let result;
      switch (currentOp) {
        case "encode":
          result = encode(helpers.binToChar(inputBinary).join(""));
          break;

        case "decode":
          result = decode(helpers.binToChar(inputBinary).join(""));
          break;
      }
      helpers.updateStorage({
        outputBins: helpers.charToBin(result)
      });
    } else helpers.haltMessage(opInfo, "seperator cannot be empty");
      
    
  }

  useEffect(() => {
    if (!isDisabled) triggerFn();
  });
  return (
    <div className="div">
      <span>Seperator</span>
      <input
        type="text"
        ref={seperatorInputRef}
        placeholder="Seperator"
        pattern=".+"
        onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
        defaultValue="/"
        title="seperator"
        required
      />
    </div>
  );
}
