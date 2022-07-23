import { useRef } from "react";
import brailleTable from "./braille-table";
import Header from "../Header";
import Footer from "../Footer";

export default function Braille({ setService }) {
  let inputFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectOpRef = useRef(null);
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
              modifiedText = modifiedText.replace(pattern, symbol);
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
        function findGrade2MatchesOf(text) {
          let existantMatches = [];
          brailleTable.grade2.forEach((cell) => {
            let symbol = cell[1];
            let phrase = cell[0];
            let reg = `${cell[2]}`;
            reg = reg.replace(
              /\(\?=\(\[ ,\\\.\]\|\$\)\)/g,
              "(?=(⠀|([⠂⠲]⠀)|$))"
            );
            reg = reg.replace(/ /g, "⠀");
            let newReg = new RegExp(
              reg.slice(1, reg.length - 2).replace(phrase, symbol),
              "g"
            );
            if (newReg.test(text)) {
              let newReg2 = new RegExp(
                `(?<=(⠀[⠠]?|^))([^⠀]*(${String(newReg).slice(
                  1,
                  String(newReg).length - 2
                )})[^⠀]*)(?=([⠀⠲⠂]|$))`
              );
              let surroundingWord = text.match(newReg2);

              existantMatches.push([
                phrase,
                symbol,
                newReg,
                surroundingWord[0],
              ]);
            }
          });

          return existantMatches;
        }

        let newText = textToDecode;
        newText = convertNumbers(newText);
        console.log(newText);
        let existantMatches = findGrade2MatchesOf(newText);
        if (existantMatches)
          existantMatches.forEach((cell) => {
            let phrase = cell[0];
            let symbol = cell[1];
            let reg = cell[2];
            let surroundingWord = cell[3];
            let matchesInWord = [];
            existantMatches.forEach((match) => {
              if (match[2].test(surroundingWord)) matchesInWord.push(match);
            });
            console.log(matchesInWord);
            if (matchesInWord.length > 1) {
              matchesInWord.push([...matchesInWord]);
              matchesInWord = matchesInWord.map((match, index) => {
                if (index === matchesInWord.length - 1) {
                  return match;
                } else {
                  return [match];
                }
              });
            }
            if (symbol === surroundingWord.replaceAll("⠠", "")) {
              newText = newText.replace(reg, phrase);
            } else {
              if (brailleTable.allowedCombs.hasOwnProperty(phrase)) {
                let checkCombs = brailleTable.allowedCombs[phrase].find(
                  (word) => {
                    if (
                      !(matchesInWord.length > 1 && matchesInWord.length !== 0)
                    ) {
                      let convertedWord = surroundingWord;
                      if (matchesInWord[0]) {
                        convertedWord = convertedWord.replace(
                          matchesInWord[0][2],
                          matchesInWord[0][0]
                        );
                      }

                      brailleTable.alphabete.forEach((cell) => {
                        let letter = cell[0];
                        let symbol = cell[1];
                        if (convertedWord.includes(symbol)) {
                          convertedWord = convertedWord.replaceAll(
                            symbol,
                            letter
                          );
                        }
                      });

                      //console.log(convertedWord);
                      //let checkReg = new RegExp(convertedWord);
                      //return checkReg.test(word);
                      return word === convertedWord;
                    } else {
                      matchesInWord.forEach((match) => {
                        let convertedWord = surroundingWord;
                        match.forEach((m) => {
                          convertedWord = convertedWord.replace(m[2], m[0]);

                          brailleTable.alphabete.forEach((cell) => {
                            let letter = cell[0];
                            let symbol = cell[1];
                            if (newText.includes(symbol))
                              convertedWord = convertedWord.replaceAll(
                                symbol,
                                letter
                              );
                          });

                          console.log(convertedWord);
                        });
                        //console.log(convertedWord);

                        //let checkReg = new RegExp(convertedWord);
                        //return checkReg.test(word);
                        return word === convertedWord;
                      });
                    }
                  }
                );
                if (checkCombs) {
                  newText = newText.replace(reg, phrase);
                } else {
                  let arr = [];
                  for (let char of symbol) {
                    brailleTable.alphabete.forEach((c) => {
                      if (c[1] === char) arr.push(c[0]);
                    });
                  }
                  newText = newText.replace(reg, arr.join(""));
                }
              } else {
                newText = newText.replace(reg, phrase);
              }
            }
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
        newText = newText.replace(/⠠Gg/g, '"');
        newText = newText.replace(/(?<=(\d))cc(?=(\d))/g, ":");
        return removePunctuation(newText);
        break;
      }
    }
  }

  //---------------------------------------------------------------------------

  /*the function that sets the whole program in motion.
   it gets triggered when interacting with the input fields(textarea {only input area}, selects)*/
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
      <Header setService={setService} />
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
      <section>
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
            translations in decode phase may not work as expected
          </p>
        </section>
      </section>
      <Footer />
    </>
  );
}
