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
          modifiedText = modifiedText.replaceAll(reg, matchNum.join(""));
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
        let newText = textToDecode;
        newText = convertNumbers(newText);
        let brailleChunks = newText.match(/[^⠀]+/g);
        console.log(brailleChunks);
        let textChunks = [];
        if (brailleChunks) {
          brailleChunks.forEach((chunk) => {
            let mchunk = chunk;
            brailleTable.grade2.forEach((c) => {
              if (new RegExp(c[1], "g").test(mchunk))
                mchunk = mchunk.replaceAll(new RegExp(c[1], "g"), c[0]);
            });
            for (let char of mchunk) {
              brailleTable.alphabete.forEach((a) => {
                if (char === a[0]) mchunk = mchunk.replaceAll(a[0], a[1]);
              });
            }

            mchunk === chunk
              ? (newText = newText.replace())
              : (newText = newText.replace());
          });
        }
        //console.log(brailleChunks, textChunks);
        console.log(
          textChunks.every((a) => a === brailleChunks[textChunks.indexOf(a)])
        );

        brailleTable.grade2.forEach((cell) => {
          let symbol = cell[1];
          let phrase = cell[0];
          let reg = `${cell[2]}`.replaceAll(" ", "⠀");
          let newReg = new RegExp(
            reg.slice(1, reg.length - 2).replace(phrase, symbol),
            "g"
          );

          if (newReg.test(newText)) {
            newText = newText.replaceAll(newReg, phrase);
          }
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
    <main className="wrapper">
      <h1>Braille code</h1>
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
  );
}
