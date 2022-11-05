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

  useEffect(() => {
    setDescryption(`<div className="info">
    <h3>What is Spelling Alphabet?</h3>
    <p>
      A spelling alphabet (also called by various other names) is a set of
      words used to stand for the letters of an alphabet in oral
      communication (speech), especially when over a two-way radio or
      telephone. The words are chosen because they sound sufficiently
      different from each other to avoid any confusion that could easily
      otherwise result from the names of letters that sound similar except
      for some small difference easily missed or easily degraded by the
      imperfect sound quality of the apparatus. For example, "bee" and
      "pee" and "dee" sound similar and could easily be confused, but
      "bravo" and "papa" and "delta" sound different, making confusion
      unlikely.
    </p>
    <p>
      Any suitable words can be used in the moment, making this form of
      communication easy even for people not trained on any particular
      standardized spelling alphabet. For example, it is common to hear a
      nonce form like "A as in 'apple', D as in 'dog', P as in 'paper'"
      over the telephone in customer support contexts. However, to gain
      the advantages of standardization in contexts involving trained
      persons, a standard version can be convened by an organization. Many
      (loosely or strictly) standardized spelling alphabets exist, mostly
      owing to historical siloization, where each organization simply
      created its own. International air travel created a need for a
      worldwide standard. Today the most widely known spelling alphabet is
      the ICAO International Radiotelephony Spelling Alphabet, also known
      as the NATO phonetic alphabet.
    </p>

    <a
      href="https://en.wikipedia.org/wiki/Spelling_alphabet"
      target="_blank"
    >
      read more
    </a>
  </div>`);
    triggerFn();
  });

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
