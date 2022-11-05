import React, { useEffect, useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function Caesar({
  currentOp,
  opInfo,
  helpers,
  setOutputBinary,
  setDescryption,
}) {
  let subtractionRef = useRef(null);
  let additionRef = useRef(null);
  let shiftInputRef = useRef(null);
  let rangeRef = useRef(null);
  let alphabete = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function iterator(char, moveCount, direction) {
    let i = 0;
    let currentIndex = alphabete.split("").indexOf(char.toUpperCase());
    switch (direction) {
      case "forwards":
        while (i < moveCount) {
          i++;
          currentIndex === 25 ? (currentIndex = 0) : currentIndex++;
        }
        break;

      case "backwards":
        while (i < moveCount) {
          i++;
          currentIndex === 0 ? (currentIndex = 25) : currentIndex--;
        }
    }

    return char.toLowerCase() === char
      ? alphabete[currentIndex].toLowerCase()
      : alphabete[currentIndex];
  }

  function validate(input) {
    let isNotEmpty = input.length !== 0;
    let shiftNumIsValid = shiftInputRef.current.validity.valid;
    if (isNotEmpty) {
      if (shiftNumIsValid) {
        return true;
      } else {
        helpers.updateStorage({
          haltedAt: [
            ...helpers.getFromStorage("haltedAt"),
            {
              at: `${opInfo.index + 1}.${opInfo.title}: `,
              error:
                "Shift value cannot be empty or non-numeric (except minus) and more than 7 digits long",
            },
          ],
        });
        return false;
      }
    } else {
      return false;
    }
  }

  function encode(text, shiftNum) {
    let arr = [];
    for (let char of text) {
      if (!alphabete.includes(char.toUpperCase())) {
        arr.push(char);
      } else {
        if (shiftNum < 0) {
          arr.push(iterator(char, Math.abs(shiftNum), "backwards"));
        } else {
          arr.push(iterator(char, Math.abs(shiftNum), "forwards"));
        }
      }
    }
    return arr.join("");
  }

  function decode(text, shiftNum) {
    let arr = [];
    for (let char of text) {
      if (!alphabete.includes(char.toUpperCase())) {
        arr.push(char);
      } else {
        if (shiftNum < 0) {
          arr.push(iterator(char, Math.abs(shiftNum), "forwards"));
        } else {
          arr.push(iterator(char, Math.abs(shiftNum), "backwards"));
        }
      }
    }
    return arr.join("");
  }

  function overwriteRangeReg() {
    if (shiftInputRef.current.validity.valid) {
      rangeRef.current.innerText = `a → ${iterator(
        "a",
        Math.abs(shiftInputRef.current.value),
        shiftInputRef.current.value > 0 ? "forwards" : "backwards"
      )}`;
    } else rangeRef.current.innerText = "a → ?";
  }

  function triggerFn() {
    let inputBinary = helpers.getFromStorage("outputBins");
    if (validate(inputBinary)) {
      let result;

      switch (currentOp) {
        case "encode":
          result = encode(
            helpers.binToChar(inputBinary).join(""),
            shiftInputRef.current.value
          );
          break;

        case "decode":
          result = decode(
            helpers.binToChar(inputBinary).join(""),
            shiftInputRef.current.value
          );
          break;
      }
      helpers.updateStorage({
        outputBins: helpers.charToBin(result.split("")),
      });
    }
  }

  useEffect(() => triggerFn());

  return (
    <>
      <button
        className="subtract"
        ref={subtractionRef}
        onClick={() => {
          if (shiftInputRef.current.validity.valid)
            shiftInputRef.current.value--;
          else shiftInputRef.current.value = "0";
          overwriteRangeReg();
          setOutputBinary(helpers.getFromStorage("inputBins"));
        }}
      >
        <i className="fas fa-minus"></i>
      </button>
      <div className="div">
        <span ref={rangeRef}>a → a</span>
        <input
          type="text"
          pattern="-?[0-9]{1,7}|0+"
          ref={shiftInputRef}
          onInput={(e) => {
            overwriteRangeReg();
            if (!e.target.validity.valid) {
              helpers.updateStorage({
                haltedAt: [
                  ...helpers.getFromStorage("haltedAt"),
                  {
                    at: `${opInfo.index + 1}.${opInfo.title}: `,
                    error:
                      "Shift value cannot be empty or non-numeric (except minus) and more than 7 digits long",
                  },
                ],
              });
            }
            setOutputBinary(helpers.getFromStorage("inputBins"));
          }}
          defaultValue="0"
          placeholder="shift by"
          required
        />
      </div>
      <button
        className="add"
        ref={additionRef}
        onClick={() => {
          if (shiftInputRef.current.validity.valid)
            shiftInputRef.current.value++;
          else shiftInputRef.current.value = "0";

          overwriteRangeReg();
          setOutputBinary(helpers.getFromStorage("inputBins"));
        }}
      >
        <i className="fas fa-plus"></i>
      </button>
    </>
  );
}
