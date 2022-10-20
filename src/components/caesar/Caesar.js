import React, { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function Caesar({ currentOp, setService }) {
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
    //outputFieldRef.current.value = arr.join("");
    console.log(arr.join(""));
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
    //outputFieldRef.current.value = arr.join("");
    console.log(arr.join(""));
  }

  function triggerFn() {
    if (shiftInputRef.current.validity.valid) {
      rangeRef.current.innerText = `a → ${iterator(
        "a",
        Math.abs(shiftInputRef.current.value),
        shiftInputRef.current.value > 0 ? "forwards" : "backwards"
      )}`;

      if (currentOp === "encode") {
        encrypt("joqvuGjfmeSfg.dvssfou.wbmvf", shiftInputRef.current.value);
      } else if (currentOp === "decode") {
        decrypt("joqvuGjfmeSfg.dvssfou.wbmvf", shiftInputRef.current.value);
      }

      outputFieldRef.current.setAttribute("placeholder", "The output");
    } else {
      rangeRef.current.innerText = "a → ?";
      // outputFieldRef.current.value = "";
      // outputFieldRef.current.setAttribute(
      //   "placeholder",
      //   "1. shift value cannot be empty\n2. shift value has to be a number\n3. shift value can be no more than 7 digits long"
      // );
    }
  }

  return (
    <>
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
    </>
  );
}
