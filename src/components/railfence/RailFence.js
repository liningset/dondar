import React, { useRef, useEffect } from "react";

export default function RailFence({
  currentOp,
  helpers,
  setOutputBinary,
  opInfo,
  isDisabled
}) {
  const keyRef = useRef(null);
  const offsetRef = useRef(null);

  function validate(input) {
    let inputIsNotEmpty = input.length > 0;
    let keyIsValid =
      /^\d+$/.test(keyRef.current.value) &&
      Number(keyRef.current.value) >= 2 &&
      Number(keyRef.current.value) <= 99;
    let offsetIsValid =
      /^\d+$/.test(offsetRef.current.value) &&
      Number(offsetRef.current.value) < Number(keyRef.current.value);
    if (inputIsNotEmpty) {
      if (keyIsValid) {
        if (offsetIsValid) {
          return true;
        } else {
          helpers.updateStorage({
            haltedAt: [
              ...helpers.getFromStorage("haltedAt"),
              {
                at: `${opInfo.index + 1}.${opInfo.title}: `,
                error: "Offset must be a number between 0 and the value of key"
              }
            ]
          });
          return false;
        }
      } else {
        helpers.updateStorage({
          haltedAt: [
            ...helpers.getFromStorage("haltedAt"),
            {
              at: `${opInfo.index + 1}.${opInfo.title}: `,
              error: "Key must be a number between 2 and 99"
            }
          ]
        });
        return false;
      }
    } else return false;
  }

  function generateMatrix(rowNum, colNum) {
    let matrix = [];
    let row = [];
    for (let i = 0; i < rowNum; i++) row.push(null);
    for (let i = 0; i < colNum; i++) matrix.push(row);
    return matrix;
  }

  function populateMatrix(matrix, input, offset) {
    let opSwitch = "+";
    for (let atCol = 0; atCol < matrix[0].length; atCol++) {
      if (offset === matrix.length - 1) opSwitch = "-";
      if (offset === 0) opSwitch = "+";
      matrix.splice(
        offset,
        1,
        matrix[offset].map((c, i) => (i === atCol ? input[atCol] : c))
      );
      opSwitch === "+" ? offset++ : offset--;
    }

    return matrix;
  }

  function layoutHints(matrix, input, offset) {
    let opSwitch = "+";
    for (let atCol = 0, atChar = 0; atCol < matrix[0].length; atCol++) {
      if (offset === matrix.length - 1) opSwitch = "-";
      if (offset === 0) opSwitch = "+";
      matrix.splice(
        offset,
        1,
        matrix[offset].map((c, i) => {
          if (i === atCol) {
            if (offset === 0) {
              atChar++;
              return input[atChar - 1];
            } else return "";
          } else return c;
        })
      );
      opSwitch === "+" ? offset++ : offset--;
    }
    return matrix;
  }

  function placeChars(matrix, input) {
    let currentString = input.slice(
      matrix[0].filter(x => x != null).length,
      input.length
    );
    return matrix.map(row => {
      return row.map(value => {
        if (value === "") {
          let replaceWith = currentString[0];
          currentString = currentString.replace(currentString[0], "");
          return replaceWith;
        } else return value;
      });
    });
  }

  function assemblePieces(matrix, offset) {
    let opSwitch = "+";
    let arr = [];
    for (let atCol = 0; atCol < matrix[0].length; atCol++) {
      if (offset === matrix.length - 1) opSwitch = "-";
      if (offset === 0) opSwitch = "+";
      arr.push(matrix[offset][atCol]);
      opSwitch === "+" ? offset++ : offset--;
    }
    return arr.join("");
  }

  function encode(text, key, offset) {
    let emptyMatrix = generateMatrix(text.length, key);
    return populateMatrix(emptyMatrix, text, offset)
      .map(row => row.join(""))
      .join("");
  }

  function decode(text, key, offset) {
    let emptyMatrix = generateMatrix(text.length, key);
    let modifiedMatrix = layoutHints(emptyMatrix, text, offset);
    let filledMatrix = placeChars(modifiedMatrix, text);
    return assemblePieces(filledMatrix, offset);
  }

  function triggerFn() {
    const inputBinary = helpers.getFromStorage("outputBins");
    if (validate(inputBinary)) {
      let result;
      switch (currentOp) {
        case "encode":
          result = encode(
            helpers.binToChar(inputBinary).join(""),
            Number(keyRef.current.value),
            Number(offsetRef.current.value)
          );
          break;

        case "decode":
          result = decode(
            helpers.binToChar(inputBinary).join(""),
            Number(keyRef.current.value),
            Number(offsetRef.current.value)
          );
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
    <>
      <div className="div">
        <span>Key</span>
        <div className="key-field range">
          <button
            className="subtract"
            onClick={() => {
              keyRef.current.value =
                /^\d+$/.test(keyRef.current.value) &&
                Number(keyRef.current.value) > 2
                  ? Number(keyRef.current.value) - 1
                  : 99;

              setOutputBinary(helpers.getFromStorage("inputBins"));
            }}
          >
            <i className="fas fa-minus"></i>
          </button>
          <input
            type="tel"
            ref={keyRef}
            defaultValue="2"
            onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
          />
          <button
            className="add"
            onClick={() => {
              keyRef.current.value =
                /^\d+$/.test(keyRef.current.value) && keyRef.current.value < 99
                  ? Number(keyRef.current.value) + 1
                  : 2;
              setOutputBinary(helpers.getFromStorage("inputBins"));
            }}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      <div className="div">
        <span>Offset</span>
        <div className="offset-field range">
          <button
            className="subtract"
            onClick={() => {
              if (!isNaN(Number(keyRef.current.value))) {
                if (
                  /^\d+$/.test(offsetRef.current.value) &&
                  Number(offsetRef.current.value) !== 0
                ) {
                  offsetRef.current.value = Number(offsetRef.current.value) - 1;
                } else {
                  offsetRef.current.value = Number(keyRef.current.value) - 1;
                }
              } else offsetRef.current.value = 0;
              setOutputBinary(helpers.getFromStorage("inputBins"));
            }}
          >
            <i className="fas fa-minus"></i>
          </button>
          <input
            type="tel"
            ref={offsetRef}
            defaultValue="0"
            onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
          />
          <button
            className="add"
            onClick={() => {
              offsetRef.current.value =
                /^\d+$/.test(offsetRef.current.value) &&
                keyRef.current.value > Number(offsetRef.current.value) + 1
                  ? Number(offsetRef.current.value) + 1
                  : 0;
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
