import React, { useEffect, useRef } from "react";

export default function UnicodePoints({
  currentOp,
  opInfo,
  helpers,
  setOutputBinary,
  isDisabled,
}) {
  const selectFormatRef = useRef(null);
  const seperatorRef = useRef(null);

  function validate(input) {
    if(input.length === 0) return false;   
    const seperatorNotEmpty = seperatorRef.current.value !== "";
    if (seperatorNotEmpty) return true;

    helpers.haltMessage(opInfo, "seperator cannot be empty")
    return false;
  }

  function encode(text) {
    let arr = [];
    for (let char of text) {
      arr.push(char.charCodeAt());
    }
    return arr
      .map((num) => {
        switch (selectFormatRef.current.value) {
          case "unicode": {
            return `U+${num.toString(16)}`;
          }
          case "decimal": {
            return num;
          }
          case "hexadecimal": {
            return num.toString(16);
          }
          case "octal": {
            return num.toString(8);
          }
          case "binary": {
            return num.toString(2);
          }
          case "ncr-d": {
            return `&#${num};`;
          }
          case "ncr-h": {
            return `&#x${num.toString(16)};`;
          }
        }
      })
      .join(seperatorRef.current.value);
  }

  function decode(text) {
    let splittedText = text.split(seperatorRef.current.value);
    let arr = [];
    let reg;
    switch (selectFormatRef.current.value) {
      case "unicode":
        reg = /(?<=^U\+)[\dA-F]+(?=$)/i;
        break;
      case "decimal":
        reg = /(?<=^)\d+(?=$)/;
        break;
      case "hexadecimal":
        reg = /(?<=^)[\dA-F]+(?=$)/i;
        break;
      case "binary":
        reg = /(?<=^)[0-1]+(?=$)/;
        break;
      case "octal":
        reg = /(?<=^)[0-7]+(?=$)/;
        break;
      case "ncr-d":
        reg = /(?<=(^&#))\d+(?=;$)/;
        break;
      case "ncr-h":
        reg = /(?<=(^&#x))[\dA-F]+(?=;$)/i;
        break;
    }
    splittedText.forEach((chunk) => {
      if (reg.test(chunk)) {
        let matchNum = chunk.match(reg)[0];
        switch (selectFormatRef.current.value) {
          case "decimal":
          case "ncr-d":
            arr.push(Number(matchNum).toString(16));
            break;

          case "hexadecimal":
          case "ncr-h":
          case "unicode":
            arr.push(matchNum);
            break;

          case "octal":
            arr.push(Number(`0o${matchNum}`).toString(16));
            break;

          case "binary":
            arr.push(Number(`0b${matchNum}`).toString(16));
            break;
        }
      }
    });
    return arr
      .map((num) => {
        let number = `${num}`.split("");
        while (number.length % 2 !== 0) {
          number.unshift("0");
        }
        number = number.join("");
        let numInHex = Number(`0x${num}`);
        let inUnicode = String.fromCharCode(numInHex);
        return inUnicode;
      })
      .join("");
  }

  function triggerFn() {
    let inputBinary = helpers.getFromStorage("outputBins");
    if (validate(inputBinary)) {
      let result;
      switch (currentOp) {
        case "encode": {
          result = encode(helpers.binToChar(inputBinary).join(""));
          break;
        }
        case "decode": {
          result = decode(helpers.binToChar(inputBinary).join(""));
          break;
        }
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
        <span>Format</span>
        <select
          ref={selectFormatRef}
          title="format"
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
        >
          <option value="unicode">Unicode notation</option>
          <option value="decimal">Decimal</option>
          <option value="hexadecimal">Hexadecimal</option>
          <option value="binary">Binary</option>
          <option value="octal">Octal</option>
          <option value="ncr-d">NCR (Decimal)</option>
          <option value="ncr-h">NCR (Hexadecimal)</option>
        </select>
      </div>
      <div className="div">
        <span>Seperator</span>
        <input
          type="text"
          placeholder="Seperator"
          ref={seperatorRef}
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
          defaultValue=" "
          title="seperator"
        />
      </div>
    </>
  );
}
