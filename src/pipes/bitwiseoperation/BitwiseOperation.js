import React, { useRef, useEffect } from "react";
import { useState } from "react";

export default function BitwiseOperation({
  isDisabled,
  helpers,
  opInfo,
  setOutputBinary
}) {
  const typeRef = useRef(null);
  const operandBRef = useRef(null);
  const [current, setCurrent] = useState(["bitwise", "and"]);

  function validate(input) {
    const inputIsNotEmpty = input.length > 0;

    if (inputIsNotEmpty) {
      if (current === "not") return true;
      if (/^([\dA-F]{2} ?)+$/i.test(operandBRef.current.value)) {
        return true;
      } else {
        helpers.haltMessage(
          opInfo,
          "Operand B must consist of one or more hexadecimal values"
        );
        return false;
      }
    }
  }

  function convertBitwise(inputBinary) {
    if (current === "not") {
      return inputBinary.map(octet =>
        octet
          .split("")
          .map(bit => (Number(bit) ? "0" : "1"))
          .join("")
      );
    } else {
      let keyInitial = operandBRef.current.value
        .match(/[\dA-F]{2}/gi)
        .map(byte => helpers.lengthen(Number(`0x${byte}`).toString(2), "0"));
      let keyMutated = keyInitial;
      let cipher = [];
      let textBits = inputBinary.join("").split("");

      switch (true) {
        case keyInitial.length > inputBinary.length:
          keyMutated = operandBRef.current.value
            .match(/[\dA-F]{2}/gi)
            .slice(0, inputBinary.length);
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
      let keyBits = keyMutated.join("").split("");
      keyBits.forEach((bit, i) => {
        switch (typeRef.current.value) {
          case "and":
            cipher.push(Number(bit) & Number(textBits[i]));
            break;
          case "nand":
            cipher.push(Number(bit) & (Number(textBits[i]) === 1) ? 0 : 1);
            break;
          case "or":
            cipher.push(Number(bit) | Number(textBits[i]));
            break;
          case "nor":
            cipher.push(Number(bit) | (Number(textBits[i]) === 1) ? 0 : 1);
            break;
          case "xor":
            cipher.push(Number(bit) ^ Number(textBits[i]));
            break;
          case "xnor":
            cipher.push(Number(bit) ^ (Number(textBits[i]) === 1) ? 0 : 1);
            break;
        }
      });
      let groupedCipher = cipher.join("").match(/[01]{8}/g);
      return groupedCipher;
    }
  }

  function triggerFn() {
    const input = helpers.getFromStorage("outputBins");
    if (validate(input)) {
      helpers.updateStorage({ outputBins: convertBitwise(input) });
    }
  }

  useEffect(() => {
    if (!isDisabled) triggerFn();
  });
  return (
    <>
      <div className="div">
        <span>Type</span>
        <select
          ref={typeRef}
          onInput={e => {
            setCurrent(e.target.value);
            setOutputBinary(helpers.getFromStorage("inputBins"));
          }}
        >
          <option value="and">AND (a & b)</option>
          <option value="nand">NAND ~(a & b)</option>
          <option value="or">OR (a | b)</option>
          <option value="nor">NOR ~(a | b)</option>
          <option value="xor">XOR (a ^ b)</option>
          <option value="xnor">XNOR ~(a ^ b)</option>
          <option value="not">NOT ~(a)</option>
        </select>
      </div>
      {(() => {
        if (current !== "not") {
          return (
            <div className="div">
              <span>Operand B</span>
              <input
                type="text"
                ref={operandBRef}
                defaultValue="0f"
                onInput={() =>
                  setOutputBinary(helpers.getFromStorage("inputBins"))
                }
              />
            </div>
          );
        }
      })()}
    </>
  );
}
