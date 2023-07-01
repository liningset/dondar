import React, { useRef, useEffect } from "react";

export default function Xor({ isDisabled, helpers, opInfo, setOutputBinary }) {
  let keyFieldRef = useRef(null);

  function validate(input) {
    let inputIsNotEmpty = input.length > 0;
    let keyIsNotEmpty = keyFieldRef.current.value !== "";
    let keyIsValid = /^([\da-f]{2} ?)+$/i.test(keyFieldRef.current.value);
    if (inputIsNotEmpty) {
      if (keyIsNotEmpty) {
        if (keyIsValid) {
          return true;
        } else {
          helpers.haltMessage(
            opInfo,
            "The key has invalid format, it must consist of 8-bit binary number(s) (read notes for more info)"
          );
          return false;
        }
      } else {
        helpers.haltMessage(opInfo, "The key must not be empty");
        return false;
      }
    }
  }

  function generateRandomKey(input) {
    let key = [];
    if (input.length > 0) {
      for (let i = 0; i < input.length; i++) {
        key.push(
          helpers.lengthen(Math.floor(Math.random() * 256).toString(16), "0", 2)
        );
      }
    }
    keyFieldRef.current.value = key.join(" ");
  }

  function convert(inputBinary) {
    let keyInitial = keyFieldRef.current.value.match(/[\da-f]{2}/gi);
    let keyMutated = keyInitial;

    switch (true) {
      case keyInitial.length > inputBinary.length:
        keyMutated = keyFieldRef.current.value
          .match(/[\da-f]{2}/gi)
          .filter((x, i) => i < inputBinary.length);
        break;

      case keyInitial.length < inputBinary.length:
        let shortKey = keyInitial;
        keyMutated = shortKey;
        for (let i = 0; i < keyMutated.length; i++) {
          if (keyMutated.length === inputBinary.length) {
            break;
          } else {
            keyMutated.push(keyMutated[i]);
          }
        }
        break;
    }

    let cipher = [];
    let textBits = inputBinary.join("").split("");
    let keyBits = keyMutated.join("").split("");

    keyBits.forEach((bit, i) => cipher.push(Number(bit) ^ Number(textBits[i])));
    let groupedCipher = cipher.join("").match(/[\da-f]{2}/gi);
    return groupedCipher;
  }

  function triggerFn() {
    const input = helpers.getFromStorage("outputBins");
    if (validate(input)) {
      helpers.updateStorage({
        outputBins: convert(input).map((x) =>
          helpers.lengthen(Number(`0x${x}`).toString(2), "0", 8)
        ),
      });
    }
  }

  useEffect(() => {
    if (!isDisabled) triggerFn();
  });

  return (
    <>
      <div className="key-area-container">
        <div className="div">
          <div>
            <span>Key</span>
            <button
              id="randtextlength-btn"
              title="generate random key"
              className="rand"
              onClick={() => {
                generateRandomKey(helpers.getFromStorage("outputBins"));
                setOutputBinary(helpers.getFromStorage("inputBins"));
              }}
            >
              <i className="fas fa-dice"></i>
            </button>
          </div>
          <input
            id="key-area"
            cols="30"
            rows="5"
            spellCheck="false"
            placeholder="The key"
            title="your key"
            onInput={() => {
              setOutputBinary(helpers.getFromStorage("inputBins"));
            }}
            defaultValue="0f"
            ref={keyFieldRef}
          />
        </div>
      </div>
    </>
  );
}
