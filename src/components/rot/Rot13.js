import React, { useEffect, useRef } from "react";

export default function Rot13({ setOutputBinary, helpers }) {
  const selectRotRef = useRef(null);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const asciiT =
    "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

  function iterator(char, charset, moveCount) {
    let maxIndex = charset.length - 1;
    let i = 0;
    let currentIndex = charset
      .split("")
      .indexOf(moveCount !== 47 ? char.toUpperCase() : char);
    while (i < moveCount) {
      i++;
      currentIndex === maxIndex ? (currentIndex = 0) : currentIndex++;
    }
    return char.toLowerCase() === char && moveCount !== 47
      ? charset[currentIndex].toLowerCase()
      : charset[currentIndex];
  }

  function convert(text) {
    let arr = [];
    for (let char of text) {
      switch (selectRotRef.current.value) {
        case "5": {
          if (/[0-9]/.test(char)) {
            arr.push(iterator(char, numbers, 5));
          } else {
            arr.push(char);
          }
          break;
        }
        case "13": {
          if (/[a-z]/i.test(char)) {
            arr.push(iterator(char, alphabet, 13));
          } else {
            arr.push(char);
          }
          break;
        }
        case "18": {
          if (/[a-z]/i.test(char)) {
            arr.push(iterator(char, alphabet, 13));
          } else if (/[0-9]/.test(char)) {
            arr.push(iterator(char, numbers, 5));
          } else {
            arr.push(char);
          }
          break;
        }
        case "47": {
          if (
            /[!"#\$%&'\(\)*+,\-\.\/0123456789:;<=>\?@ABCDEFGHIJKLMNOPQRSTUVWXYZ\[\]\^_`abcdefghijklmnopqrstuvwxyz\{\|\}~]/.test(
              char
            )
          ) {
            arr.push(iterator(char, asciiT, 47));
          } else {
            arr.push(char);
          }
          break;
        }
      }
    }
    return arr;
  }

  function triggerFn() {
    let outputBinary = helpers.getFromStorage("outputBins");
    let inputArr = helpers.binToChar(outputBinary);
    let convertedArr = convert(inputArr.join(""));
    let result = helpers.charToBin(convertedArr);
    helpers.updateStorage({ outputBins: result });
  }

  useEffect(() => triggerFn());

  return (
    <div className="div">
      <span>Variant</span>
      <select
        defaultValue="13"
        ref={selectRotRef}
        onInput={() => {
          setOutputBinary(helpers.getFromStorage("inputBins"));
        }}
      >
        <option value="5">rot5(0-9)</option>
        <option value="13">rot13(A-Z,a-z)</option>
        <option value="18">rot18(A-Z,a-z,0-9)</option>
        <option value="47">rot47(!-~)</option>
      </select>
    </div>
  );
}
