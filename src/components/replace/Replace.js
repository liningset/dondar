import React, { useEffect, useRef } from "react";

export default function Replace({ helpers, setOutputBinary, setDescryption }) {
  const selectOpRef = useRef(null);
  const patternInputRef = useRef(null);
  const replacementInputRef = useRef(null);

  function regSearch(text, pattern, replacement) {
    patternInputRef.current.setAttribute("pattern", "/.+/g?i?m?s?u?");
    patternInputRef.current.setAttribute("placeholder", "/foo/g");
    if (
      patternInputRef.current.validity.valid &&
      replacementInputRef.current.validity.valid
    ) {
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
    patternInputRef.current.setAttribute("placeholder", "foo");
    if (
      patternInputRef.current.validity.valid &&
      replacementInputRef.current.validity.valid
    ) {
      let modifiedText = text;
      modifiedText = modifiedText.replaceAll(pattern, replacement);
      return modifiedText;
    } else {
      return text;
    }
  }

  function triggerFn() {
    let inputBinary = helpers.getFromStorage("outputBins");
    let result;
    switch (selectOpRef.current.value) {
      case "regex":
        result = regSearch(
          helpers.binToChar(inputBinary).join(""),
          patternInputRef.current.value,
          replacementInputRef.current.value
        );
        break;

      case "normal":
        result = normalSearch(
          helpers.binToChar(inputBinary).join(""),
          patternInputRef.current.value,
          replacementInputRef.current.value
        );
        break;
    }

    helpers.updateStorage({
      outputBins: helpers.charToBin(result.split("")),
    });
  }

  useEffect(() => triggerFn());

  return (
    <>
      <div className="div">
        <span>Search type</span>
        <select
          ref={selectOpRef}
          title="search method"
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
        >
          <option value="normal">Normal search</option>
          <option value="regex">Regular expression</option>
        </select>
      </div>
      <div className="div">
        <span>Match</span>
        <input
          type="text"
          title="combination to search for"
          placeholder="foo"
          ref={patternInputRef}
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
          pattern=".+"
          required
        />
      </div>
      <div className="div">
        <span>Replace with</span>
        <input
          type="text"
          title="phrase to replace the matches with"
          placeholder="bar"
          ref={replacementInputRef}
          onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
          pattern=".+"
          required
        />
      </div>
    </>
  );
}
