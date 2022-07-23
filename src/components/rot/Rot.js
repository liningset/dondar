import React, { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function Rot({ setService }) {
  let inputFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectMethodRef = useRef(null);
  let selectRotRef = useRef(null);
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

  function encrypt(text, rotNum) {
    let arr = [];
    for (let char of text) {
      if (!alphabete.includes(char.toUpperCase())) {
        arr.push(char);
      } else {
        arr.push(iterator(char, rotNum, "forwards"));
      }
    }
    outputFieldRef.current.value = arr.join("");
  }

  function decrypt(text, rotNum) {
    let arr = [];
    for (let char of text) {
      if (!alphabete.includes(char.toUpperCase())) {
        arr.push(char);
      } else {
        arr.push(iterator(char, rotNum, "backwards"));
      }
    }
    outputFieldRef.current.value = arr.join("");
  }

  function triggerFn() {
    if (selectMethodRef.current.value === "encrypt") {
      encrypt(inputFieldRef.current.value, selectRotRef.current.value);
    } else if (selectMethodRef.current.value === "decrypt") {
      decrypt(inputFieldRef.current.value, selectRotRef.current.value);
    }
  }

  return (
    <>
      <Header setService={setService} />
      <main className="wrapper">
        <h1>ROT 1-25</h1>
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
          <select
            defaultValue="13"
            ref={selectRotRef}
            onInput={() => triggerFn()}
          >
            <option value="1">rot 1</option>
            <option value="2">rot 2</option>
            <option value="3">rot 3</option>
            <option value="4">rot 4</option>
            <option value="5">rot 5</option>
            <option value="6">rot 6</option>
            <option value="7">rot 7</option>
            <option value="8">rot 8</option>
            <option value="9">rot 9</option>
            <option value="10">rot 10</option>
            <option value="11">rot 11</option>
            <option value="12">rot 12</option>
            <option value="13">rot 13</option>
            <option value="14">rot 14</option>
            <option value="15">rot 15</option>
            <option value="16">rot 16</option>
            <option value="17">rot 17</option>
            <option value="18">rot 18</option>
            <option value="19">rot 19</option>
            <option value="20">rot 20</option>
            <option value="21">rot 21</option>
            <option value="22">rot 22</option>
            <option value="23">rot 23</option>
            <option value="24">rot 24</option>
            <option value="25">rot 25</option>
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
      <Footer />
    </>
  );
}
