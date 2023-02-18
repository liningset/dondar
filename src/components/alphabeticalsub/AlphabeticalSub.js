import React, { useEffect, useRef } from "react";

export default function AlphabeticalSub({
  opInfo,
  helpers,
  setOutputBinary,
  isDisabled
}) {
  const plainAlphaRef = useRef(null);
  const cipherAlphaRef = useRef(null);

  function validate() {
    let checkIfNotEmpty = helpers.getFromStorage("outputBins").length !== 0;
    let checkLackOfPlainDuplicate = true;
    let checkLackOfCipherDuplicate = true;

    {
      if (
        plainAlphaRef.current.value
          .split("")
          .some(
            char =>
              plainAlphaRef.current.value.match(
                new RegExp(`[\\\\${char}]`, "g")
              ).length > 1
          )
      ) {
        checkLackOfPlainDuplicate = false;
      }

      if (
        cipherAlphaRef.current.value
          .split("")
          .some(
            char =>
              cipherAlphaRef.current.value.match(
                new RegExp(`[\\\\${char}]`, "g")
              ).length > 1
          )
      ) {
        checkLackOfCipherDuplicate = false;
      }
    }
    if (
      checkLackOfCipherDuplicate &&
      checkLackOfPlainDuplicate &&
      checkIfNotEmpty
    ) {
      return true;
    } else {
      if (!checkLackOfPlainDuplicate) {
        helpers.updateStorage({
          haltedAt: [
            ...helpers.getFromStorage("haltedAt"),
            {
              at: `${opInfo.index + 1}.${opInfo.title}: `,
              error: "duplicate characters are not allowed in plaintext field"
            }
          ]
        });
      }
      if (!checkLackOfCipherDuplicate) {
        helpers.updateStorage({
          haltedAt: [
            ...helpers.getFromStorage("haltedAt"),
            {
              at: `${opInfo.index + 1}.${opInfo.title}: `,
              error: "duplicate characters are not allowed in ciphertext field"
            }
          ]
        });
      }
      return false;
    }
  }

  function substitude(text) {
    let arr = [];
    for (let char of text) {
      if (plainAlphaRef.current.value.includes(char)) {
        let indexInPlainAlpha = plainAlphaRef.current.value
          .split("")
          .indexOf(char);
        if (cipherAlphaRef.current.value[indexInPlainAlpha] !== undefined) {
          arr.push(cipherAlphaRef.current.value[indexInPlainAlpha]);
        } else arr.push(char);
      } else arr.push(char);
    }
    return arr;
  }

  function triggerFn() {
    if (validate()) {
      const InputInString = helpers
        .binToChar(helpers.getFromStorage("outputBins"))
        .join("");
      let result = substitude(InputInString);
      helpers.updateStorage({
        outputBins: helpers.charToBin(result)
      });
    }
  }

  useEffect(() => {
    if (!isDisabled) triggerFn();
  });

  return (
    <>
      <div className="inputs-flex">
        <label htmlFor="plainAlpha">
          plaintext alphabet
          <input
            type="text"
            id="plainAlpha"
            defaultValue="abcdefghijklmnopqrstuvwxyz"
            placeholder="plaintext alphabet"
            ref={plainAlphaRef}
            onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
            pattern=".+"
            required
          />
        </label>
        <label htmlFor="cipherAlpha">
          ciphertext alphabet
          <input
            type="text"
            id="cipherAlpha"
            defaultValue="zyxwvutsrqponmlkjihgfedcba"
            placeholder="ciphertext alphabet"
            ref={cipherAlphaRef}
            onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
            pattern=".+"
            required
          />
        </label>
      </div>
    </>
  );
}
