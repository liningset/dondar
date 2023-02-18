import React, { useRef, useEffect } from "react";

export default function Base64({
  currentOp,
  isDisabled,
  opInfo,
  helpers,
  setOutputBinary
}) {
  const selectVariantRef = useRef(null);
  let charsets = {
    base64: [
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      /^[A-Z\d+/]+(=+)?$/i
    ],
    base64url: [
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
      /^[A-Z\d_-]+(=+)?$/i
    ]
  };

  function validate(input, charset) {
    const inputIsNotEmpty = input.length > 0;
    const inputIsValid =
      currentOp === "encode"
        ? true
        : charset[1].test(helpers.binToChar(input).join(""));

    if (inputIsNotEmpty) {
      if (inputIsValid) {
        return true;
      } else {
        const illegalIndex = helpers
          .binToChar(input.filter(x => x !== "00111101"))
          .findIndex(x => !charset[0].includes(x));
        helpers.updateStorage({
          haltedAt: [
            ...helpers.getFromStorage("haltedAt"),
            {
              at: `${opInfo.index + 1}.${opInfo.title}: `,
              error: `Invalid character at index ${illegalIndex}`
            }
          ]
        });
        return false;
      }
    } else return false;
  }

  //encoding process in 4 steps
  function encode(input, charset) {
    //====================== REGROUP 8 BITS INTO 6 BITS ====================== //

    let reg = /[01]{6}|[01]{5}|[01]{4}|[01]{3}|[01]{2}|[01]{1}/g;
    let _6Bits = input
      .join("")
      .match(reg)
      .map(x => helpers.lengthen(x, "0", 6, "end"));

    //====================== CONVERT 6-BITS TO THEIR RESPECTIVE CHARACTER ====================== //

    let converted6Bits = _6Bits.map(x => charset[0][Number(`0b${x}`)]);

    if (selectVariantRef.current.value !== "base64url") {
      while (converted6Bits.length % 4 !== 0) converted6Bits.push("=");
    }

    return helpers.charToBin(converted6Bits);
  }

  //decoding process in 4 steps
  function decode(input, charset) {
    let unpadded = input.filter(byte => byte !== "00111101");
    let charified = helpers.binToChar(unpadded);

    //====================== GET 6-BITS THAT CORRELATE WITH EACH CHAR ====================== //

    let _6Bits = charified.map(char =>
      helpers.lengthen(charset[0].indexOf(char).toString(2), "0", 6)
    );

    //====================== GET 8-BITS TO SHOW DECODED TEXT ====================== //

    let _8bits = _6Bits.join("").match(/[01]{8}/g);
    return _8bits;
  }

  function triggerFn() {
    let inputBinary = helpers.getFromStorage("outputBins");
    const charset = charsets[selectVariantRef.current.value];
    if (validate(inputBinary, charset)) {
      helpers.updateStorage({
        outputBins:
          currentOp === "encode"
            ? encode(inputBinary, charset)
            : decode(inputBinary, charset)
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
        onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
        ref={selectVariantRef}
      >
        <option value="base64">Base64 (RFC 4648)</option>
        <option value="base64url">Base64url (RFC 4648)</option>
      </select>
    </div>
  );
}
