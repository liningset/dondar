import React, { useEffect, useRef } from "react";

export default function RailFence({
  helpers,
  currentOp,
  isDisabled,
  setOutputBinary,
  opInfo,
}) {
  const charsets = {
    original: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".match(/IJ|UV|[A-Z]/g),
    unique: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  };
  const [selectVariantRef, letter1Ref, letter2Ref, seperatorRef] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  function validate() {
    const letter1IsValid = letter1Ref.current.value.length === 1;
    const letter2IsValid = letter2Ref.current.value.length === 1;
    const lettersAreDifferent =
      letter1Ref.current.value !== letter2Ref.current.value;

    if (letter1IsValid && letter2IsValid) {
      if (lettersAreDifferent) {
        return true;
      } else {
        helpers.haltMessage(opInfo, "letter 1 and letter 2 cannot be identical");
        return false;
      }
    } else {
      helpers.haltMessage(opInfo, "letter 1 and letter 2 both have to be 1 character long");
    }
  }

  function encode(input, set, aAndB) {
    let inputText = helpers.binToChar(input).join("");
    let output = [];
    inputText = inputText.replace(/[^A-Z]/gi, "").toUpperCase();
    for (let char of inputText) {
      set.forEach((cell, index) => {
        if (cell.includes(char)) {
          output.push(
            helpers
              .lengthen(index.toString(2), "0", 5)
              .replace(/0/g, "\n")
              .replace(/1/g, aAndB[1])
              .replace(/\n/g, aAndB[0])
          );
        }
      });
    }
    return output.join(seperatorRef.current.value);
  }

  function decode(input, set, aAndB) {
    let inputText = helpers.binToChar(input).join("");
    let regex = new RegExp(`[${aAndB[0]}${aAndB[1]}]?`, "g");
    let stringGroups = inputText.match(regex).join("").match(/.{5}/g) || [];
    let binifiedGroups = stringGroups.map((group) => {
      let binified = group
        .replaceAll(aAndB[0], "\n")
        .replaceAll(aAndB[1], "1")
        .replace(/\n/g, "0");
      return set[Number(`0b${binified}`)][0];
    });
    console.log(inputText, regex, stringGroups);
    return binifiedGroups.join("");
  }

  function triggerFn() {
    let inputBinary = helpers.getFromStorage("outputBins");
    if (validate()) {
    }
    let result = "";
    switch (currentOp) {
      case "encode":
        result = encode(inputBinary, charsets[selectVariantRef.current.value], [
          letter1Ref.current.value,
          letter2Ref.current.value,
        ]);
        break;

      case "decode":
        result = decode(inputBinary, charsets[selectVariantRef.current.value], [
          letter1Ref.current.value,
          letter2Ref.current.value,
        ]);
        break;
    }
    helpers.updateStorage({ outputBins: helpers.charToBin(result.split("")) });
  }

  useEffect(() => {
    if (!isDisabled) triggerFn();
  });
  return (
    <>
      <div className="div">
        <span>Variant</span>
        <select
          ref={selectVariantRef}
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
        >
          <option value="original">Original</option>
          <option value="unique">Unique code for each letter</option>
        </select>
      </div>
      <div className="div">
        <span>Seperator</span>
        <input
          title="the output of encrypted data will be seperated with the value of this field in between"
          type="text"
          defaultValue=" "
          ref={seperatorRef}
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
        />
      </div>
      <div className="div">
        <span>Letter 1</span>
        <input
          title="this is the letter that will replace 0s"
          type="text"
          defaultValue="a"
          ref={letter1Ref}
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
        />
      </div>
      <div className="div">
        <span>Letter 2</span>
        <input
          title="this is the letter that will replace 1s"
          type="text"
          defaultValue="b"
          ref={letter2Ref}
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
        />
      </div>
    </>
  );
}
