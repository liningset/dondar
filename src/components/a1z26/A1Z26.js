import React, { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function A1Z26({ setService }) {
  const inputFieldRef = useRef(null);
  const outputFieldRef = useRef(null);
  const seperatorInputRef = useRef(null);
  const selectOpRef = useRef(null);
  const alphabete = "abcdefghijklmnopqrstuvwxyz";

  function encrypt(text) {
    let indexes = [];
    for (let char of text) {
      if (alphabete.includes(char.toLowerCase())) {
        indexes.push(alphabete.indexOf(char) + 1);
      }
    }
    return indexes.join(seperatorInputRef.current.value);
  }
  function decrypt(text) {
    let sanitizedText = text.replace(/(^[^\d]+)|([^\d]+$)/g, "");
    let matches = sanitizedText.split(seperatorInputRef.current.value);

    let convertedArr = matches.map((item) => alphabete[item - 1]);

    return convertedArr.join("");
  }

  function triggerFn() {
    if (inputFieldRef.current.value !== "") {
      if (seperatorInputRef.current.validity.valid) {
        outputFieldRef.current.setAttribute("placeholder", "The output");
        selectOpRef.current.value === "encrypt"
          ? (outputFieldRef.current.value = encrypt(
              inputFieldRef.current.value
            ))
          : (outputFieldRef.current.value = decrypt(
              inputFieldRef.current.value
            ));
      } else {
        outputFieldRef.current.setAttribute(
          "placeholder",
          "seperator cannot be empty"
        );
        outputFieldRef.current.value = "";
      }
    } else {
      outputFieldRef.current.setAttribute("placeholder", "The output");
      outputFieldRef.current.value = "";
    }
  }
  return (
    <>
      <Header setService={setService} />
      <main className="wrapper">
        <h1>A1Z26</h1>
        <textarea
          onInput={() => triggerFn()}
          id="input-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="Your text goes here..."
          ref={inputFieldRef}
        ></textarea>
        <div className="selects-flex">
          <select ref={selectOpRef} onInput={() => triggerFn()}>
            <option value="encrypt">encrypt</option>
            <option value="decrypt">decrypt</option>
          </select>
          <input
            type="text"
            ref={seperatorInputRef}
            placeholder="Seperator"
            pattern=".{1,}"
            onInput={() => triggerFn()}
            required
          />
        </div>
        <textarea
          id="output-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="The output"
          ref={outputFieldRef}
        ></textarea>
      </main>
      <section>
        <section className="info">
          <h1>What is A1Z26?</h1>
          <p>
            A1Z26 as it's name suggests, is a simple cipher that works with
            positions of plaintext characters in alphabete
            array(a:1,b:2,...,z:26). a plaintext like <code>"hello"</code> with
            a seperator of <code>"/"</code> would result to{" "}
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
      </section>
      <Footer />
    </>
  );
}
