import React, { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function BitwiseOperation({ setService }) {
  const inputFieldRef = useRef(null);
  const outputFieldRef = useRef(null);

  function triggerFn() {}
  return (
    <>
      <Header setService={setService} />
      <main className="wrapper">
        <h1>Bitwise operation</h1>
        <textarea
          onInput={() => triggerFn()}
          id="input-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="Your text goes here..."
          ref={inputFieldRef}
        ></textarea>
        <textarea
          id="output-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="The output"
          ref={outputFieldRef}
        ></textarea>
      </main>
      <Footer />
    </>
  );
}
