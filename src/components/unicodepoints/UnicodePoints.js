import React, { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function UnicodePoints({ setService }) {
  const inputFieldRef = useRef(null);
  const outputFieldRef = useRef(null);
  const selectOpRef = useRef(null);
  const selectFormatRef = useRef(null);
  const seperatorRef = useRef(null);

  function encode(text) {
    let arr = [];
    for (let char of text) {
      arr.push(char.charCodeAt());
    }
    return arr
      .map((num) => {
        switch (selectFormatRef.current.value) {
          case "unicode": {
            return `U+${num.toString(16)}`;
            break;
          }
          case "decimal": {
            return num;
            break;
          }
          case "hexadecimal": {
            return num.toString(16);
            break;
          }
          case "octal": {
            return num.toString(8);
            break;
          }
          case "binary": {
            return num.toString(2);
            break;
          }
          case "ncr-d": {
            return `&#${num};`;
            break;
          }
          case "ncr-h": {
            return `&#x${num.toString(16)};`;
            break;
          }
        }
      })
      .join(seperatorRef.current.value);
  }

  function decode(text) {
    let splittedText = text.split(seperatorRef.current.value);
    let arr = [];
    let reg;
    switch (selectFormatRef.current.value) {
      case "unicode":
        reg = /(?<=^U\+)[\dA-F]+(?=$)/i;
        break;
      case "decimal":
        reg = /(?<=^)\d+(?=$)/;
        break;
      case "hexadecimal":
        reg = /(?<=^)[\dA-F]+(?=$)/i;
        break;
      case "binary":
        reg = /(?<=^)[0-1]+(?=$)/;
        break;
      case "octal":
        reg = /(?<=^)[0-7]+(?=$)/;
        break;
      case "ncr-d":
        reg = /(?<=(^&#))\d+(?=;$)/;
        break;
      case "ncr-h":
        reg = /(?<=(^&#x))[\dA-F]+(?=;$)/i;
        break;
    }
    splittedText.forEach((chunk) => {
      if (reg.test(chunk)) {
        let matchNum = chunk.match(reg)[0];
        switch (selectFormatRef.current.value) {
          case "decimal":
          case "ncr-d":
            arr.push(Number(matchNum).toString(16));
            break;

          case "hexadecimal":
          case "ncr-h":
          case "unicode":
            arr.push(matchNum);
            break;

          case "octal":
            arr.push(Number(`0o${matchNum}`).toString(16));
            break;

          case "binary":
            arr.push(Number(`0b${matchNum}`).toString(16));
            break;
        }
      }
    });
    return arr
      .map((num) => {
        let number = `${num}`.split("");
        while (number.length % 2 !== 0) {
          number.unshift("0");
        }
        number = number.join("");
        let numInHex = Number(`0x${num}`);
        let inUnicode = String.fromCharCode(numInHex);
        return inUnicode;
      })
      .join("");
  }

  function validate() {
    if (inputFieldRef.current.value !== "") {
      if (seperatorRef.current.value === "") {
        outputFieldRef.current.placeholder = "Seperator cannot be empty";
        outputFieldRef.current.value = "";
      } else {
        outputFieldRef.current.placeholder = "The output";
      }
    } else {
      outputFieldRef.current.placeholder = "The output";
      outputFieldRef.current.value = "";
    }

    return (
      inputFieldRef.current.value !== "" && seperatorRef.current.value !== ""
    );
  }

  function triggerFn() {
    if (validate()) {
      switch (selectOpRef.current.value) {
        case "encode": {
          outputFieldRef.current.value = encode(inputFieldRef.current.value);
          break;
        }
        case "decode": {
          outputFieldRef.current.value = decode(inputFieldRef.current.value);
          break;
        }
      }
    }
  }

  return (
    <>
      <Header setService={setService} />
      <main className="wrapper">
        <h1>Unicode code points</h1>
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
            <option value="encode">encode</option>
            <option value="decode">decode</option>
          </select>
          <select
            ref={selectFormatRef}
            title="format"
            onInput={() => triggerFn()}
          >
            <option value="unicode">Unicode notation</option>
            <option value="decimal">Decimal</option>
            <option value="hexadecimal">Hexadecimal</option>
            <option value="binary">Binary</option>
            <option value="octal">Octal</option>
            <option value="ncr-d">NCR (Decimal)</option>
            <option value="ncr-h">NCR (Hexadecimal)</option>
          </select>
          <input
            type="text"
            placeholder="Seperator"
            ref={seperatorRef}
            onInput={() => triggerFn()}
            defaultValue=" "
            title="seperator"
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
      <section className="info">
        <h3>What is Unicode?</h3>
        <p>
          Unicode, formally The Unicode Standard is an information technology
          standard for the consistent encoding, representation, and handling of
          text expressed in most of the world's writing systems.
        </p>
        <p>
          Unicode's success at unifying character sets has led to its widespread
          and predominant use in the internationalization and localization of
          computer software. The standard has been implemented in many recent
          technologies, including modern operating systems, XML, and most modern
          programming languages.{" "}
        </p>
        <a href="https://en.wikipedia.org/wiki/Unicode" target="_blank">
          read more
        </a>
      </section>
      <Footer />
    </>
  );
}
