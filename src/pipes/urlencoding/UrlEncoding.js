import React, { useEffect, useRef } from "react";

export default function UrlEncoding({
  currentOp,
  opInfo,
  helpers,
  setOutputBinary,
  isDisabled
}) {
  const selectSpaceRef = useRef(null);

  function validate(input) {
    switch (currentOp) {
      case "encode": {
        return input.length !== 0;
      }
      case "decode": {
        let textArr = helpers.binToChar(input);
        let allowedCharsReg =
          selectSpaceRef.current.value === "plus"
            ? /[^!#$&'()*,/:;=?@[\]]/
            : /[^!#$&'()*,/+:;=?@[\]]/;

        if (textArr.every(char => allowedCharsReg.test(char))) {
          return true;
        } else {
          let errorChar = textArr.find(x => !allowedCharsReg.test(x));

          helpers.haltMessage(opInfo, `Invalid character at index ${textArr.indexOf(
            errorChar
          )}`);
          return false;
        }
      }
    }
  }

  function encode(text) {
    selectSpaceRef.current.className = "";
    switch (selectSpaceRef.current.value) {
      case "plus":
        return encodeURIComponent(text)
          .replace(/[!()*']|%20/g, x => {
            return x === "%20"
              ? "+"
              : `%${x
                  .charCodeAt(0)
                  .toString(16)
                  .toUpperCase()}`;
          })
          .replace(/%20/g, "+");

      case "hex":
        return encodeURIComponent(text).replace(
          /[!()*']/g,
          x =>
            `%${x
              .charCodeAt(0)
              .toString(16)
              .toUpperCase()}`
        );
    }
  }
  function decode(text) {
    return decodeURIComponent(text.replace(/\+/g, "%20"));
  }

  function triggerFn() {
    let inputBinary = helpers.getFromStorage("outputBins");
    if (validate(inputBinary)) {
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
        outputBins: helpers.charToBin(result.split(""))
      });
    }
  }

  useEffect(() => {
    if (!isDisabled) triggerFn();
  });

  return (
    <div className="div">
      <span>Variant</span>
      <select
        ref={selectSpaceRef}
        onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
        title="choose what to encode space characters as"
      >
        <option value="hex">encode space as %20</option>
        <option value="plus">encode space as +</option>
      </select>
    </div>
  );
}
