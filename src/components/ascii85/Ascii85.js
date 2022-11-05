import { useEffect, useRef, useState } from "react";

export default function Ascii85({
  currentOp,
  opInfo,
  helpers,
  setOutputBinary,
  setDescryption,
}) {
  let inputFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectOpRef = useRef(null);
  let selectVariantRef = useRef(null);
  let selectOutFormatRef = useRef(null);
  let selectInFormatRef = useRef(null);
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

  //---------------------------------------------------------------------------------

  //the function that evaluates input before proceeding with further operations
  function validate(input) {
    //first off, input must not be empty
    if (input !== []) {
      //let textArr = helpers.binToChar(inputBinary);
      let reg;
      switch (currentOp) {
        case "encode":
          reg = /\n|./;
          break;

        case "decode":
          reg = charsets[selectVariantRef.current.value][1];
          break;
      }

      if (input.every((o) => reg.test(helpers.binToChar(o)))) {
        return true;
      } else {
        //otherwise:
        let illegalChar = input.find(
          (char) => !reg.test(helpers.binToChar(char))
        );
        helpers.updateStorage({
          haltedAt: [
            ...helpers.getFromStorage("haltedAt"),
            {
              at: `${opInfo.index + 1}.${opInfo.title}: `,
              error: `Invalid character at index ${input.indexOf(illegalChar)}`,
            },
          ],
        });
        return false;
      }
    } else {
      outputFieldRef.current.setAttribute("placeholder", `The output`);
      return false;
    }
  }

  //---------------------------------------------------------------------------------

  //recieves the string containing current input and outputs the array containing converted binaries
  function encode(input) {
    //will set the inputBinary variable to an array of octets based on input
    //**this variable will be used on encoding operations from now on
    /*switch (selectInFormatRef.current.value) {
      case "binary":
        inputBinary = input.match(/[01]{8}/g);
        break;

      case "ascii":
        inputBinary = asciiToBinary(input);
        break;
    }*/

    let paddedInputBinary = [...input] || [];
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
    //outputBinary = output.map((x) => asciiToBinary(x));
    //outputBinary = ;

    //decides which format to return the output as based on user preference.
    /*switch (selectOutFormatRef.current.value) {
      case "binary":
        return outputBinary.join(" ");

      case "ascii":
        return outputBinary
          .map((x) => String.fromCharCode(Number(`0b${x}`)))
          .join("");
    }*/
    return helpers.charToBin(output);
  }

  //---------------------------------------------------------------------------------

  function decode(input) {
    //will set the inputBinary variable to an array of octets based on input
    //**this variable will be used on encoding operations from now on
    /*switch (selectInFormatRef.current.value) {
      case "binary":
        inputBinary = input.match(/[01]{8}/g);
        break;

      case "ascii":
        inputBinary = asciiToBinary(input);
        break;
    }*/

    let paddedInputArr = [...input] || [];
    let paddedBytesCount = 0;

    /*pads paddedInputArr with "u"(01110101) until it's length becomes divisible by 5 with a remainder of zero
    while also keeping track of how many characters with padded*/
    if (input) {
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

    let output = [];
    temp.forEach((array) => {
      array.forEach((item) => {
        output.push(item);
      });
    });

    for (let i = 0; i < paddedBytesCount; i++) output.pop();
    /*switch (selectOutFormatRef.current.value) {
      case "binary":
        return outputBinary.join(" ");

      case "ascii":
        return outputBinary
          .map((x) => String.fromCharCode(Number(`0b${x}`)))
          .join("");
    }*/
    return output;
  }

  //---------------------------------------------------------------------------------

  function triggerFn() {
    let inputBinary = helpers.getFromStorage("outputBins");

    if (validate(inputBinary)) {
      /*switch (selectInFormatRef.current.value) {
        case "binary":
          inputBinary = inputFieldRef.current.value.match(/[01]{8}/g);
          break;

        case "ascii":
          inputBinary = asciiToBinary(inputFieldRef.current.value);
          break;
      }*/
      let result;
      switch (currentOp) {
        case "encode":
          result = encode(inputBinary);
          break;
        case "decode":
          result = decode(inputBinary);
          break;
      }
      helpers.updateStorage({
        outputBins: result,
      });
    } else {
    }
  }

  //---------------------------------------------------------------------------------

  useEffect(() => {
    triggerFn();
  });

  //---------------------------------------------------------------------------------

  return (
    <div className="div">
      <span>Variant</span>
      <select
        onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
        ref={selectVariantRef}
      >
        <option value="original">Original</option>
        <option value="z85">ZeroMQ (z85)</option>
      </select>

      {/* <section>
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
      </section> */}
    </div>
  );
}

//0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~    rfc 1924
