import { useRef } from "react";
import brailleTable from "./braille-table";

export default function Braille() {
  let inputFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectOpRef = useRef(null);
  let selectGradeRef = useRef(null);

  function encode(text, type) {
    function addPunctuation() {
      let modifiedText = text;

      brailleTable.punctuation.forEach((punc) => {
        let symbol = punc[1];
        let pattern = punc[2];
        let matches = [...new Set(modifiedText.match(pattern))];

        if (matches) {
          matches.forEach((match, index) => {
            modifiedText = modifiedText.replaceAll(match, `${symbol}${match}`);
            modifiedText = modifiedText.replaceAll(
              /(?<=([ ⠰a-j]))[⠰](?=([a-j]))/g,
              ""
            );
            modifiedText = modifiedText.replaceAll(
              /(?<=([⠼\d]))[⠼](?=(\d))/g,
              ""
            );
            modifiedText = modifiedText.replaceAll(
              /(?<=(⠠{2})|([A-Z]))⠠(?=([A-Z])|(?!(⠤)))/g,
              ""
            );
          });
        }
      });

      return modifiedText;
    }

    switch (type) {
      case "g1": {
        const arr = [];
        let newText = addPunctuation().toLowerCase();
        for (let char of newText) {
          if (brailleTable.punctuation.some((c) => c[1] === char)) {
            brailleTable.punctuation.forEach((cell) => {
              if (cell[1] === char) arr.push(char);
            });
          } else {
            if (/[=\+\*\d]/.test(char)) {
              //(/\d/.test(char) && char !== " ") || /[=\+\*]/.test(char)
              brailleTable.numbers.forEach((cell) => {
                let letter = cell[0];
                let symbol = cell[1];
                if (letter === char) arr.push(symbol);
              });
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

  function decode(textToDecode, type) {
    function removePunctuation(text) {
      let modifiedText = text;
      brailleTable.punctuation.forEach((punc) => {
        let symbol = punc[1];
        let pattern = punc[3];
        modifiedText = modifiedText.replaceAll(pattern, "");
      });
      return modifiedText;
    }
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
          modifiedText = modifiedText.replaceAll(
            new RegExp(`(?<=⠼)${match}`, "g"),
            matchNum.join("")
          );
        });
      }
      return modifiedText;
    }
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
            console.log(regToReplace);

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

        /*for (let char of newText) {
          brailleTable.alphabete.forEach((cell) => {
            let letter = cell[0];
            let symbol = cell[1];
            if (symbol === char) newText = newText.replace(char, letter);
          });
        }*/
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
        /*function checkProperGrade(newReg, symbol) {
          let existantMatches = [];
          let hasAlternativeArr = [];
          if (newReg.test(newText)) {
            existantMatches.push(symbol);
            existantMatches.forEach((match) => {
              let hasAlternative = match.split("").every((s) => {
                let bool;
                brailleTable.alphabete.forEach((c) => {
                  if (c[1] === s) bool = true;
                });
                return bool;
              });
              if (hasAlternative) hasAlternativeArr.push(match);
            });
          }
          let modifiedAlternative = [];
          if (hasAlternativeArr) {
            hasAlternativeArr.forEach((match) => {
              let arr = [];
              for (let char of match) {
                brailleTable.alphabete.forEach((c) => {
                  if (c[1] === char) arr.push(c[0]);
                });
              }
              modifiedAlternative.push([match, arr.join("")]);
            });
          }
          return modifiedAlternative;
        }*/
        let newText = textToDecode;
        newText = convertNumbers(newText);

        brailleTable.grade2.forEach((cell) => {
          let symbol = cell[1];
          let phrase = cell[0];
          let reg = `${cell[2]}`.replaceAll(" ", "⠀");
          let newReg = new RegExp(
            reg.slice(1, reg.length - 2).replace(phrase, symbol),
            "g"
          );

          /*let partToReplaceFromAlphabete = checkProperGrade(newReg, symbol);
          partToReplaceFromAlphabete.forEach((p) => {
            let newReg2 = new RegExp(
              String(newReg)
                .slice(1, String(newReg).length - 2)
                .replace(symbol, p[0]),
              "g"
            );
            newText = newText.replace(newReg2, p[1]);
          });*/

          newText = newText.replace(newReg, phrase);
        });

        for (let char of newText) {
          brailleTable.alphabete.forEach((cell) => {
            let letter = cell[0];
            let symbol = cell[1];
            if (symbol === char) newText = newText.replace(char, letter);
          });
        }
        newText = convertCapitalCase(newText);
        return removePunctuation(newText);
        break;
      }
    }
  }

  function triggerFn() {
    if (selectOpRef.current.value === "encode") {
      outputFieldRef.current.value = encode(
        inputFieldRef.current.value,
        selectGradeRef.current.value
      );
    } else if (selectOpRef.current.value === "decode") {
      outputFieldRef.current.value = decode(
        inputFieldRef.current.value,
        selectGradeRef.current.value
      );
    }
  }
  return (
    <>
      <main className="wrapper">
        <h1>Braille</h1>
        <textarea
          id="input-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="Your text goes here..."
          ref={inputFieldRef}
          onInput={() => triggerFn()}
        ></textarea>
        <div className="selects-flex">
          <select ref={selectOpRef} onInput={() => triggerFn()}>
            <option value="encode">encode</option>
            <option value="decode">decode</option>
          </select>
          <select ref={selectGradeRef} onInput={() => triggerFn()}>
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
        </div>
        <textarea
          id="output-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="The output"
          ref={outputFieldRef}
        ></textarea>
      </main>
      <section className="info">
        <h1>What is Braille?</h1>
        <p>
          Braille is a tactile writing system used by people who are visually
          impaired, including people who are blind, deafblind or who have low
          vision. It can be read either on embossed paper or by using
          refreshable braille displays that connect to computers and smartphone
          devices. Braille can be written using a slate and stylus, a braille
          writer, an electronic braille notetaker or with the use of a computer
          connected to a braille embosser.
        </p>
        <p>
          Braille characters are formed using a combination of six raised dots
          arranged in a 3*2 matrix, called the braille cell. The number and
          arrangement of these dots distinguishes one character from another.
          Since the various braille alphabets originated as transcription codes
          for printed writing, the mappings (sets of character designations)
          vary from language to language, and even within one; in English
          Braille there are 3 types of braille:
        </p>
        <ul>
          <li>
            grade 1 – a letter-by-letter transcription used for basic literacy;
          </li>
          <li>
            grade 2 – an addition of abbreviations and contractions used as a
            space-saving mechanism;
          </li>
          <li>
            grade 3 – various non-standardized personal stenography that is less
            commonly used.
          </li>
        </ul>
        <a href="https://en.wikipedia.org/wiki/Braille" target="_blank">
          read more
        </a>
      </section>
    </>
  );
}
