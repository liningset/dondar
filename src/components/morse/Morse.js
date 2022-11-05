import { useEffect, useRef } from "react";
import morseTable from "./morse-table";
import Header from "../Header";
import Footer from "../Footer";

export default function Morse({
  currentOp,
  opInfo,
  helpers,
  setOutputBinary,
  setDescryption,
}) {
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

  function encode(input) {
    return convert(input, "encode");
  }

  function decode(input) {
    return convert(input.split(" "), "decode");
  }

  function triggerFn() {
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
      outputBins: helpers.charToBin(result.split("")),
    });
  }

  useEffect(() => triggerFn());

  return (
    <>
      <span>No advanced options</span>
      {/* <section>
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
      </section> */}
    </>
  );
}
