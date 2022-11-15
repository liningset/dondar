import { useRef, useState } from "react";
import binConvert from "./binary-converter"; //converts to and from binary
import table from "./table";
import Header from "../Header";
import Footer from "../Footer";

export default function Xor({
  currentOp,
  binaries,
  setBinaries,
  outputFieldRef,
}) {
  let [renderType, setRenderType] = useState("");
  let [outputPlaceholder, setOutputPlaceholder] = useState("The output");
  let inputRandBtn = useRef(null);
  let textareaRandBtn = useRef(null);
  let inputFieldRef = useRef(null);
  let keyFieldRef = useRef(null);
  let selectTypeRef = useRef(null);
  let selectOutFormatRef = useRef(null);
  let selectInFormatRef = useRef(null);
  let keyInputRef = useRef(null);
  let asciiT = table.ASCII;

  // switch (renderType) {
  //   case "textlengthkey": {
  //     keyFieldRef.current.parentElement.style.display = "flex";
  //     keyInputRef.current.parentElement.style.display = "none";
  //     break;
  //   }

  //   case "repeatedkey": {
  //     keyFieldRef.current.parentElement.style.display = "none";
  //     keyInputRef.current.parentElement.style.display = "flex";
  //     break;
  //   }
  // }
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
        keyFieldRef.current.value = key.join("");
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
    let text =
      selectInFormatRef.current.value === "binaryin"
        ? inputFieldRef.current.value.replace(/ /g, "")
        : inputFieldRef.current.value;

    switch (keyType) {
      case "textlengthkey": {
        let cipher = [];
        let keyReg = new RegExp(
          `^([0-1]{${inputType === "binaryin" ? "1" : "8"}} ?){${text.length}}$`
        );

        if (keyReg.test(keyFieldRef.current.value)) {
          showErrPlaceholder("The output");
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
                  "XOR: the text should only contain 0,1 and be of the same length as key\nthe text cannot be shorter than 8 characters"
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
          if (selectInFormatRef.current.value === "binaryin") {
            showErrPlaceholder(
              "the key must only contain binary digits(1,0) without linebreaks\nthe key must be the same length as text"
            );
          } else {
            showErrPlaceholder(
              "the key must only contain binary digits(1,0) without linebreaks\nthe key must be the same length as text length multipled by 8"
            );
          }

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
                  showErrPlaceholder("the text should only contain 0,1");
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
                cipher.push(Number(bit) & Number(key[index]));
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
            return "";
          }
        }
        break;
      }
    }
  }

  function triggerFn() {
    setRenderType(selectTypeRef.current.value);
    if (inputFieldRef.current.value != "") {
      outputFieldRef.current.value = convert(
        selectTypeRef.current.value,
        selectInFormatRef.current.value,
        selectOutFormatRef.current.value
      );
    } else {
      outputFieldRef.current.value = "";
      keyFieldRef.current.value = "";
      showErrPlaceholder("The output");
    }
  }
  return (
    <>
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
          rows="5"
          spellCheck="false"
          placeholder="The key"
          title="your key"
          onInput={() => triggerFn()}
          ref={keyFieldRef}
        ></textarea>
        <select onInput={() => triggerFn()} ref={selectTypeRef}>
          <option value="textlengthkey">Text-length key</option>
          <option value="repeatedkey">Repeated key</option>
        </select>
      </div>
    </>
  );
}
