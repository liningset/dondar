import React, { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function Replace({ setService }) {
  const inputFieldRef = useRef(null);
  const outputFieldRef = useRef(null);
  const selectOpRef = useRef(null);
  const patternInputRef = useRef(null);
  const replacementInputRef = useRef(null);

  function regSearch(text, pattern, replacement) {
    patternInputRef.current.setAttribute("pattern", "/.+/g?i?m?s?u?");
    patternInputRef.current.setAttribute("placeholder", "/\\w+/g");
    if (patternInputRef.current.validity.valid) {
      let regMatch = pattern.match(/(?<=^(\/)).*(?=(\/g?i?m?s?u?)$)/g);
      let flags = pattern.match(/(?<=(\/.+\/))(g?i?m?s?u?)$/g);
      if (new RegExp(regMatch, flags[0]).test(text)) {
        let modifiedText = text;
        modifiedText = modifiedText.replace(
          new RegExp(regMatch, flags[0]),
          replacement
        );
        return modifiedText;
      } else return text;
    } else {
      return text;
    }
  }

  function normalSearch(text, pattern, replacement) {
    patternInputRef.current.setAttribute("placeholder", "search");
    if (patternInputRef.current.validity.valid) {
      let modifiedText = text;
      modifiedText = modifiedText.replaceAll(pattern, replacement);
      return modifiedText;
    } else {
      return text;
    }
  }

  function triggerFn() {
    selectOpRef.current.value === "regex"
      ? (outputFieldRef.current.value = regSearch(
          inputFieldRef.current.value,
          patternInputRef.current.value,
          replacementInputRef.current.value
        ))
      : (outputFieldRef.current.value = normalSearch(
          inputFieldRef.current.value,
          patternInputRef.current.value,
          replacementInputRef.current.value
        ));
  }

  return (
    <>
      <Header setService={setService} />
      <main className="wrapper">
        <h1>Replace</h1>
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
            <option value="normal">Normal search</option>
            <option value="regex">RegExp</option>
          </select>
          <input
            type="text"
            placeholder="search"
            ref={patternInputRef}
            onInput={() => triggerFn()}
            pattern=".+"
            required
          />
          <input
            type="text"
            placeholder="replace with"
            ref={replacementInputRef}
            onInput={() => triggerFn()}
          />
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
