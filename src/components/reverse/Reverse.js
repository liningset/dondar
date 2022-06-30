import React, { useRef } from "react";

export default function Reverse() {
  const inputFieldRef = useRef(null);
  const outputFieldRef = useRef(null);

  function reverser() {
    let userText = inputFieldRef.current.value;
    let arr = [];
    if (userText) {
      for (let i = userText.length; i >= 0; i--) {
        arr.push(userText[i]);
      }
    } else arr = [];

    outputFieldRef.current.value = arr.join("");
  }
  return (
    <main className="wrapper">
      <h1>reverse text</h1>
      <textarea
        onInput={() => reverser()}
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
  );
}
