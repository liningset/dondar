import { useEffect, useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function CaseTransform({
  opInfo,
  helpers,
  setOutputBinary,
  setDescryption,
}) {
  let inputFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectTypeRef = useRef(null);

  function validate(input) {
    return input.length !== 0;
  }

  function transform(text, type) {
    let transformed;
    switch (type) {
      case "allup": {
        transformed = text.toUpperCase();
        break;
      }
      case "alllow": {
        transformed = text.toLowerCase();
        break;
      }
      case "oddupevenlow": {
        transformed = text.split("");
        transformed.forEach((char, i) => {
          if (i % 2 === 0) {
            transformed.splice(i, 1, char.toUpperCase());
          } else {
            transformed.splice(i, 1, char.toLowerCase());
          }
        });
        transformed = transformed.join("");
        break;
      }
      case "oddlowevenup": {
        transformed = text.split("");
        transformed.forEach((char, i) => {
          if (i % 2 === 0) {
            transformed.splice(i, 1, char.toLowerCase());
          } else {
            transformed.splice(i, 1, char.toUpperCase());
          }
        });
        transformed = transformed.join("");
        break;
      }
      case "capwords": {
        function applyToReg(text) {
          return new RegExp(`${text}`, "gi");
        }
        const reg = applyToReg("\\b([a-z]){3,}(\\w+)?\\b"); //[a-z]{3,}(-[a-z0-9]+)?
        if (reg.test(text)) {
          transformed = text.toLowerCase();
          let matches = text.match(reg);

          let replacements = matches.map((match) => {
            let arr = match.split("");
            arr.forEach((c, i) =>
              arr.splice(i, 1, i === 0 ? c.toUpperCase() : c.toLowerCase())
            );
            return arr.join("");
          });
          matches.forEach((match, i) => {
            transformed = transformed.replace(
              applyToReg(match),
              replacements[i]
            );
          });
        }

        break;
      }
      case "capsentences": {
        function applyToReg(text) {
          return new RegExp(
            `(?<=([\\.,\\?!;\\x0A] ?|^))${text}(?=( ?[\\.\\?!;\\x0A]|$))`,
            "gi"
          );
        }
        const reg = applyToReg("[a-z]{2,}[^\\.\\?!;]+");
        if (reg.test(text)) {
          transformed = text.toLowerCase("");
          let matches = text.match(reg);
          let replacements = matches.map((match) => {
            let arr = match.split("");
            arr.forEach((c, i) =>
              arr.splice(i, 1, i === 0 ? c.toUpperCase() : c.toLowerCase())
            );
            return arr.join("");
          });
          console.log(matches, replacements);
          matches.forEach((match, i) => {
            transformed = transformed.replace(
              applyToReg(match),
              replacements[i]
            );
          });
        }
        break;
      }
    }
    return transformed;
  }

  function triggerFn() {
    let inputBinary = helpers.getFromStorage("outputBins");
    if (validate(inputBinary)) {
      let result = transform(
        helpers.binToChar(inputBinary).join(""),
        selectTypeRef.current.value
      );
      helpers.updateStorage({
        outputBins: helpers.charToBin(result.split("")),
      });
    }
  }

  useEffect(() => triggerFn());
  return (
    <div className="div">
      <span>Type</span>
      <select
        ref={selectTypeRef}
        onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
      >
        <option value="allup">Uppercase (ABCDEFG)</option>
        <option value="alllow">Lowercase (abcdefg)</option>
        <option value="capwords">Capitalize words (Abcd Efg)</option>
        <option value="capsentences">Capitalize sentences (Abcd efg)</option>
        <option value="oddupevenlow">Alternating 1 (AbCdEfG)</option>
        <option value="oddlowevenup">Alternating 2 (aBcDeFg)</option>
      </select>
    </div>
  );
}
