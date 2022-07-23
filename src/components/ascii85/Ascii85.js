import { useRef } from "react";
import tablesModule from "./tables";
import Header from "../Header";
import Footer from "../Footer";

export default function Ascii85({ setService }) {
  let inputFieldRef = useRef(null);
  let outputFieldRef = useRef(null);
  let selectRef = useRef(null);
  let asciiT = tablesModule.ASCII;
  let base85T = tablesModule.base85;

  function encode() {
    let text = inputFieldRef.current.value;
  }
  function decode() {
    let text = inputFieldRef.current.value;
  }

  function triggerFn() {
    if (inputFieldRef.current.value != "") {
      selectRef.current.value === "encode"
        ? (outputFieldRef.current.value = encode())
        : (outputFieldRef.current.value = decode());
    } else outputFieldRef.current.value = "";
  }
  return (
    <>
      <Header setService={setService} />
      <main className="wrapper">
        <h1>Ascii85</h1>
        <textarea
          id="input-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="Your text goes here..."
          onInput={() => triggerFn()}
          ref={inputFieldRef}
        ></textarea>
        <select onInput={() => triggerFn()} ref={selectRef}>
          <option value="encode" id="encode">
            encode
          </option>
          <option value="decode" id="decode">
            decode
          </option>
        </select>

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
        <h1>What is Ascii85(Base85)?</h1>
        <p>
          Ascii85, also called Base85, is a form of binary-to-text encoding
          developed by Paul E. Rutter for the btoa utility. By using five ASCII
          characters to represent four bytes of binary data (making the encoded
          size 1/4 larger than the original, assuming eight bits per ASCII
          character), it is more efficient than uuencode or Base64, which use
          four characters to represent three bytes of data (1/3 increase,
          assuming eight bits per ASCII character).
        </p>
        <p>
          Its main modern uses are in Adobe's PostScript and Portable Document
          Format file formats, as well as in the patch encoding for binary files
          used by Git.
        </p>

        <a href="https://en.wikipedia.org/wiki/Ascii85" target="_blank">
          read more
        </a>
      </section>
      <Footer />
    </>
  );
}
//0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#
