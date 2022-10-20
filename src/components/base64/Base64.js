import { React, useRef, useState } from "react";
import tablesModule from "./tables.js";
import binConvert from "./binary-converter.js";
import Header from "../Header";
import Footer from "../Footer";

export default function Base64({ setService }) {
  const inputFieldRef = useRef(null);
  const outputField = useRef(null);
  const selectVariantRef = useRef(null);
  const selectOpRef = useRef(null);
  const asciiT = tablesModule.ASCII;
  let selectOutFormatRef = useRef(null);
  let selectInFormatRef = useRef(null);
  let [outputBinary, setOutputBinary] = useState("");
  let [inputBinary, setInputBinary] = useState("");

  let charSets = {
    base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    base64url:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  };

  function validate() {
    if (inputFieldRef.current.value !== "") {
      switch (selectInFormatRef.current.value) {
        case "binary":
          return /^([0-1]{8}( +)?)+$/.test(inputFieldRef.current.value);

        case "ascii":
          if (selectOpRef.current.value === "decode") {
            return new RegExp(
              `^[a-z\d${
                selectVariantRef.current.value === "base64" ? "\\+\\/" : "-_"
              }]$`
            ).test(inputFieldRef.current.value);
          } else return true;
      }
    }
  }

  //encoding process in 4 steps
  function encode(text) {
    const step1 = asciiLookup(text, "toencode");
    const step2 = regroupBits(step1, "8to6bit");
    const step3 = base64Lookup(step2, "tobase64");
    const step4 = handlePadding(step3, "add");

    outputField.current.setAttribute("placeholder", "The output");
    return step4;
  }

  //decoding process in 4 steps
  function decode(text) {
    let reg = new RegExp(
      `[^A-Za-z0-9${
        selectVariantRef.current.value === "base64" ? "\\+\\/=" : "\\-_"
      }]`
    );
    if (reg.test(text)) {
      let match = text.match(reg);
      outputField.current.setAttribute(
        "placeholder",
        `Invalid character at index ${match.index}`
      );

      return "";
    } else {
      outputField.current.setAttribute("placeholder", "The output");
      const step1 = handlePadding(inputFieldRef.current.value, "remove");
      const step2 = base64Lookup(step1, "frombase64");
      const step3 = regroupBits(step2, "6to8bit");
      const step4 = asciiLookup(step3, "todecode");

      return step4;
    }
  }

  //a boilerplate-esque function to help prevent code repetition in certain areas
  function tableCheck(table, type, currentChar, array, valueToReturn) {
    if (table === "base64T") {
      charSets[selectVariantRef.current.value].split("").forEach((char, i) => {
        let symbol = char;
        let binaryValue = binConvert(i, 6, "toBin");
        switch (valueToReturn) {
          case "binary":
            if (symbol === currentChar) array.push(binaryValue);
            break;
          case "symbol":
            if (currentChar === binaryValue) array.push(symbol);
            break;
        }
      });
    } else {
      table.forEach((cell) => {
        const binaryValue = type === "ascii" ? cell[1] : cell[0];
        const symbol = type === "ascii" ? cell[2] : cell[1];

        switch (valueToReturn) {
          case "binary":
            if (symbol === currentChar) array.push(binaryValue);
            break;
          case "symbol":
            if (currentChar === binaryValue) array.push(symbol);
            break;
        }
      });
    }
  }

  //works with extended ascii character table depending on type parameter
  function asciiLookup(input, type) {
    if (type === "toencode") {
      const arr = [];
      const text = input;
      for (let char of text) {
        tableCheck(asciiT, "ascii", char, arr, "binary");
      }
      return arr.join("");
    } else if (type === "todecode") {
      let arr = [];
      let bytes = input;
      if (bytes != null) {
        bytes.forEach((byte) => {
          tableCheck(asciiT, "ascii", byte, arr, "symbol");
        });
      }
      return arr.join("");
    }
  }

  //recieves a binary string and returns an array of either 6bits or 8bits grouped together based on type parameter
  function regroupBits(input, type) {
    switch (type) {
      case "8to6bit": {
        let eightBitsArr = input.split("");
        let sixBitsArr = input.match(/\d{6}/g);
        let sixBitsArr2 = sixBitsArr.join("").split(""); //array of individualized values
        let remainingBits = eightBitsArr
          .filter((char, index) => sixBitsArr2[index] == null)
          .join("");
        (function extendbin() {
          if (remainingBits.length !== 0) {
            while (remainingBits.length !== 6) {
              remainingBits = remainingBits.concat("0");
            }
          }
        })();

        return [...sixBitsArr, remainingBits]; //remaining bits are stretched to six bits
        break;
      }
      case "6to8bit": {
        let eightbits = input.match(/\d{8}/g);
        return eightbits;
        break;
      }
    }
  }

  //adds or removes padding (equal signs) based on type parameter
  function handlePadding(text, type) {
    switch (type) {
      case "add": {
        if (
          text.length % 4 !== 0 &&
          selectVariantRef.current.value === "base64"
        ) {
          let textArr = text.split("");
          while (textArr.length % 4 !== 0) {
            textArr.push("=");
          }
          return textArr.join("");
        } else return text;
        break;
      }
      case "remove": {
        if (text.includes("=")) {
          let textArr = text.split("");
          return textArr.filter((c) => c !== "=").join("");
        } else return text;
        break;
      }
    }
  }

  //works with base64 character table depending on type parameter
  function base64Lookup(input, type) {
    let arr = [];
    switch (type) {
      case "tobase64": {
        let bins = input;
        bins.forEach((bin) => {
          tableCheck("base64T", "base64", bin, arr, "symbol");
        });
        break;
      }
      case "frombase64": {
        let text = input;
        let textArr = text.split("");
        textArr.forEach((char) => {
          tableCheck("base64T", "base64", char, arr, "binary");
        });
        break;
      }
    }

    return arr.join("");
  }

  function triggerFn() {
    if (inputFieldRef.current.value != "") {
      selectOpRef.current.value === "encode"
        ? (outputField.current.value = encode(inputFieldRef.current.value))
        : (outputField.current.value = decode(inputFieldRef.current.value));
    } else {
      outputField.current.setAttribute("placeholder", "The output");
      outputField.current.value = "";
    }
  }
  return (
    <>
      <select onInput={() => triggerFn()} ref={selectVariantRef}>
        <option value="base64">Base64 (RFC 4648)</option>
        <option value="base64url">Base64url (RFC 4648)</option>
      </select>
      {/* <section>
        <section className="info">
          <h1>What is Base64?</h1>
          <p>
            In computer programming, Base64 is a group of binary-to-text
            encoding schemes that represent binary data (more specifically, a
            sequence of 8-bit bytes) in sequences of 24 bits that can be
            represented by four 6-bit Base64 digits.
          </p>
          <p>
            Common to all binary-to-text encoding schemes, Base64 is designed to
            carry data stored in binary formats across channels that only
            reliably support text content. Base64 is particularly prevalent on
            the World Wide Web[1] where one of its uses is the ability to embed
            image files or other binary assets inside textual assets such as
            HTML and CSS files
          </p>
          <p>
            Base64 is also widely used for sending e-mail attachments. This is
            required because SMTP – in its original form – was designed to
            transport 7-bit ASCII characters only. This encoding causes an
            overhead of 33–37% (33% by the encoding itself; up to 4% more by the
            inserted line breaks).
          </p>

          <a href="https://en.wikipedia.org/wiki/Base64" target="_blank">
            read more
          </a>
        </section>
      </section> */}
    </>
  );
}
