import { useRef } from "react";
import ASCIItable from "./table"; //ascii (extended) character table
import binConvert from "./binary-converter"; //converts to and from binary
import Header from "../Header";
import Footer from "../Footer";

export default function Base32({ setService }) {
  let inputFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectOpRef = useRef(null);
  let selectVariantRef = useRef(null);
  let asciiT = ASCIItable.ASCII;

  //four character sets for different variants of base32
  const charSets = {
    base32: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    crockford: "0123456789ABCDEFGHJKMNPQRSTVWXYZ",
    base32hex: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
    zbase32: "ybndrfg8ejkmcpqxot1uwisza345h769",
  };

  /*1. the first argument recieves the text to be encoded/decoded 
    2. the second argument recieves the option of whether to look for binaries in ascii table
    or base32 table
    3.the third argument recieves the character set to work with if the 2nd argument is "base32T"*/
  function getBinaryValues(text, type, set) {
    let binaryValue = [];
    let charset = set.split("");
    switch (type) {
      case "asciiT": {
        for (let char of text) {
          asciiT.forEach((c, i) => {
            if (c[2] === char) binaryValue.push(c[1]);
          });
        }
        break;
      }
      case "base32T": {
        for (let char of text) {
          binaryValue.push(binConvert(charset.indexOf(char), 5, "toBin"));
        }
        break;
      }
    }
    return binaryValue;
  }

  //----------------------------------------------------------------------------------

  /*
   1.the first argument gets an array of either 5 or 8 bit strings each representing 
   certain binary data. (basically the array outputted by previous function)
   2.the second argument determines which course of action to 
  take with the given array (regroup from 8bits to 5bits or 5bits to 8bits)
  3.the function returns the regrouped bits in an array*/
  function regroup(arrayInput, type) {
    switch (type) {
      case "to5bit": {
        let regex = /\d{5}|\d{4}|\d{3}|\d{2}|\d{1}/g;
        let regroupedBits = arrayInput.join("").match(regex);

        regroupedBits.forEach((group, index) => {
          let gp = group.split("");
          if (gp.length < 5) {
            while (gp.length !== 5) {
              gp.push("0");
            }
            regroupedBits.splice(index, 1, gp.join(""));
          }
        });
        return regroupedBits;

        break;
      }
      case "to8bit": {
        let regex = /\d{8}|\d{7}|\d{6}|\d{5}|\d{4}\d{3}|\d{2}|\d{1}/g;
        let regroupedBits = arrayInput.join("").match(regex);

        regroupedBits.forEach((group, index) => {
          let gp = group.split("");
          if (gp.length < 8) {
            while (gp.length !== 8) {
              gp.push("0");
            }
            regroupedBits.splice(index, 1, gp.join(""));
          }
        });
        regroupedBits = regroupedBits.filter((byte) => !/0{8}/g.test(byte));
        return regroupedBits;
        break;
      }
    }
  }

  //----------------------------------------------------------------------------------

  /*1. the first argument recieves the array of binaries outputted by regroup() 
    2. the second argument recieves the option of whether to convert to base32 or plaintext
    3.the third argument recieves the character set to generate the base32 table with*/
  function convert(arrayInput, type, set) {
    let textToReturn = [];
    let charset = set.split("");
    switch (type) {
      case "toBase32": {
        arrayInput.forEach((group) => {
          textToReturn.push(charset[binConvert(group, "", "toDec")]);
        });
        if (
          textToReturn.length % 8 !== 0 &&
          !["crockford", "zbase32"].includes(selectVariantRef.current.value)
        ) {
          while (textToReturn.length % 8 !== 0) {
            textToReturn.push("=");
          }
        }
        break;
      }
      case "toPlainText": {
        arrayInput.forEach((group) => {
          asciiT.forEach((cell) => {
            if (cell[1] === group) textToReturn.push(cell[2]);
          });
        });

        break;
      }
    }

    return textToReturn.join("");
  }

  //----------------------------------------------------------------------------------

  /*displays an error message as placeholder in outputfield.
  it is displayed in decode mode when the input text contains characters 
  that are non-present in it's charset
  (e.g WXYZ in base32hex or I in crockford)*/
  function displayError(bool, index = null) {
    if (bool) {
      outputFieldRef.current.dataset.error = "true";
      outputFieldRef.current.placeholder = `Invalid character at index ${index}`;
    } else {
      outputFieldRef.current.dataset.error = "false";
      outputFieldRef.current.placeholder = `The output`;
    }
  }

  //-----------------------------------------------------------------------------

  /*executes all mentioned previous steps by:
  1.calling getBinaryValues() to get the array of 8bit binaries
  2.passing that array as an argument to regroup() to get the array 5bit binaries
  3.passing that array to convert()
  4.displaying the encoded text*/
  function encode(charset) {
    displayError(false);
    let text = inputFieldRef.current.value;
    outputFieldRef.current.dataset.error = "false";

    return convert(
      regroup(getBinaryValues(text, "asciiT", charset), "to5bit"),
      "toBase32",
      charset
    );
  }

  //-----------------------------------------------------------------------------

  /*
  0.checks for errors if not found proceeds to:
  1.call getBinaryValues() to get the array of 5bit binaries
  2.pass that array as an argument to regroup() to get the array 8bit binaries
  3.pass that array to convert()
  4.display the decoded text*/
  function decode(charset) {
    /*let text =
      selectVariantRef.current.value === "zbase32"
        ? inputFieldRef.current.value.toLowerCase("")
        : inputFieldRef.current.value.toUpperCase("");*/
    let text = inputFieldRef.current.value;
    let textArr = text.split("");
    let filteredTextArr = textArr.filter((c) => c !== "=");
    let errorStats = { isactive: false, index: null };

    filteredTextArr.forEach((char, i) => {
      if (errorStats.isactive) return;
      if (!charset.includes(char)) {
        errorStats = { isactive: true, index: i };
      }
    });
    if (errorStats.isactive) {
      displayError(true, errorStats.index);
      return "";
    } else {
      displayError(false);
      return convert(
        regroup(getBinaryValues(text, "base32T", charset), "to8bit"),
        "toPlainText",
        charset
      );
    }
  }

  //-----------------------------------------------------------------------------

  /*the function that sets the whole program in motion.
   it gets triggered when interacting with the input fields(textarea {only input area}, select)*/
  function triggerFn() {
    if (inputFieldRef.current.value != "") {
      selectOpRef.current.value === "encode"
        ? (outputFieldRef.current.value = encode(
            charSets[selectVariantRef.current.value]
          ))
        : (outputFieldRef.current.value = decode(
            charSets[selectVariantRef.current.value]
          ));
    } else outputFieldRef.current.value = "";
  }
  return (
    <>
      <select ref={selectVariantRef} onInput={() => triggerFn()}>
        <option value="base32">Base32 (RFC 4648)</option>
        <option value="crockford">Crockford's base32</option>
        <option value="base32hex">Base32Hex (RFC 4648)</option>
        <option value="zbase32">Z-base32</option>
      </select>
      {/* <section>
        <section className="info">
          <h1>What is Base32?</h1>
          <p>
            In computer programming, Base32 is a group of binary-to-text
            encoding schemes that represent binary data (more specifically, a
            sequence of 8-bit bytes) in sequences of 40 bits that can be
            represented by eight 5-bit Base32 digits.
          </p>
          <p>
            Base32 uses a set of 32 digits, each of which can be represented by
            5 bits. One way to represent Base32 numbers in a human-readable way
            is by using a standard 32-character set, such as the twenty-two
            upper-case letters A-V and the digits 0-9. However, many other
            variations are used in different contexts.
          </p>

          <a href="https://en.wikipedia.org/wiki/Base32" target="_blank">
            read more
          </a>
        </section>
        <section className="notes">
          <h1>Notes:</h1>
          <p>
            1. Base32 is case-sensitive. in 3 first variants(original,
            crockford, base32hex) the characters of encoded data are all
            uppercase unlike z-base-32 which requires all text be in lowercase.
            So bear that in mind.
          </p>
        </section>
      </section> */}
    </>
  );
}
