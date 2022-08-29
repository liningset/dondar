import { useRef, useState } from "react";
import tablesModule from "./tables";
import binConvert from "./binary-converter";
import Header from "../Header";
import Footer from "../Footer";

export default function Ascii85({ setService }) {
  let inputFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectOpRef = useRef(null);
  let selectOutFormatRef = useRef(null);
  let selectInFormatRef = useRef(null);
  let asciiT = tablesModule.ASCII;
  let [outputBinary, setOutputBinary] = useState("");
  let [inputBinary, setInputBinary] = useState("");

  let charsets = {
    z85: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#",
  };

  /*returns a binary string if type is "getNum" or a character string if type is "getChar"*/
  function getAscii(input, type) {
    let value;
    if (type === "getNum") {
      asciiT.forEach((c) => {
        if (c[2] === input) value = c[1];
      });
    } else if (type === "getChar") {
      asciiT.forEach((c) => {
        if (c[1] === binConvert(input, 8, "toBin")) value = c[2];
      });
    }
    return value;
  }

  /*recieves an array of 32 bit binary numbers
  returns an array of arrays containing 8bit binary numbers("z" if the item is 0)*/
  function calculateNumbers(numbers) {
    let allRemainderArrs = [];
    numbers.forEach((number) => {
      console.log(number);
      if (Number(`0b${number}`) === 0) {
        allRemainderArrs.push("z");
      } else {
        let num = Number(`0b${number}`);
        let remainderArr = [];
        while (num > 85) {
          remainderArr.push(Math.floor((num % 85) + 33));
          num /= 85;
        }
        if (num !== 0) remainderArr.push(Math.floor(num + 33));
        allRemainderArrs.push(remainderArr.reverse());
      }
    });

    return allRemainderArrs.map((arr) =>
      arr === "z" ? "z" : arr.map((n) => binConvert(n, 8, "toBin"))
    );
  }

  /*recieves an array of arrays containing 8bit binary numbers 
  (the output from calculateNumbers())*/
  function convertToAscii(arrays, paddedLength) {
    let arr = [];
    arrays.forEach((array) => {
      console.log(arrays);
      if (array === "z") {
        arr.push("z");
      } else {
        array.forEach((i) => {
          let numberAscii = getAscii(Number(`0b${i}`), "getChar");
          arr.push(numberAscii);
        });
      }
    });
    console.log(arr);
    if (paddedLength !== "0") {
      arr.splice(arr.length - paddedLength, arr.length);
    }

    return arr.join("");
  }

  function handleOutputFormat(
    grouped32bitBinaries,
    textBinaries,
    format,
    asciiCallback
  ) {
    let output = calculateNumbers(grouped32bitBinaries).map((arr) =>
      arr === "z" ? "00000000000000000000000000000000" : arr.join("")
    );
    console.log(output);
    output = output.join("").match(/[01]{8}/g);

    output.splice(
      output.length -
        (textBinaries.join("").match(/0{8}/g) == null
          ? "0"
          : textBinaries.join("").match(/0{8}/g).length),
      output.length
    );

    setOutputBinary(output);
    switch (format) {
      case "ascii": {
        return asciiCallback();
        break;
      }
      case "binaryraw": {
        return outputBinary.join("");
        break;
      }
      case "binaryspaced": {
        return outputBinary.join(" ");
        break;
      }
    }
  }

  function convertInputFormat() {
    if (inputFieldRef.current.value !== "") {
      switch (selectInFormatRef.current.value) {
        case "binaryin": {
          let arr = [];
          for (let char of inputFieldRef.current.value) {
            asciiT.forEach((c) => {
              if (char === c[2]) arr.push(c[1]);
            });
          }
          inputFieldRef.current.value = inputBinary.join(" ");
          break;
        }
        case "asciiin": {
          let arr = [];
          inputBinary.forEach((byte) => {
            asciiT.forEach((c) => {
              if (byte === c[1]) arr.push(c[2]);
            });
          });
          inputFieldRef.current.value = arr.join("");
          break;
        }
      }
    }
  }

  function handleInputFormat(text, inputFormat, outputFormat) {
    switch (inputFormat) {
      case "binaryin": {
        if (inputFieldRef.current.validity.valid) {
          let textBinaries = text.replace(/ /g, "").match(/[01]{8}/g); //[0]{32}|[01]{8}/g
          let paddedTextBinaries = [...textBinaries];

          console.log(textBinaries);
          setInputBinary(textBinaries);

          if (paddedTextBinaries.length % 4 !== 0) {
            while (paddedTextBinaries.length % 4 !== 0) {
              paddedTextBinaries.push("00000000");
            }
          }
          let grouped32bitBinaries = paddedTextBinaries
            .join("")
            .match(/[01]{32}/g);

          console.log(grouped32bitBinaries);
          return handleOutputFormat(
            grouped32bitBinaries,
            textBinaries,
            outputFormat,
            () => {
              return convertToAscii(
                calculateNumbers(grouped32bitBinaries),
                String(paddedTextBinaries.length - textBinaries.length)
              );
            }
          );
        }
        break;
      }

      case "asciiin": {
        let textBinaries = [];

        text.split("").forEach((char, i) => {
          if (char === "⁠") {
            textBinaries.push(inputBinary[i]);
          } else {
            textBinaries.push(getAscii(char, "getNum"));
          }
        });

        setInputBinary(textBinaries);

        let paddedTextBinaries = [...textBinaries];
        if (paddedTextBinaries.length % 4 !== 0) {
          while (paddedTextBinaries.length % 4 !== 0) {
            paddedTextBinaries.push("00000000");
          }
        }

        let grouped32bitBinaries = paddedTextBinaries
          .join("")
          .match(/[01]{32}/g);

        return handleOutputFormat(
          grouped32bitBinaries,
          textBinaries,
          outputFormat,
          () => {
            return convertToAscii(
              calculateNumbers(grouped32bitBinaries),
              paddedTextBinaries.join("").match(/0{8}/g) == null
                ? "0"
                : paddedTextBinaries.join("").match(/0{8}/g).length
            );
          }
        );
        break;
      }
    }
  }

  function encode(text, inputFormat, outputFormat) {
    return handleInputFormat(text, inputFormat, outputFormat);
  }
  function decode(text) {}

  function triggerFn() {
    if (inputFieldRef.current.value != "") {
      selectOpRef.current.value === "encode"
        ? (outputFieldRef.current.value = encode(
            inputFieldRef.current.value,
            selectInFormatRef.current.value,
            selectOutFormatRef.current.value
          ))
        : (outputFieldRef.current.value = decode(inputFieldRef.current.value));
    } else outputFieldRef.current.value = "";
  }
  return (
    <>
      <Header setService={setService} />
      <main className="wrapper">
        <h1>Ascii85</h1>
        <div className="format-select">
          <span>input format: </span>
          <select ref={selectInFormatRef} onInput={() => convertInputFormat()}>
            <option value="asciiin">ASCII(8bit)</option>
            <option value="binaryin">binary</option>
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
        <select onInput={() => triggerFn()} ref={selectOpRef}>
          <option value="encode" id="encode">
            encode
          </option>
          <option value="decode" id="decode">
            decode
          </option>
        </select>

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
          <select ref={selectOutFormatRef} onInput={() => triggerFn()}>
            <option value="ascii">ASCII(8bit)</option>
            <option value="binaryraw">binary(raw)</option>
            <option value="binaryspaced">binary(spaced out)</option>
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
            Its main modern uses are in Adobe's PostScript and Portable Document
            Format file formats, as well as in the patch encoding for binary
            files used by Git.
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
