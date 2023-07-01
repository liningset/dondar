import React, { useEffect, useRef } from "react";

export default function CaseTransform({
  isDisabled,
  helpers,
  setOutputBinary
}) {
  let selectTypeRef = useRef(null);

  function validate(input) {
    return input.length !== 0;
  }

  function transform(text, type) {
    let transformed = text;
    switch (type) {
      case "uppercase": {
        transformed = text.toUpperCase();
        break;
      }
      case "lowercase": {
        transformed = text.toLowerCase();
        break;
      }
      case "capital": {
        const reg = /\b([a-z])+(\w+)?\b/gi;
        if (reg.test(text)) {
          transformed = text.toLowerCase();
          let matches = text.match(reg);

          let replacements = matches.map(match => {
            let arr = match.split("");
            arr.forEach((c, i) =>
              arr.splice(i, 1, i === 0 ? c.toUpperCase() : c.toLowerCase())
            );
            return arr.join("");
          });
          matches.forEach((match, i) => {
            transformed = transformed.replace(
              new RegExp(`(?<![a-z])${match}`, "gi"),
              replacements[i]
            );
          });
        }
        break;
      }
      case "title-case": {
        const reg = /\b([a-z]){3,}(\w+)?\b|^\w+/gi;
        if (reg.test(text)) {
          transformed = text.toLowerCase();
          let matches = text.match(reg);

          let replacements = matches.map(match => {
            let arr = match.split("");
            arr.forEach((c, i) =>
              arr.splice(i, 1, i === 0 ? c.toUpperCase() : c.toLowerCase())
            );
            return arr.join("");
          });
          matches.forEach((match, i) => {
            transformed = transformed.replace(
              new RegExp(`(?<![a-z])${match}`, "gi"),
              replacements[i]
            );
          });
        }
        break;
      }
      case "sentence-case": {
        function applyToReg(text) {
          return new RegExp(
            `(?<=([.,?!\\x0A] ?|^))${text}(?=( ?[.?!\\x0A]|$))`,
            "gi"
          );
        }
        const reg = /(?<=([.,?!\x0A] ?|^))[a-z]+[^.?!;]+(?=( ?[.?!\x0A]|$))/gi;
        if (reg.test(text)) {
          transformed = text.toLowerCase("");
          let matches = text.match(reg);
          let replacements = matches.map(match => {
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
      case "snake-case": {
        transformed = text
          .toLowerCase()
          .split(" ")
          .join("_");
        break;
      }
      case "camel-case": {
        let matches = text.match(/(?<=([ ]|^))([^ ]+)(?=([ ]|$))/gi);
        transformed = matches
          .map((match, i) => {
            switch (i) {
              case 0:
                return match.toLowerCase();

              default:
                match = match.toLowerCase("");
                return match.replace(match[0], match[0].toUpperCase());
            }
          })
          .join("");
        break;
      }
      case "pascal-case": {
        let matches = text.match(/(?<=([ ]|^))([^ ]+)(?=([ ]|$))/gi);
        transformed = matches
          .map(match => {
            match = match.toLowerCase("");
            return match.replace(match[0], match[0].toUpperCase());
          })
          .join("");
        break;
      }
      case "kebab-case": {
        transformed = text
          .toLowerCase()
          .split(" ")
          .join("-");
        break;
      }
      case "dot-case": {
        transformed = text
          .toLowerCase()
          .split(" ")
          .join(".");
        break;
      }
      case "alt1": {
        transformed = text.split("");
        transformed.forEach((char, i) => {
          transformed.splice(
            i,
            1,
            !(i % 2) ? char.toUpperCase() : char.toLowerCase()
          );
        });
        transformed = transformed.join("");
        break;
      }
      case "alt2": {
        transformed = text.split("");
        transformed.forEach((char, i) => {
          transformed.splice(
            i,
            1,
            !(i % 2) ? char.toLowerCase() : char.toUpperCase()
          );
        });
        transformed = transformed.join("");
        break;
      }
      case "inverse-case": {
        transformed = text
          .split("")
          .map(char =>
            char.toLowerCase() === char
              ? char.toUpperCase()
              : char.toLowerCase()
          )
          .join("");
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
        outputBins: helpers.charToBin(result.split(""))
      });
    }
  }

  useEffect(() => {
    if (!isDisabled) triggerFn();
  });

  return (
    <div className="div">
      <span>Type</span>
      <select
        ref={selectTypeRef}
        onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
      >
        <option value="uppercase">UPPERCASE</option>
        <option value="lowercase">lowercase</option>
        <option value="capital">Capitalized</option>
        <option value="title-case">Title Case</option>
        <option value="sentence-case">Sentence case</option>
        <option value="snake-case">snake_case</option>
        <option value="camel-case">camelCase</option>
        <option value="pascal-case">PascalCase</option>
        <option value="kebab-case">kebab-case</option>
        <option value="dot-case">dot.case</option>
        <option value="alt1">AlTeRnAtInG 1</option>
        <option value="alt2">aLtErNaTiNg 2</option>
        <option value="inverse-case">iNVERSE CASE</option>
      </select>
    </div>
  );
}
