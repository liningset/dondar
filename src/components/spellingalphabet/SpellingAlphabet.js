import React, { useEffect, useRef } from "react";
import CHARSETS from "./charsets";
import Header from "../Header";
import Footer from "../Footer";

export default function SpellingAlphabet({
  currentOp,
  helpers,
  setOutputBinary,
  setDescryption,
}) {
  const selectAlphabetRef = useRef(null);

  function encode(text) {
    let charset = CHARSETS[selectAlphabetRef.current.value];
    let arr = [];
    for (let char of text) {
      if (charset.characters.includes(char.toLowerCase())) {
        arr.push(charset.words[charset.characters.indexOf(char.toLowerCase())]);
      } else if (/[0-9]/.test(char)) {
        arr.push(charset.numWords[char]);
      } else if (/ /.test(char)) {
        arr.push(charset.spaceWord);
      } else {
        arr.push(char);
      }
    }
    return arr.join(" ").split("");
  }

  function decode(text) {
    let charset = CHARSETS[selectAlphabetRef.current.value];
    let arr = text.split(" ");
    let decodedArr = [];
    arr.forEach((elem) => {
      if (charset.words.some((word) => new RegExp(`${elem}`, "i").test(word))) {
        let transformed = elem
          .split("")
          .map((c, i) => (i === 0 ? c.toUpperCase() : c.toLowerCase()))
          .join("");

        decodedArr.push(charset.characters[charset.words.indexOf(transformed)]);
      } else if (
        charset.numWords.some((word) => new RegExp(`${elem}`, "i").test(word))
      ) {
        let transformed = elem
          .split("")
          .map((c, i) => (i === 0 ? c.toUpperCase() : c.toLowerCase()))
          .join("");
        decodedArr.push(charset.numWords.indexOf(transformed));
      } else if (new RegExp(`${charset.spaceWord}`, "i").test(elem)) {
        decodedArr.push(" ");
      } else {
        decodedArr.push(elem);
      }
    });

    return decodedArr.join("").split("");
  }

  function triggerFn() {
    let input = helpers.getFromStorage("outputBins");
    let result;
    switch (currentOp) {
      case "encode":
        result = encode(helpers.binToChar(input).join(""));
        break;

      case "decode":
        result = decode(helpers.binToChar(input).join(""));
        break;
    }

    helpers.updateStorage({
      outputBins: helpers.charToBin(result),
    });
  }

  useEffect(() => triggerFn());

  return (
    <div className="div">
      <span>Variant</span>
      <select
        ref={selectAlphabetRef}
        onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
      >
        <option value="nato">NATO/ICAO phonetic alphabet</option>
        <option value="dutch">Dutch spelling alphabet</option>
        <option value="german">German spelling alphabet</option>
        <option value="swedish">Swedish Armed Forces\' radio alphabet</option>
        <option value="russian">
          Russian spelling alphabet (official, excludes Ё)
        </option>
        <option value="russian2">
          Russian spelling alphabet (unofficial, includes Ё)
        </option>
      </select>
    </div>
  );
}
