import { useRef, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function Ascii85({ setService }) {
  let inputFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectOpRef = useRef(null);
  let selectVariantRef = useRef(null);
  let selectOutFormatRef = useRef(null);
  let selectInFormatRef = useRef(null);
  let [inputBinary, outputBinary] = [[], []];
  let charsets = {
    original: [
      "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstu",
      /^[\dA-Za-uz!"#$%&'()*+,\-./:;<=>?@[\\\]^_`]+$/,
    ],
    z85: [
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#",
      /^[\dA-Z.\-:+=^!/*?&<>()[\]{}@%$#]+$/i,
    ],
  };

  //the function that evaluates input before proceeding with further operations
  function validate() {
    //first off, input must not be empty
    if (inputFieldRef.current.value !== "") {
      let textArr = inputFieldRef.current.value.split("");
      let reg;
      /*assigns a certain regular expression to reg variable depending on 
      whether the view mode is binary or plaintext*/
      switch (selectInFormatRef.current.value) {
        case "binary":
          reg = /^([01]{8}( +)?)+$/;
          break;

        case "ascii":
          /*since certain characters don't exist in different variants of ascii85, 
          when decoding(assuming the input will be ascii85 encoded text) those illegal characters will be weeded out
          to avoid giving useless output to the user. In encoding part though any ascii(or unicode) character will be allowed 
          including line break*/
          reg =
            selectOpRef.current.value === "decode"
              ? charsets[selectVariantRef.current.value][1]
              : /.|\n/;
          break;
      }
      /*the authentication procedure will be different for binary and plaintext input. 
      in plaintext each single character will be evaluated but in binary the whole text on one go*/
      if (
        selectInFormatRef.current.value === "binary"
          ? reg.test(textArr.join(""))
          : textArr.every((c) => reg.test(c))
      ) {
        //if the evaluation is successful:
        outputFieldRef.current.setAttribute("placeholder", `The output`);
        return true;
      } else {
        //otherwise:
        if (
          selectInFormatRef.current.value === "binary" &&
          textArr.length < 8
        ) {
          outputFieldRef.current.setAttribute("placeholder", `The output`);
          outputFieldRef.current.value = "";
        } else {
          let illegalChar = textArr.find((x) => !reg.test(x));
          outputFieldRef.current.value = "";
          outputFieldRef.current.setAttribute(
            "placeholder",
            `Invalid character at index ${textArr.indexOf(illegalChar)}`
          );
        }
        return false;
      }
    } else {
      //if input is empty:
      outputFieldRef.current.setAttribute("placeholder", `The output`);
      outputFieldRef.current.value = "";
      return false;
    }
  }

  //if user switches the input view this function would run
  function handleInFormatSwap(value) {
    let display;
    switch (value) {
      case "binary":
        //input field will show the binary values of each input character stringed together.
        display = inputBinary.join(" ");
        break;

      case "ascii":
        /*input field will show the binary values of each input character
        converted to it's utf-8 counterpart stringed together. */
        display = inputBinary
          .map((octet) => String.fromCharCode(Number(`0b${octet}`)))
          .join("");
        break;
    }
    inputFieldRef.current.value = display;
  }

  //if user switches the output view this function would run
  function handleOutFormatSwap(value) {
    let display;
    switch (value) {
      case "binary":
        //output field will show the binary values of each output character stringed together.
        display = outputBinary.join(" ");
        break;

      case "ascii":
        /*output field will show the binary values of each output character
        converted to it's utf-8 counterpart stringed together. */
        display = outputBinary
          .map((octet) => String.fromCharCode(Number(`0b${octet}`)))
          .join("");
        break;
    }
    outputFieldRef.current.value = display;
  }

  /*this block will recieve a string as an argument and will output an array 
  containing it's 8-bit binary values*/
  function asciiToBinary(text) {
    let textArr = text.split("");
    let output = [];
    textArr.forEach((char) => {
      let bin = char.charCodeAt().toString(2);
      output.push(bin.padStart(8, "0"));
    });
    return output;
  }

  //recieves the string containing current input and outputs the array containing converted binaries
  function encode(input) {
    //will set the inputBinary variable to an array of octets based on input
    //**this variable will be used on encoding operations from now on
    switch (selectInFormatRef.current.value) {
      case "binary":
        inputBinary = input.match(/[01]{8}/g);
        break;

      case "ascii":
        inputBinary = asciiToBinary(input);
        break;
    }

    let paddedInputBinary = [...inputBinary] || [];
    let paddedBytesCount = 0;

    /*lengthens the above variable until it's length wholly divisable by 4 (4 bytes = 32 bits),
    while also adding 1 to counter on each round to keep track of how many byte were appended*/
    while (paddedInputBinary.length % 4 !== 0) {
      paddedInputBinary.push("00000000");
      paddedBytesCount++;
    }

    /*paddedInputBinary represented as shown below
    ["01010101010101010101010101010101", "10110.....", ...]*/
    let _32bitSeperated =
      paddedInputBinary.join("").match(/[01]{32}|[01]{24}|[01]{16}|[01]{8}/g) ||
      [];

    let output = _32bitSeperated.map((chunk) => {
      //the octet value in decimal format
      let inDecimal = Number(`0b${chunk}`);
      //-----------------------------------------------
      /***since output characters are retrieved from the character set array
       and not the entire ascii/utf8 table, adding 33 to the remainder of number divided by 85 is omitted*/
      let remainders = [];
      //runs while the decimal is more than or equal to 85
      while (inDecimal >= 85) {
        /*pushes a certain character in current charset at the index 
        where index is equal to remainder of (current decimal/85). */
        remainders.push(
          charsets[selectVariantRef.current.value][0][inDecimal % 85]
        );
        inDecimal = Math.floor(inDecimal / 85);
      }

      /*does the above one more time if the inDecimal variable is still not zero,
       this time without dividing by 85 (the number itself is considered remainder)*/
      if (inDecimal !== 0)
        remainders.push(charsets[selectVariantRef.current.value][0][inDecimal]);

      //----------------------------------------------
      return remainders.reverse().join("");
    });
    /*output is now an array in following structure:
    ["abcde", "fghij", ....]*/

    /* replaces the items that are empty string with "z" then joins output items together
     before splitting to an array of single characters, which gives us as shown below:
     ["abcde", ""] ===> ["a", "b", "c", "d", "e", "z"]*/
    output = output
      .map((x) => (x === "" ? "z" : x))
      .join("")
      .split("");

    //removes as many bytes from output array as there were padded from the end of encoded text
    for (let i = 0; i < paddedBytesCount; i++) output.pop();

    //converts each byte to unicode character
    outputBinary = output.map((x) => asciiToBinary(x));

    //decides which format to return the output as based on user preference.
    switch (selectOutFormatRef.current.value) {
      case "binary":
        return outputBinary.join(" ");

      case "ascii":
        return outputBinary
          .map((x) => String.fromCharCode(Number(`0b${x}`)))
          .join("");
    }
  }

  function decode(input) {
    //will set the inputBinary variable to an array of octets based on input
    //**this variable will be used on encoding operations from now on
    switch (selectInFormatRef.current.value) {
      case "binary":
        inputBinary = input.match(/[01]{8}/g);
        break;

      case "ascii":
        inputBinary = asciiToBinary(input);
        break;
    }

    let paddedInputArr = [...inputBinary] || [];
    let paddedBytesCount = 0;

    /*pads paddedInputArr with "u"(01110101) until it's length becomes divisible by 5 with a remainder of zero
    while also keeping track of how many characters with padded*/
    if (inputBinary) {
      while (paddedInputArr.length % 5 !== 0) {
        paddedInputArr.push("01110101");
        paddedBytesCount++;
      }
    }

    let _8bitsArr = paddedInputArr
      .join("")
      .match(/[01]{40}/g)
      .map((string) =>
        string.match(/[01]{8}/g).map((x) => Number(`0b${x}`) - 33)
      );

    let reverted32bitChunks = _8bitsArr.map((chunk) => {
      let counter = 5;
      let revertedChunk = chunk.map((x) => {
        counter -= 1;
        return x * 85 ** counter;
      });
      return revertedChunk.reduce((a, b) => a + b, 0);
    });

    let temp = reverted32bitChunks.map((num) => {
      let out = num.toString(2).split("");
      while (out.length % 8 !== 0) out.unshift("0");
      return out.join("").match(/[01]{8}/g);
    });

    temp.forEach((array) => {
      array.forEach((item) => {
        outputBinary.push(item);
      });
    });

    for (let i = 0; i < paddedBytesCount; i++) outputBinary.pop();
    switch (selectOutFormatRef.current.value) {
      case "binary":
        return outputBinary.join(" ");

      case "ascii":
        return outputBinary
          .map((x) => String.fromCharCode(Number(`0b${x}`)))
          .join("");
    }
  }

  function triggerFn() {
    [inputBinary, outputBinary] = [[], []];
    if (validate()) {
      switch (selectInFormatRef.current.value) {
        case "binary":
          inputBinary = inputFieldRef.current.value.match(/[01]{8}/g);
          break;

        case "ascii":
          inputBinary = asciiToBinary(inputFieldRef.current.value);
          break;
      }
      switch (selectOpRef.current.value) {
        case "encode":
          outputFieldRef.current.value = encode(inputFieldRef.current.value);
          break;
        case "decode":
          outputFieldRef.current.value = decode(inputFieldRef.current.value);
          break;
      }
    } else {
    }
  }

  return (
    <>
      <Header setService={setService} />
      <main className="wrapper">
        <h1>Ascii85</h1>
        <div className="format-select">
          <span>input format: </span>
          <select
            ref={selectInFormatRef}
            onInput={(e) => handleInFormatSwap(e.target.value)}
          >
            <option value="ascii">ASCII(8bit)</option>
            <option value="binary">binary</option>
          </select>{" "}
        </div>
        <textarea
          id="input-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="Your text goes here..."
          onInput={() => triggerFn()}
          ref={inputFieldRef}
        ></textarea>
        <div className="selects-flex">
          <select onInput={() => triggerFn()} ref={selectOpRef}>
            <option value="encode" id="encode">
              encode
            </option>
            <option value="decode" id="decode">
              decode
            </option>
          </select>
          <select onInput={() => triggerFn()} ref={selectVariantRef}>
            <option value="original">Original</option>
            <option value="z85">ZeroMQ (z85)</option>
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
        <div className="format-select">
          <span>output format:</span>{" "}
          <select
            ref={selectOutFormatRef}
            onInput={(e) => handleOutFormatSwap(e.target.value)}
          >
            <option value="ascii">ASCII(8bit)</option>
            <option value="binary">binary</option>
          </select>
        </div>
      </main>
      <section>
        <section className="info">
          <h1>What is Ascii85(Base85)?</h1>
          <p>
            Ascii85, also called Base85, is a form of binary-to-text encoding
            developed by Paul E. Rutter for the btoa utility. By using five
            ASCII characters to represent four bytes of binary data (making the
            encoded size 1/4 larger than the original, assuming eight bits per
            ASCII character), it is more efficient than uuencode or Base64,
            which use four characters to represent three bytes of data (1/3
            increase, assuming eight bits per ASCII character).
          </p>
          <p>
            Its main modern uses are in original's PostScript and Portable
            Document Format file formats, as well as in the patch encoding for
            binary files used by Git.
          </p>

          <a href="https://en.wikipedia.org/wiki/Ascii85" target="_blank">
            read more
          </a>
        </section>
      </section>
      <Footer />
    </>
  );
}

//0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~    rfc 1924
