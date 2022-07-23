import { useRef, useState } from "react";
import binConvert from "./binary-converter"; //converts to and from binary
import table from "./table";
import Header from "../Header";
import Footer from "../Footer";

export default function Xor({ setService }) {
  let [renderType, setRenderType] = useState("");
  let [outputPlaceholder, setOutputPlaceholder] = useState("The output");
  let inputRandBtn = useRef(null);
  let textareaRandBtn = useRef(null);
  let inputFieldRef = useRef(null);
  let keyFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectOpRef = useRef(null);
  let selectTypeRef = useRef(null);
  let selectOutFormatRef = useRef(null);
  let selectInFormatRef = useRef(null);
  let keyInputRef = useRef(null);
  let asciiT = table.ASCII;

  switch (renderType) {
    case "textlengthkey": {
      keyFieldRef.current.parentElement.style.display = "flex";
      keyInputRef.current.parentElement.style.display = "none";
      break;
    }

    case "repeatedkey": {
      keyFieldRef.current.parentElement.style.display = "none";
      keyInputRef.current.parentElement.style.display = "flex";
      break;
    }
  }
  function showErrPlaceholder(text) {
    setOutputPlaceholder(text);
    outputFieldRef.current.setAttribute("placeholder", outputPlaceholder);
    outputFieldRef.current.value = "";
  }

  function generateRandomKey(text, type, inputType) {
    let key = [];
    switch (type) {
      case "byte-long": {
        key.push(binConvert(Math.floor(Math.random() * 256), 8, "toBin"));
        keyInputRef.current.value = key.join("");
        break;
      }
      case "text-long": {
        if (text !== "") {
          switch (inputType) {
            case "binary": {
              let matches = inputFieldRef.current.value.match(/[0-1]{8}/g);
              //random key for each match
              if (matches) {
                matches.forEach((match) => {
                  let byteKey = binConvert(
                    Math.floor(Math.random() * 256),
                    8,
                    "toBin"
                  );
                  key.push(byteKey);
                });
              } else {
                showErrPlaceholder("Unexpected error");
              }

              break;
            }
            case "plaintext": {
              for (let char of text) {
                let byteKey = binConvert(
                  Math.floor(Math.random() * 256),
                  8,
                  "toBin"
                );
                key.push(byteKey);
              }
              break;
            }
          }
        }
        keyFieldRef.current.value = key.join(" ");
        break;
      }
    }
  }

  function convert(keyType, inputType, outputType) {
    let text = inputFieldRef.current.value;

    switch (keyType) {
      case "textlengthkey": {
        let cipher = [];
        let keyReg = new RegExp(
          `^([0-1]{${inputType === "binaryin" ? "1" : "8"}} ?){${text.length}}$`
        );

        if (keyReg.test(keyFieldRef.current.value)) {
          let textBits = [];
          let keyBits = keyFieldRef.current.value.replaceAll(" ", "").split("");

          switch (inputType) {
            case "binaryin": {
              if (/^([0-1]{8} ?)+$/.test(text)) {
                let splitted = inputFieldRef.current.value
                  .replace(/ /g, "")
                  .split("");
                textBits = splitted;
              } else {
                showErrPlaceholder(
                  "Invalid text format. the text should only contain 0,1 and be of the same length as key"
                );
                return "";
              }
              break;
            }
            case "plaintextin": {
              for (let char of text) {
                asciiT.forEach((c) => {
                  if (c[2] === char) textBits.push(c[1]);
                });
              }
              break;
            }
          }
          textBits = textBits.join("").split("");

          keyBits.forEach((bit, i) =>
            cipher.push(Number(bit) ^ Number(textBits[i]))
          );
          let groupedCipher = cipher.join("").match(/[0-1]{8}/g);
          switch (outputType) {
            case "binaryraw": {
              return groupedCipher.join("");
              break;
            }
            case "binaryspaced": {
              return groupedCipher.join(" ");
              break;
            }
            case "plaintext": {
              let arr = [];
              groupedCipher.forEach((byte) => {
                asciiT.forEach((c) => {
                  if (c[1] === byte) arr.push(c[2]);
                });
              });
              return arr.join("");
              break;
            }
          }
        } else {
          showErrPlaceholder(
            "1.the key must contain only binary digits(1,0) without linebreaks\n2.the key must be the same length as text length multipled by 8"
          );
          return "";
        }
        break;
      }
      case "repeatedkey": {
        if (text !== "") {
          if (keyInputRef.current.validity.valid) {
            let key = keyInputRef.current.value.split("");
            let cipher = [];
            let textBits = [];
            switch (inputType) {
              case "binaryin": {
                if (/^([0-1]{8} ?)+$/.test(text)) {
                  let splitted = inputFieldRef.current.value
                    .replace(/ /g, "")
                    .split("");
                  textBits = splitted;
                } else {
                  showErrPlaceholder(
                    "Invalid text format. the text should only contain 0,1"
                  );
                  return "";
                }
                break;
              }
              case "plaintextin": {
                for (let char of text) {
                  asciiT.forEach((c) => {
                    if (c[2] === char) textBits.push(c[1]);
                  });
                }
                break;
              }
            }
            textBits = textBits.join("").split("");
            if (key !== "") {
              let index = 0;

              textBits.forEach((bit) => {
                cipher.push(Number(bit) ^ Number(key[index]));
                index === 7 ? (index = 0) : (index += 1);
              });
            }
            let groupedCipher = cipher.join("").match(/[0-1]{8}/g);
            switch (outputType) {
              case "binaryraw": {
                return groupedCipher.join("");
                break;
              }
              case "binaryspaced": {
                return groupedCipher.join(" ");
                break;
              }
              case "plaintext": {
                let arr = [];
                groupedCipher.forEach((byte) => {
                  asciiT.forEach((c) => {
                    if (c[1] === byte) arr.push(c[2]);
                  });
                });
                return arr.join("");
                break;
              }
            }
          } else {
            outputFieldRef.current.setAttribute(
              "placeholder",
              "The key must only contain 1,0 and be 8 characters long"
            );
            //return "";
          }
        } //else return "";
        break;
      }
    }
  }

  function triggerFn() {
    setRenderType(selectTypeRef.current.value);
    console.log(outputPlaceholder);
    if (inputFieldRef.current.value != "") {
      outputFieldRef.current.value = convert(
        selectTypeRef.current.value,
        selectInFormatRef.current.value,
        selectOutFormatRef.current.value
      );
    } else {
      outputFieldRef.current.value = "";
      keyFieldRef.current.value = "";
      //outputFieldRef.current.setAttribute("placeholder", outputPlaceholder);
      showErrPlaceholder("The output");
    }
  }
  return (
    <>
      <Header setService={setService} />
      <main className="wrapper xor-wrapper">
        <h1>XOR cipher</h1>
        <div className="format-select">
          <span>input format: </span>
          <select ref={selectInFormatRef} onInput={() => triggerFn()}>
            <option value="plaintextin">ASCII</option>
            <option value="binaryin">binary</option>
          </select>{" "}
        </div>
        <div className="input-container">
          <div className="input-area-container">
            <textarea
              id="input-area"
              cols="30"
              rows="10"
              spellCheck="false"
              placeholder="Your text goes here..."
              title="your text"
              onInput={() => triggerFn()}
              ref={inputFieldRef}
            ></textarea>
          </div>
          <div className="key-area-container">
            <button
              id="randtextlength-btn"
              title="generate random key"
              className="rand"
              data-type="text-long"
              ref={textareaRandBtn}
              onClick={(e) => {
                generateRandomKey(
                  inputFieldRef.current.value,
                  e.target.dataset.type,
                  selectInFormatRef.current.value === "binaryin"
                    ? "binary"
                    : "plaintext"
                );
                triggerFn();
              }}
            >
              <i className="fas fa-dice"></i>
            </button>
            <textarea
              id="key-area"
              cols="30"
              rows="10"
              spellCheck="false"
              placeholder="The key"
              title="your key"
              onInput={() => triggerFn()}
              ref={keyFieldRef}
            ></textarea>
          </div>
        </div>
        <div className="selects-flex">
          <select
            onInput={() => triggerFn()}
            ref={selectOpRef}
            title="it is a symmetric proceedure so the operation for both encryption and decryption is the same"
          >
            <option value="encrypt" id="encrypt">
              convert
            </option>
          </select>
          <select onInput={() => triggerFn()} ref={selectTypeRef}>
            <option value="textlengthkey">Text-length key</option>
            <option value="repeatedkey">Repeated key</option>
          </select>
          <div>
            <input
              type="text"
              placeholder="The key"
              id="key-input"
              pattern="^[0-1]{8}$"
              ref={keyInputRef}
              onInput={() => triggerFn()}
              required
            />
            <button
              id="rand8bit-btn"
              title="generate random key"
              className="rand"
              ref={inputRandBtn}
              data-type="byte-long"
              onClick={(e) => {
                generateRandomKey(null, e.target.dataset.type, "plaintext");
                triggerFn();
              }}
            >
              <i className="fas fa-dice"></i>
            </button>
          </div>
        </div>

        <textarea
          id="output-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="The output"
          title="the output"
          ref={outputFieldRef}
        ></textarea>
        <div className="format-select">
          <span>output format:</span>{" "}
          <select ref={selectOutFormatRef} onInput={() => triggerFn()}>
            <option value="plaintext">ASCII</option>
            <option value="binaryraw">binary(raw)</option>
            <option value="binaryspaced">binary(spaced out)</option>
          </select>
        </div>
      </main>
      <section>
        <section className="info">
          <h1>What is XOR cipher?</h1>
          <p>
            In cryptography, the simple XOR cipher is a type of additive cipher,
            an encryption algorithm that operates according to the principles:
          </p>
          <ul>
            <li>A ⊕ 0 = A,</li>
            <li>A ⊕ A = 0,</li>
            <li>A ⊕ B = B ⊕ A,</li>
            <li>(A ⊕ B) ⊕ C = A ⊕ (B ⊕ C),</li>
            <li>(B ⊕ A) ⊕ A = B ⊕ 0 = B,</li>
          </ul>
          <p>
            where ⊕ denotes the exclusive disjunction (XOR) operation. This
            operation is sometimes called modulus 2 addition (or subtraction,
            which is identical). With this logic, a string of text can be
            encrypted by applying the bitwise XOR operator to every character
            using a given key. To decrypt the output, merely reapplying the XOR
            function with the key will remove the cipher.
          </p>

          <a href="https://en.wikipedia.org/wiki/XOR_cipher" target="_blank">
            read more
          </a>
        </section>
        <section className="info notes">
          <h1>Notes:</h1>
          <p>
            1. Seperation of bytes by spaces is only used for readability
            purposes and serves no other purpose. <code>11011010 10101001</code>{" "}
            and <code>1101101010101001</code> practically have the same result.
          </p>
          <p>
            2. Spaces are only valid when used in following manner:{" "}
            <code>"10011001 00011111 10...."</code> . Using more than one space
            side by side and/or not ending up with groups of 8 bits are
            considered invalid format.
          </p>
          <p>
            3. Some of the XOR'd bytes may correspond to ASCII{" "}
            <a href="https://www.geeksforgeeks.org/control-characters/">
              Control Characters
            </a>{" "}
            which cannot be represented by printable characters, it may also be
            a non-ASCII character. In either of cases the character will be
            replaced with unicode: <code>U+FFFD</code>(�). We suggest viewing
            the binary output should the ascii one be inaccurate.
          </p>
        </section>
      </section>
      <Footer />
    </>
  );
}
