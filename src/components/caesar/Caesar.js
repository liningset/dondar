import React, { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function Caesar({ setService }) {
  let inputFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectMethodRef = useRef(null);
  let subtractionRef = useRef(null);
  let additionRef = useRef(null);
  let shiftInputRef = useRef(null);
  let rangeRef = useRef(null);
  let alphabete = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function iterator(char, moveCount, direction) {
    let i = 0;
    let currentIndex = alphabete.split("").indexOf(char.toUpperCase());
    switch (direction) {
      case "forwards":
        while (i < moveCount) {
          i++;
          currentIndex === 25 ? (currentIndex = 0) : currentIndex++;
        }
        break;

      case "backwards":
        while (i < moveCount) {
          i++;
          currentIndex === 0 ? (currentIndex = 25) : currentIndex--;
        }
    }

    return char.toLowerCase() === char
      ? alphabete[currentIndex].toLowerCase()
      : alphabete[currentIndex];
  }

  function encrypt(text, shiftNum) {
    let arr = [];
    for (let char of text) {
      if (!alphabete.includes(char.toUpperCase())) {
        arr.push(char);
      } else {
        if (shiftNum < 0) {
          arr.push(iterator(char, Math.abs(shiftNum), "backwards"));
        } else {
          arr.push(iterator(char, Math.abs(shiftNum), "forwards"));
        }
      }
    }
    outputFieldRef.current.value = arr.join("");
  }

  function decrypt(text, shiftNum) {
    let arr = [];
    for (let char of text) {
      if (!alphabete.includes(char.toUpperCase())) {
        arr.push(char);
      } else {
        if (shiftNum < 0) {
          arr.push(iterator(char, Math.abs(shiftNum), "forwards"));
        } else {
          arr.push(iterator(char, Math.abs(shiftNum), "backwards"));
        }
      }
    }
    outputFieldRef.current.value = arr.join("");
  }

  function triggerFn() {
    if (shiftInputRef.current.validity.valid) {
      rangeRef.current.innerText = `a → ${iterator(
        "a",
        Math.abs(shiftInputRef.current.value),
        shiftInputRef.current.value > 0 ? "forwards" : "backwards"
      )}`;

      if (selectMethodRef.current.value === "encrypt") {
        encrypt(inputFieldRef.current.value, shiftInputRef.current.value);
      } else if (selectMethodRef.current.value === "decrypt") {
        decrypt(inputFieldRef.current.value, shiftInputRef.current.value);
      }

      outputFieldRef.current.setAttribute("placeholder", "The output");
    } else {
      rangeRef.current.innerText = "a → ?";
      outputFieldRef.current.value = "";
      outputFieldRef.current.setAttribute(
        "placeholder",
        "1. shift value cannot be empty\n2. shift value has to be a number\n3. shift value can be no more than 7 digits long"
      );
    }
  }

  return (
    <>
      <Header setService={setService} />
      <main className="wrapper caesar-wrapper">
        <h1>Caesar Cipher</h1>
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
          <select ref={selectMethodRef} onInput={() => triggerFn()}>
            <option value="encrypt" id="encrypt">
              encrypt
            </option>
            <option value="decrypt" id="decrypt">
              decrypt
            </option>
          </select>
          <div className="shift-input-container">
            <button
              className="subtract"
              ref={subtractionRef}
              onClick={() => {
                if (shiftInputRef.current.value === "")
                  shiftInputRef.current.value = "0";
                if (shiftInputRef.current.validity.valid) {
                  shiftInputRef.current.value--;
                }
                triggerFn();
              }}
            >
              -
            </button>
            <div className="div">
              <span ref={rangeRef}>a → a</span>
              <input
                type="text"
                pattern="-?[0-9]{1,7}|0+"
                ref={shiftInputRef}
                onInput={() => {
                  triggerFn();
                }}
                defaultValue="0"
                placeholder="shift by"
                required
              />
            </div>
            <button
              className="add"
              ref={additionRef}
              onClick={() => {
                if (shiftInputRef.current.value === "")
                  shiftInputRef.current.value = "0";
                if (shiftInputRef.current.validity.valid) {
                  shiftInputRef.current.value++;
                }
                triggerFn();
              }}
            >
              +
            </button>
          </div>
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
          <h1>What is Caesar Cipher?</h1>
          <p>
            In cryptography, a Caesar cipher, also known as Caesar's cipher, the
            shift cipher, Caesar's code or Caesar shift, is one of the simplest
            and most widely known encryption techniques. It is a type of
            substitution cipher in which each letter in the plaintext is
            replaced by a letter some fixed number of positions down the
            alphabet. For example, with a left shift of 3, D would be replaced
            by A, E would become B, and so on. The method is named after Julius
            Caesar, who used it in his private correspondence.
          </p>
          <p>
            The encryption step performed by a Caesar cipher is often
            incorporated as part of more complex schemes, such as the Vigenère
            cipher, and still has modern application in the ROT13 system. As
            with all single-alphabet substitution ciphers, the Caesar cipher is
            easily broken and in modern practice offers essentially no
            communications security.{" "}
          </p>
          <a href="https://en.wikipedia.org/wiki/Caesar_cipher" target="_blank">
            read more
          </a>
        </section>
        <section className="notes">
          <h1>Notes:</h1>
          <p>
            1. Although you can enter a number as huge as seven digits for shift
            value, using any number higher than ±26 is practically no different
            than numbers between ±26, beacuse the range repeats itself modularly
          </p>
        </section>
      </section>
      <Footer />
    </>
  );
}
