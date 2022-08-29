import React, { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";
import Table from "./table";

export default function Rot13({ setService }) {
  const inputFieldRef = useRef(null);
  const outputFieldRef = useRef(null);
  const selectOpRef = useRef(null);
  const selectRotRef = useRef(null);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const asciiT =
    "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

  function iterator(char, charset, moveCount) {
    let maxIndex = charset.length - 1;
    let i = 0;
    let currentIndex = charset
      .split("")
      .indexOf(moveCount !== 47 ? char.toUpperCase() : char);
    while (i < moveCount) {
      i++;
      currentIndex === maxIndex ? (currentIndex = 0) : currentIndex++;
    }
    return char.toLowerCase() === char && moveCount !== 47
      ? charset[currentIndex].toLowerCase()
      : charset[currentIndex];
  }

  function convert(text) {
    let arr = [];
    for (let char of text) {
      switch (selectRotRef.current.value) {
        case "5": {
          if (/[0-9]/.test(char)) {
            arr.push(iterator(char, numbers, 5));
          } else {
            arr.push(char);
          }
          break;
        }
        case "13": {
          if (/[a-z]/i.test(char)) {
            arr.push(iterator(char, alphabet, 13));
          } else {
            arr.push(char);
          }
          break;
        }
        case "18": {
          if (/[a-z]/i.test(char)) {
            arr.push(iterator(char, alphabet, 13));
          } else if (/[0-9]/.test(char)) {
            arr.push(iterator(char, numbers, 5));
          } else {
            arr.push(char);
          }
          break;
        }
        case "47": {
          if (
            /[!"#\$%&'\(\)*+,\-\.\/0123456789:;<=>\?@ABCDEFGHIJKLMNOPQRSTUVWXYZ\[\]\^_`abcdefghijklmnopqrstuvwxyz\{\|\}~]/.test(
              char
            )
          ) {
            arr.push(iterator(char, asciiT, 47));
          } else {
            arr.push(char);
          }
          break;
        }
      }
    }
    return arr.join("");
  }

  function triggerFn() {
    outputFieldRef.current.value = convert(inputFieldRef.current.value);
  }

  return (
    <>
      <Header setService={setService} />
      <main className="wrapper caesar-wrapper">
        <h1>ROT-13</h1>
        <textarea
          id="input-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="Your text goes here..."
          ref={inputFieldRef}
          onInput={() => triggerFn()}
        ></textarea>
        <div className="selects-flex">
          <select ref={selectOpRef} onInput={() => triggerFn()}>
            <option value="convert">convert</option>
          </select>
          <select
            defaultValue="13"
            ref={selectRotRef}
            onInput={() => triggerFn()}
          >
            <option value="5">rot5(0-9)</option>
            <option value="13">rot13(A-Z,a-z)</option>
            <option value="18">rot18(A-Z,a-z,0-9)</option>
            <option value="47">rot47(!-~)</option>
          </select>
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
          <h1>What is ROT-13?</h1>
          <p>
            ROT13 ("rotate by 13 places", sometimes hyphenated ROT-13) is a
            simple letter substitution cipher that replaces a letter with the
            13th letter after it in the alphabet. ROT13 is a special case of the
            Caesar cipher which was developed in ancient Rome.
          </p>
          <p>
            Because there are 26 letters (2×13) in the basic Latin alphabet,
            ROT13 is its own inverse; that is, to undo ROT13, the same algorithm
            is applied, so the same action can be used for encoding and
            decoding. The algorithm provides virtually no cryptographic
            security, and is often cited as a canonical example of weak
            encryption
          </p>
          <a href="https://en.wikipedia.org/wiki/ROT13" target="_blank">
            read more
          </a>
        </section>
        <section className="notes">
          <h1>Notes:</h1>
          <p>
            1. In addition to ROT-13, this module also provides support for
            numeric ROT-5 (0-9), alphanumeric ROT-18 (A-Za-z0-9) and ROT-47 in
            the ASCII range of 33 - 127 (!-~)
          </p>
          <p>
            2. In ROT-18 unlike what the name might suggest, alphabetic
            characters from A-Z are rotated by 13 and numeric charcacters 0-9 by
            5
          </p>
          <p>
            3. The similarity between ROT-5,8,47 as well as ROT-13 is that they
            all have a symmetric algorithm, which means that both decryption and
            encryption follow the same procedure
          </p>
        </section>
      </section>
      <Footer />
    </>
  );
}
