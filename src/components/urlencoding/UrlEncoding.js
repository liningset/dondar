import React, { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function UrlEncoding({ setService }) {
  const inputFieldRef = useRef(null);
  const outputFieldRef = useRef(null);
  const selectOpRef = useRef(null);
  const selectSpaceRef = useRef(null);

  function validate() {
    switch (selectOpRef.current.value) {
      case "encode": {
        return inputFieldRef.current.value !== "";
        break;
      }
      case "decode": {
        let textArr = inputFieldRef.current.value.split("");
        let allowedCharsReg =
          selectSpaceRef.current.value === "plus"
            ? /[^!#$&'()*,/:;=?@[\]]/
            : /[^!#$&'()*,/+:;=?@[\]]/;

        if (textArr.every((char) => allowedCharsReg.test(char))) {
          outputFieldRef.current.setAttribute("placeholder", "The output");
          return true;
        } else {
          let errorChar = textArr.find((x) => !allowedCharsReg.test(x));
          outputFieldRef.current.value = "";
          outputFieldRef.current.setAttribute(
            "placeholder",
            `Invalid character at index ${textArr.indexOf(errorChar)}`
          );
        }
        break;
      }
    }
  }

  function encode(text) {
    selectSpaceRef.current.className = "";
    switch (selectSpaceRef.current.value) {
      case "plus":
        return encodeURIComponent(text)
          .replace(/[!()*']|%20/g, (x) => {
            return x === "%20"
              ? "+"
              : `%${x.charCodeAt(0).toString(16).toUpperCase()}`;
          })
          .replace(/%20/g, "+");

      case "hex":
        return encodeURIComponent(text).replace(
          /[!()*']/g,
          (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`
        );
    }
  }
  function decode(text) {
    return decodeURIComponent(text.replace(/\+/g, "%20"));
  }

  function triggerFn() {
    if (validate()) {
      outputFieldRef.current.placeholder = "The output";
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
    } else {
      outputFieldRef.current.value = "";
    }
  }

  return (
    <>
      <select
        ref={selectSpaceRef}
        onInput={() => triggerFn()}
        title="choose what to encode space characters as"
      >
        <option value="hex">encode space as %20</option>
        <option value="plus">encode space as +</option>
      </select>
      {/* <section>
        <section className="info">
          <h3>What is URL encoding?</h3>
          <p>
            Percent-encoding, also known as URL encoding, is a method to encode
            arbitrary data in a Uniform Resource Identifier (URI) using only the
            limited US-ASCII characters legal within a URI. Although it is known
            as URL encoding, it is also used more generally within the main
            Uniform Resource Identifier (URI) set, which includes both Uniform
            Resource Locator (URL) and Uniform Resource Name (URN). As such, it
            is also used in the preparation of data of the
            application/x-www-form-urlencoded media type, as is often used in
            the submission of HTML form data in HTTP requests.{" "}
          </p>
          <a
            href="https://en.wikipedia.org/wiki/Percent-encoding"
            target="_blank"
          >
            read more
          </a>
        </section>
        <section></section>
      </section> */}
    </>
  );
}
