import React, { useEffect, useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function A1Z26({
  currentOp,
  helpers,
  opInfo,
  setOutputBinary,
  setHaltedAt,
  outputField,
}) {
  const seperatorInputRef = useRef(null);
  const alphabete = "abcdefghijklmnopqrstuvwxyz";

  function encode(text) {
    let indexes = [];
    for (let char of text) {
      if (alphabete.includes(char.toLowerCase())) {
        indexes.push(alphabete.indexOf(char.toLowerCase()) + 1);
      }
    }
    return indexes.join(seperatorInputRef.current.value).split("");
  }
  function decode(text) {
    let sanitizedText = text.replace(/(^[^\d]+)|([^\d]+$)/g, "");
    let matches = sanitizedText.split(seperatorInputRef.current.value);

    let convertedArr = matches.map((item) => alphabete[item - 1]);

    return convertedArr.join("").split("");
  }

  function triggerFn() {
    if (seperatorInputRef.current.validity.valid) {
      //outputField.setAttribute("placeholder", "The output");
      let inputBinary = helpers.getFromStorage("outputBins");
      let result;
      switch (currentOp) {
        case "encode":
          result = encode(helpers.binToChar(inputBinary).join(""));
          break;

        case "decode":
          result = decode(helpers.binToChar(inputBinary).join(""));
          break;
      }
      helpers.updateStorage({
        outputBins: helpers.charToBin(result),
      });
    } else {
      helpers.updateStorage({
        haltedAt: [
          ...helpers.getFromStorage("haltedAt"),
          {
            at: `${opInfo.index + 1}.${opInfo.title}: `,
            error: "seperator cannot be empty",
          },
        ],
      });
    }
  }

  useEffect(() => {
    triggerFn();
  });
  return (
    <div className="div">
      <span>Seperator</span>
      <input
        type="text"
        ref={seperatorInputRef}
        placeholder="Seperator"
        pattern=".+"
        onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
        defaultValue="/"
        title="seperator"
        required
      />
      {/* <section>
        <section className="info">
          <h1>What is A1Z26?</h1>
          <p>
            A1Z26 as it's name suggests, is a simple cipher that converts each
            alphabetic character of plaintext to the number that represents it
            in alphabete(from 1 to 26). a plaintext like <code>"hello"</code>{" "}
            with a seperator of <code>"/"</code> would result to{" "}
            <code>"8/5/12/12/15"</code>.
          </p>
        </section>
        <section className="notes">
          <h1>Notes:</h1>
          <p>1. Make sure to always include seperator.</p>
          <p>
            2. Any non-alphabetic characters in plaintext will be excluded in
            ciphertext as well as any character outside of value-seperation
            boundary in ciphertext.
          </p>
        </section>
      </section> */}
    </div>
  );
}
