import { useEffect, useRef } from "react";
import brailleTable from "./braille-table";

export default function Braille({
  currentOp,
  helpers,
  setOutputBinary,
  setDescryption,
}) {
  let selectGradeRef = useRef(null);

  //---------------------------------------------------------------------------

  /*1.recieves the text to be encoded
   2.recieves the grade for encoding
   note: in grade1 the text will be replaced by their counterpart on nearly a
    one on one scale, but in grade2 there are some contractions to take into consideration*/
  function encode(textToEncode, type) {
    /*applies puncuation marks presented in brailletable.punctuation*/
    function addPunctuation() {
      let modifiedText = textToEncode;

      /*iterates through each of punctuation rules along with their 
      respective regular expressions to insert the character needed in the right before
      matching spots unless it's about double quotations 
      in which case it will replace the character itself*/
      brailleTable.punctuation.forEach((punc, index) => {
        let symbol = punc[0];
        let pattern = punc[1];
        let matches = [...new Set(modifiedText.match(pattern))];

        if (matches) {
          matches.forEach((match) => {
            if (index === 4 || index === 5) {
              /*while (pattern.test(modifiedText)) {
                console.log(modifiedText);
                modifiedText = modifiedText.replace(pattern, symbol);
                console.log(modifiedText);
              }*/
              //modifiedText = modifiedText.replace(punc[1], symbol);
            } else {
              /*this section prevents certain punctuation symbols from 
              unexpectedly repeating themselves*/
              modifiedText = modifiedText.replaceAll(
                match,
                `${symbol}${match}`
              );
              modifiedText = modifiedText.replaceAll(
                /(?<=([ ⠰a-j]))⠰(?=([a-j]))/g,
                ""
              );
              modifiedText = modifiedText.replaceAll(
                /(?<=([⠼\d]))⠼(?=(\d))/g,
                ""
              );
              modifiedText = modifiedText.replaceAll(
                /(?<=(⠠{2})|([A-Z]))⠠(?=([A-Z])|(?!(⠤)))/g,
                ""
              );
            }
          });
        }
      });

      return modifiedText;
    }

    switch (type) {
      /*1.runs puntuation check on the text first
         2.iterates through the text characters one by one
         3.on each iteration 
            1.if the character is alien to latin alphabete it gets passed as itself
            2.else if the character is 0-9 or either of *+= it gets replaced with the 
            braille version of it from brailleTable.numbers
            3.else the character gets replaced with the braille version of it from brailleTable.alphabete
            4.the function returns a result array*/
      case "g1": {
        const arr = [];
        let newText = addPunctuation().toLowerCase();
        for (let char of newText) {
          if (brailleTable.punctuation.some((c) => c[0] === char)) {
            brailleTable.punctuation.forEach((cell) => {
              if (cell[0] === char) arr.push(char);
            });
          } else {
            if (/[=\+\*\d]/.test(char)) {
              //(/\d/.test(char) && char !== " ") || /[=\+\*]/.test(char)
              brailleTable.numbers.forEach((cell) => {
                let letter = cell[0];
                let symbol = cell[1];
                if (letter === char) arr.push(symbol);
              });
            } else if (brailleTable.alphabete.every((c) => c[0] !== char)) {
              arr.push(char);
            } else {
              brailleTable.alphabete.forEach((cell) => {
                let letter = cell[0];
                let symbol = cell[1];
                if (char === letter) arr.push(symbol);
              });
            }
          }
        }
        return arr.join("");
        break;
      }
      /*1.runs puntuation check on the text before converting all letters to lowercase
        (in decoding process capital case letters can be identified by their braille punctuation marks)
        2.searches through the contraction table to replace matches with their shortened braille
        3.iterates through the text and replaces the remaining characters as described in g1*/
      case "g2": {
        let newText = addPunctuation().toLowerCase();
        brailleTable.grade2.forEach((cell) => {
          let pattern = cell[2];
          let symbol = cell[1];

          if (pattern.test(newText)) {
            newText = newText.replaceAll(pattern, symbol);
          }
        });

        for (let char of newText) {
          if (/[=\+\*\d]/.test(char)) {
            brailleTable.numbers.forEach((cell) => {
              let letter = cell[0];
              let symbol = cell[1];
              if (letter === char) newText = newText.replace(letter, symbol);
            });
          } else {
            brailleTable.alphabete.forEach((cell) => {
              let letter = cell[0];
              let symbol = cell[1];

              if (char === letter) newText = newText.replace(char, symbol);
            });
          }
        }
        return newText;
        break;
      }
    }
  }

  //---------------------------------------------------------------------------

  /*1.recieves the text to be decoded
   2.recieves the grade for decoding*/
  function decode(textToDecode, type) {
    /*runs through the punctuation rules and removes the matching symbols */
    function removePunctuation(text) {
      let modifiedText = text;
      brailleTable.punctuation.forEach((punc) => {
        let symbol = punc[0];
        let pattern = punc[2];
        modifiedText = modifiedText.replaceAll(pattern, "");
      });
      return modifiedText;
    }
    /*decodes specifically numbers to latin text*/
    function convertNumbers(text) {
      let modifiedText = text;
      let reg = /(?<=⠼)([⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚]+[⠂⠲]?[⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚]*)/g;
      if (reg.test(modifiedText)) {
        let matches = modifiedText.match(reg);
        matches.forEach((match) => {
          let matchNum = match.split("");
          matchNum.forEach((char) => {
            brailleTable.numbers.forEach((num) => {
              if (num[1] === char)
                matchNum.splice(matchNum.indexOf(char), 1, num[0]);
            });
          });
          modifiedText = modifiedText.replace(
            new RegExp(`(?<=[⠼0-9])${match}`),
            matchNum.join("")
          );
        });
      }
      return modifiedText;
    }
    /*identifies the characters to be capitalized before replaceing them with capitalized alternatives*/
    function convertCapitalCase(text) {
      let modifiedText = text;
      let regs = [
        /(?<=((?<!⠠)⠠(?![⠤⠠])))[a-z]/g,
        /(?<=((⠠{2})(?![⠤⠠])))[a-z]+/g,
      ];
      regs.forEach((reg) => {
        let matches = modifiedText.match(reg);
        if (matches) {
          matches.forEach((match) => {
            let regToReplace = new RegExp(
              String(reg)
                .slice(1, String(reg).length - 2)
                .replace(/\[a\-z\]\+?/g, match)
            );

            modifiedText = modifiedText.replace(
              regToReplace,
              match.toUpperCase()
            );
          });
        }
      });
      console.log(modifiedText);
      return modifiedText;
    }
    switch (type) {
      case "g1": {
        let newText = textToDecode;

        newText = convertNumbers(newText);

        brailleTable.alphabete.forEach((cell) => {
          let letter = cell[0];
          let symbol = cell[1];
          let reg = new RegExp(symbol, "g");
          if (reg.test(newText)) newText = newText.replace(reg, letter);
        });
        newText = convertCapitalCase(newText);
        return removePunctuation(newText);
        break;
      }
      case "g2": {
        function engRegToBrailleReg() {
          let arr = [];
          brailleTable.grade2.forEach((cell, i) => {
            let symbol = cell[1];
            let phrase = cell[0];
            let reg = `${cell[2]}`;
            reg = reg.replace(/\[ ,\.\]/g, "[⠀⠂⠲]");
            reg = reg.replace(/\(\^\|\[ ,\.\]\)/g, "(^|⠀|([⠂⠲]⠀))");
            reg = reg.replace(/ /g, "⠀");
            let regT = reg.slice(1, reg.length - 2).replace(phrase, symbol);
            brailleTable.grade2.forEach((c) => {
              if (c[2].test(regT)) regT = regT.replace(c[2], c[1]);
            });

            regT = regT
              .replace(
                /\\\(/g,
                brailleTable.alphabete.find((c) => c[0] === "(")[1]
              )
              .replace(
                /\\\)/g,
                brailleTable.alphabete.find((c) => c[0] === ")")[1]
              );

            for (let char of regT) {
              if (/[a-z]/gi.test(char)) {
                brailleTable.alphabete.forEach((c) => {
                  if (char === c[0]) regT = regT.replaceAll(c[0], c[1]);
                });
              }
            }
            console.log(regT);
            arr.push([phrase, symbol, new RegExp(regT, "g")]);
          });

          return arr;
        }

        let newText = textToDecode;
        newText = convertNumbers(newText);
        let braillifiedTable = engRegToBrailleReg();
        console.log(braillifiedTable);

        braillifiedTable.forEach((cell) => {
          newText = newText.replace(cell[2], cell[0]);
        });

        brailleTable.alphabete.forEach((cell) => {
          let letter = cell[0];
          let symbol = cell[1];
          if (newText.includes(symbol)) {
            newText = newText.replaceAll(symbol, letter);
          }
        });
        newText = convertCapitalCase(newText);
        //fix some errors
        //newText = newText.replace(/⠠Gg/g, '"');
        //newText = newText.replace(/(?<=(\d))cc(?=(\d))/g, ":");
        return removePunctuation(newText);
        break;
      }
    }
  }

  //---------------------------------------------------------------------------

  /*the function that sets the whole program in motion.
   it gets triggered when interacting with the input fields(textarea {only input area}, selects)*/
  function triggerFn() {
    let inputBinary = helpers.getFromStorage("outputBins");
    let result;

    switch (currentOp) {
      case "encode":
        result = encode(
          helpers.binToChar(inputBinary).join(""),
          selectGradeRef.current.value
        );
        break;

      case "decode":
        result = decode(
          helpers.binToChar(inputBinary).join(""),
          selectGradeRef.current.value
        );
        break;
    }
    helpers.updateStorage({
      outputBins: helpers.charToBin(result.split("")),
    });

    /*if (selectOpRef.current.value === "encode") {
      outputFieldRef.current.value = encode(
        inputFieldRef.current.value,
        selectGradeRef.current.value
      );
    } else if (selectOpRef.current.value === "decode") {
      outputFieldRef.current.value = decode(
        inputFieldRef.current.value,
        selectGradeRef.current.value
      );
    }*/
  }

  useEffect(() => triggerFn());

  return (
    <div className="div">
      <span>Grade</span>
      <select
        ref={selectGradeRef}
        onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
      >
        <option value="g1" title="punctuation + alphabete">
          grade 1
        </option>
        <option
          value="g2"
          title="punctuation + alphabete + common words contractions"
        >
          grade 2
        </option>
      </select>
      {/* <section>
        <section className="info">
          <h1>What is Braille?</h1>
          <p>
            Braille is a tactile writing system used by people who are visually
            impaired, including people who are blind, deafblind or who have low
            vision. It can be read either on embossed paper or by using
            refreshable braille displays that connect to computers and
            smartphone devices. Braille can be written using a slate and stylus,
            a braille writer, an electronic braille notetaker or with the use of
            a computer connected to a braille embosser.
          </p>
          <p>
            Braille characters are formed using a combination of six raised dots
            arranged in a 3*2 matrix, called the braille cell. The number and
            arrangement of these dots distinguishes one character from another.
            Since the various braille alphabets originated as transcription
            codes for printed writing, the mappings (sets of character
            designations) vary from language to language, and even within one;
            in English Braille there are 3 types of braille:
          </p>
          <ul>
            <li>
              grade 1 – a letter-by-letter transcription used for basic
              literacy;
            </li>
            <li>
              grade 2 – an addition of abbreviations and contractions used as a
              space-saving mechanism;
            </li>
            <li>
              grade 3 – various non-standardized personal stenography that is
              less commonly used.
            </li>
          </ul>
          <a href="https://en.wikipedia.org/wiki/Braille" target="_blank">
            read more
          </a>
        </section>
        <section className="notes">
          <h1>Notes:</h1>
          <p>
            1. Grade 2 contraction system is a work in progress. Some
            translations in decode phase may not work as expected.
          </p>
          <p>
            2. For more accurate translations, it is important for the text to
            be as grammatically and punctually valid as possible.
          </p>
        </section>
      </section> */}
    </div>
  );
}
