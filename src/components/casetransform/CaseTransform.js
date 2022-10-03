import { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function CaseTransform({ setService }) {
  let inputFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectTypeRef = useRef(null);

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
          return new RegExp(
            `(?<=([ ,\\.'"\\(\\)\\x0A]|^))${text}(?=([ ,\\.'"\\(\\)\\x0A]|$))`,
            "gi"
          );
        }
        const reg = applyToReg("[a-z]{3,}(-[a-z0-9]+)?");
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
    if (inputFieldRef.current.value !== "") {
      outputFieldRef.current.value = transform(
        inputFieldRef.current.value,
        selectTypeRef.current.value
      );
    }
  }
  return (
    <>
      <Header setService={setService} />
      <main className="wrapper">
        <h1>Case transform</h1>
        <textarea
          id="input-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="Your text goes here..."
          onInput={() => triggerFn()}
          ref={inputFieldRef}
        ></textarea>
        <div className="selects-flex">
          <select ref={selectTypeRef} onInput={() => triggerFn()}>
            <option value="allup">All uppercase</option>
            <option value="alllow">All lowercase</option>
            <option value="capwords">Capitalize words</option>
            <option value="capsentences">Capitalize sentences</option>
            <option value="oddupevenlow">
              Odds uppercase, Evens lowercase
            </option>
            <option value="oddlowevenup">
              Odds lowercase, Evens uppercase
            </option>
          </select>
          <label htmlFor="checkbox">
            overwrite all
            <input id="checkbox" type="checkbox" />
          </label>
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
      <Footer />
    </>
  );
}
