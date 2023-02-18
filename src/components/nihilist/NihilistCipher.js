import React, { useRef, useState, useEffect } from "react";

export default function NihilistCipher({
  currentOp,
  helpers,
  setOutputBinary,
  opInfo,
  isDisabled
}) {
  const ALPHABET = [
    ..."ABCDEFGH".split(""),
    "IJ",
    ..."KLMNOPQRSTUVWXYZ".split("")
  ];
  let squareKeyRef = useRef(null);
  let keyRef = useRef(null);
  let seperatorRef = useRef(null);
  let incrementTypeRef = useRef(null);

  function validate(input) {
    if (!input.length) return false;
    //----------------------------------------------------------------
    let seperatorIsNotEmpty = seperatorRef.current.value !== "";
    let seperatorIsValid = /^[^\d]+$/.test(seperatorRef.current.value);
    //----------------------------------------------------------------
    let key1HasValidFormat = /^[A-Z]*$/i.test(squareKeyRef.current.value);
    let key1IsShorterThan25 = squareKeyRef.current.value.length <= 25;
    let key1IsAllUnique = !/(?<=(\2.*))([A-Z])(?=(.*\2))/i.test(
      squareKeyRef.current.value
    );
    //---------------------------------------------------------------
    let key2HasValidLength = keyRef.current.value.length >= 2;
    let key2HasValidFormat = /^[A-Z]{2,}$/i.test(keyRef.current.value);
    //---------------------------------------------------------------

    if (key1IsShorterThan25) {
      if (key1HasValidFormat) {
        if (key1IsAllUnique) {
          if (key2HasValidLength) {
            if (key2HasValidFormat) {
              if (seperatorIsNotEmpty) {
                if (seperatorIsValid) {
                  switch (currentOp) {
                    case "encode":
                      return true;
                    case "decode":
                      let inputIsValid = helpers
                        .binToChar(input)
                        .join("")
                        .split(seperatorRef.current.value)
                        .every(n => /^\d{1,3}$/.test(n));
                      if (inputIsValid) {
                        return true;
                      } else {
                        helpers.haltMessage(
                          opInfo,
                          "input is not valid. A valid format would be: ddsddsddsddsdd <===> d for digits and s for seperating delimiter"
                        );
                        return false;
                      }
                  }
                  return true;
                } else {
                  helpers.haltMessage(
                    opInfo,
                    "Seperator cannot contain numbers."
                  );
                  return false;
                }
              } else {
                helpers.haltMessage(opInfo, "Seperator cannot be empty.");
                return false;
              }
            } else {
              helpers.haltMessage(
                opInfo,
                "Key 2 cannot contain non-alphabetic characters."
              );
              return false;
            }
          } else {
            helpers.haltMessage(
              opInfo,
              "Key 2 must be at least 2 characters long."
            );
            return false;
          }
        } else {
          helpers.haltMessage(
            opInfo,
            "Key 1 cannot contain duplicate characters."
          );
          return false;
        }
      } else {
        helpers.haltMessage(
          opInfo,
          "Key 1 cannot contain non-alphabetic characters."
        );
        return false;
      }
    } else {
      helpers.haltMessage(
        opInfo,
        "Key 1 must not exceed 25 characters in length."
      );
      return false;
    }
  }
  function layoutSquare(key1) {
    let arr = [];
    let chars = ALPHABET;

    if (key1 !== "") {
      key1.match(/ij|[a-z]/gi).forEach(token => {
        chars.forEach((char, i) => {
          if (new RegExp(`[${token}]`, "i").test(char)) {
            arr.push(char);
            chars.splice(i, 1);
          }
        });
      });
    }

    return [
      arr.concat(chars).slice(0, 5),
      arr.concat(chars).slice(5, 10),
      arr.concat(chars).slice(10, 15),
      arr.concat(chars).slice(15, 20),
      arr.concat(chars).slice(20, 25)
    ];
  }
  function padKey2(key2, len) {
    switch (true) {
      case key2.length >= len:
        return key2.slice(0, len);
      case key2.length < len:
        let cycle = key2.split("");
        let counter = 0;
        key2 = key2.split("");
        while (key2.length !== len) {
          key2.push(cycle[counter % cycle.length]);
          counter + 1 === cycle.length ? (counter = 0) : counter++;
        }
        return key2.join("").toUpperCase();
    }
  }
  function encode(input) {
    let poly = layoutSquare(squareKeyRef.current.value);
    let newKey2 = padKey2(keyRef.current.value, input.length);
    let ptNums = [];
    let keyNums = [];
    input.split("").forEach((char, charI) => {
      poly.forEach((row, rowI) => {
        row.forEach((col, colI) => {
          if (new RegExp(char, "i").test(col)) {
            ptNums.push(`${rowI + 1}${colI + 1}`);
          }
          if (new RegExp(newKey2[charI], "i").test(col)) {
            keyNums.push(`${rowI + 1}${colI + 1}`);
          }
        });
      });
    });
    return ptNums
      .map((num, i) =>
        incrementTypeRef.current.value === "normal"
          ? Number(num) + Number(keyNums[i])
          : (Number(num) + Number(keyNums[i])) % 100
      )
      .join(seperatorRef.current.value);
  }
  function decode(input) {
    let ctNums = input.split(seperatorRef.current.value);
    if (ctNums.some(x => !/^\d+$/.test(x))) return;
    let newKey2 = padKey2(keyRef.current.value, ctNums.length);
    let poly = layoutSquare(squareKeyRef.current.value);
    let keyNums = [];
    console.table(poly);
    console.log(newKey2);
    newKey2.split("").forEach(char => {
      poly.forEach((row, rowI) => {
        row.forEach((col, colI) => {
          if (col.includes(char)) keyNums.push(`${rowI + 1}${colI + 1}`);
        });
      });
    });

    let ptNums = ctNums.map((ctNum, i) =>
      incrementTypeRef.current.value === "normal"
        ? Number(ctNum) - Number(keyNums[i])
        : 100 - (Number(ctNum) - Number(keyNums[i]))
    );
    console.log(ptNums, ctNums, keyNums);
    return ptNums
      .map((ptNum, i) => {
        let [row, col] = String(ptNum)
          .split("")
          .map(n => Number(n));

        if (row-- < 1 || row-- > 5 || col-- < 1 || col-- > 5) {
          helpers.haltMessage(
            opInfo,
            `item ${row}*${col} at square does not exist.`
          );
          return "";
        }
        return poly[--row][--col][0];
      })
      .join("");
  }
  function triggerFn() {
    let inputBinary = helpers.getFromStorage("outputBins");
    if (validate(inputBinary)) {
      let result = "";
      switch (currentOp) {
        case "encode":
          result = encode(
            helpers
              .binToChar(inputBinary)
              .join("")
              .replace(/[^a-z]/gi, "")
          );
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
    <>
      <div className="div">
        <span>Key 1</span>
        <input
          type="text"
          ref={squareKeyRef}
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
          title="custom square order instead of default 'abc...xyz'"
          defaultValue="abcdefghiklmnopqrstuvwxyz"
        />
      </div>
      <div className="div">
        <span>Key 2</span>
        <input
          type="text"
          ref={keyRef}
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
          title="main key"
          defaultValue="dondar"
        />
      </div>
      <div className="div">
        <span>Incrementation</span>
        <select
          title="if second option is chosen the addition of (pt[i] + key[i]) at each index of i will be modular (wrapped around the value of 100)"
          ref={incrementTypeRef}
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
        >
          <option value="normal">normal</option>
          <option value="modular">mod 100</option>
        </select>
      </div>
      <div className="div">
        <span>Seperator</span>
        <input
          type="text"
          ref={seperatorRef}
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
          defaultValue=" "
        />
      </div>
    </>
  );
}
