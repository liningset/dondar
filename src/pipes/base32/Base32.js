import React, { useEffect, useRef } from "react";

export default function Base32({
  currentOp,
  isDisabled,
  opInfo,
  helpers,
  setOutputBinary
}) {
  let selectVariantRef = useRef(null);

  const charsets = {
    base32: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    crockford: "0123456789ABCDEFGHJKMNPQRSTVWXYZ",
    base32hex: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
    zbase32: "ybndrfg8ejkmcpqxot1uwisza345h769"
  };

  function validate(input) {
    let isNotEmpty = input.length !== 0;
    let reg;
    let unpadded = input.filter(x => x !== "00111101");

    switch (currentOp) {
      case "encode":
        reg = /\n|./;
        break;

      case "decode":
        reg = new RegExp(`[${charsets[selectVariantRef.current.value]}]`);
        break;
    }

    if (isNotEmpty) {
      if (unpadded.every(c => reg.test(helpers.binToChar(c)))) {
        return true;
      } else {
        let illegalChar = unpadded.find(c => !reg.test(helpers.binToChar(c)));
        helpers.haltMessage(opInfo, `Invalid character at index ${input.indexOf(illegalChar)}`);
        return false;
      }
    } else return false;
  }

  /*1. the first argument recieves the text to be encoded/decoded 
    2. the second argument recieves the option of whether to look for binaries in ascii table
    or base32 table
    3.the third argument recieves the character set to work with if the 2nd argument is "base32T"*/
  function get6bitBinaries(text, set) {
    let charsetArr = set.split("");
    return text
      .split("")
      .map(char =>
        helpers.lengthen(charsetArr.indexOf(char).toString(2), "0", 5, "start")
      );
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
        regroupedBits = regroupedBits.filter(byte => !/0{8}/g.test(byte));
        return regroupedBits;
      }
    }
  }

  //----------------------------------------------------------------------------------

  /*1. the first argument recieves the array of binaries outputted by regroup() 
    2. the second argument recieves the option of whether to convert to base32 or plaintext
    3.the third argument recieves the character set to generate the base32 table with*/
  function convert(arrayInput, type, set) {
    let output = [];
    let charset = set.split("");
    switch (type) {
      case "encode": {
        arrayInput.forEach(group => {
          output.push(charset[Number(`0b${group}`)]);
        });
        if (
          output.length % 8 !== 0 &&
          !["crockford", "zbase32"].includes(selectVariantRef.current.value)
        ) {
          while (output.length % 8 !== 0) {
            output.push("=");
          }
        }
        break;
      }
      case "decode": {
        if (arrayInput) output = helpers.binToChar(arrayInput);
        break;
      }
    }

    return helpers.charToBin(output);
  }

  //-----------------------------------------------------------------------------

  /*executes all mentioned previous steps by:
  1.calling get6bitBinaries() to get the array of 8bit binaries
  2.passing that array as an argument to regroup() to get the array 5bit binaries
  3.passing that array to convert()
  4.displaying the encoded text*/
  function encode(input, charset) {
    return convert(regroup(input, "to5bit"), "encode", charset);
  }

  //-----------------------------------------------------------------------------

  /*
  0.checks for errors if not found proceeds to:
  1.call get6bitBinaries() to get the array of 5bit binaries
  2.pass that array as an argument to regroup() to get the array 8bit binaries
  3.pass that array to convert()
  4.display the decoded text*/
  function decode(input, charset) {
    let textArr = helpers.binToChar(input.filter(o => o !== "00111101"));
    let regrouped = regroup(input, "to5bit");

    return convert(
      regroup(get6bitBinaries(textArr.join(""), charset), "to8bit"),
      "decode",
      charset
    );
  }

  //-----------------------------------------------------------------------------

  /*the function that sets the whole program in motion.
   it gets triggered when interacting with the input fields(textarea {only input area}, select)*/
  function triggerFn() {
    let inputBinary = helpers.getFromStorage("outputBins");
    if (validate(inputBinary)) {
      let result;
      switch (currentOp) {
        case "encode":
          result = encode(
            inputBinary,
            charsets[selectVariantRef.current.value]
          );
          break;

        case "decode":
          result = decode(
            inputBinary,
            charsets[selectVariantRef.current.value]
          );
          break;
      }

      helpers.updateStorage({ outputBins: result });
    }
  }

  useEffect(() => {
    if (!isDisabled) triggerFn();
  });

  return (
    <div className="div">
      <span>Variant</span>
      <select
        ref={selectVariantRef}
        onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
      >
        <option value="base32">Base32 (RFC 4648)</option>
        <option value="crockford">Crockford's base32</option>
        <option value="base32hex">Base32Hex (RFC 4648)</option>
        <option value="zbase32">Z-base32</option>
      </select>
    </div>
  );
}
