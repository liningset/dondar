import React, { useEffect, useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function UrlEncoding({
  currentOp,
  opInfo,
  helpers,
  setOutputBinary,
  setDescryption,
}) {
  const selectSpaceRef = useRef(null);

  function validate(input) {
    switch (currentOp) {
      case "encode": {
        return input.length !== 0;
      }
      case "decode": {
        let textArr = helpers.binToChar(input);
        let allowedCharsReg =
          selectSpaceRef.current.value === "plus"
            ? /[^!#$&'()*,/:;=?@[\]]/
            : /[^!#$&'()*,/+:;=?@[\]]/;

        if (textArr.every((char) => allowedCharsReg.test(char))) {
          return true;
        } else {
          let errorChar = textArr.find((x) => !allowedCharsReg.test(x));

          helpers.updateStorage({
            haltedAt: [
              ...helpers.getFromStorage("haltedAt"),
              {
                at: `${opInfo.index + 1}.${opInfo.title}: `,
                error: `Invalid character at index ${textArr.indexOf(
                  errorChar
                )}`,
              },
            ],
          });
          return false;
        }
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
    let inputBinary = helpers.getFromStorage("outputBins");
    if (validate(inputBinary)) {
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
  }

  useEffect(() => triggerFn());

  return (
    <div className="div">
      <span>Variant</span>
      <select
        ref={selectSpaceRef}
        onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
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
    </div>
  );
}
