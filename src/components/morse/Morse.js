import { useRef } from "react";
import morseTable from "./morse-table";
import Header from "../Header";
import Footer from "../Footer";

export default function Morse({ setService }) {
  let inputFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectRef = useRef(null);

  function convert(userInput, typeOfOperation) {
    if (userInput !== "") {
      const arr = [];

      switch (typeOfOperation) {
        case "encode": {
          for (let char of userInput) {
            morseTable.forEach((cell) => {
              let letter = cell[0];
              let symbol = cell[1];
              if (char.toUpperCase() === letter) arr.push(symbol);
            });
          }
          break;
        }
        case "decode": {
          userInput.forEach((char) => {
            morseTable.forEach((cell) => {
              let letter = cell[0];
              let symbol = cell[1];
              if (char === symbol) arr.push(letter);
            });
          });
          break;
        }
      }

      return typeOfOperation === "encode" ? arr.join(" ") : arr.join("");
    } else return userInput;
  }

  function encode() {
    return convert(inputFieldRef.current.value, "encode");
  }

  function decode() {
    return convert(inputFieldRef.current.value.split(" "), "decode");
  }

  function triggerFn() {
    if (selectRef.current.value === "encode")
      outputFieldRef.current.value = encode();
    else if (selectRef.current.value === "decode")
      outputFieldRef.current.value = decode();
  }

  return (
    <>
      <Header setService={setService} />
      <main className="wrapper morse-wrapper">
        <h1>Morse code</h1>
        <textarea
          id="input-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="Your text goes here..."
          ref={inputFieldRef}
          onInput={() => triggerFn()}
        ></textarea>
        <select ref={selectRef} onInput={() => triggerFn()}>
          <option value="encode" id="encode">
            encode
          </option>
          <option value="decode" id="decode">
            decode
          </option>
        </select>
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
          <h1>What is Morse Code?</h1>
          <p>
            Morse code is a method used in telecommunication to encode text
            characters as standardized sequences of two different signal
            durations, called dots and dashes, or dits and dahs. Morse code is
            named after Samuel Morse, one of the inventors of the telegraph.
          </p>
          <a href="https://en.wikipedia.org/wiki/Morse_code" target="_blank">
            read more
          </a>
        </section>
        <section className="notes">
          <h1>Notes:</h1>
          <p>none</p>
        </section>
      </section>
      <Footer />
    </>
  );
}
