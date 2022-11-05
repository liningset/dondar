import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Button from "./components/Button";
import Header from "./components/Header";
import Footer from "./components/Footer";
import OpGenerate from "./OpGenerate";
import Ascii85 from "./components/ascii85/Ascii85";
import Base64 from "./components/base64/Base64";
import Base32 from "./components/base32/Base32";
import Vigenere from "./components/vigenere/Vigenere";
import Reverse from "./components/reverse/Reverse";
import A1Z26 from "./components/a1z26/A1Z26";
import Caesar from "./components/caesar/Caesar";
import Rot13 from "./components/rot/Rot13";
import Morse from "./components/morse/Morse";
import Braille from "./components/braille/Braille";
import Xor from "./components/xor/Xor";
import Replace from "./components/replace/Replace";
import SpellingAlphabet from "./components/spellingalphabet/SpellingAlphabet";
import CaseTransform from "./components/casetransform/CaseTransform";
import BitwiseOperation from "./components/bitwiseoperation/BitwiseOperation";
import NumeralSystem from "./components/numeralsystem/NumeralSystem";
import AlphabeticalSub from "./components/alphabeticalsub/AlphabeticalSub";
import UnicodePoints from "./components/unicodepoints/UnicodePoints";
import UrlEncoding from "./components/urlencoding/UrlEncoding";

export default function Home({ setService }) {
  const [selectInFormatRef, selectOutFormatRef] = [useRef(null), useRef(null)];
  const [inputFieldRef, outputFieldRef] = [useRef(null), useRef(null)];
  const opsContainer = useRef(null);
  const [overlay, modal2] = [useRef(null), useRef(null)];
  const [opsList, setOpsList] = useState([]);
  const [inputBinary, setInputBinary] = useState([]);
  const [outputBinary, setOutputBinary] = useState([]);
  const [haltedAt, setHaltedAt] = useState([]);
  const [descryptionMain, setDescryptionMain] = useState("");

  const importsArr = [
    { comp: Ascii85, category: "encoding", title: "Ascii85", asymmetric: true },
    { comp: Base64, category: "encoding", title: "Base64", asymmetric: true },
    { comp: Base32, category: "encoding", title: "Base32", asymmetric: true },
    {
      comp: Vigenere,
      category: "encryption",
      title: "Vigenère cipher",
      asymmetric: true,
    },
    {
      comp: Reverse,
      category: "transform",
      title: "Reverse",
      asymmetric: false,
    },
    { comp: A1Z26, category: "encryption", title: "A1Z26", asymmetric: true },
    {
      comp: Caesar,
      category: "encryption",
      title: "Caesar cipher",
      asymmetric: true,
    },
    { comp: Rot13, category: "encryption", title: "ROT-13", asymmetric: false },
    {
      comp: Morse,
      category: "encoding",
      title: "Morse code",
      asymmetric: true,
    },
    { comp: Braille, category: "alphabet", title: "Braille", asymmetric: true },
    {
      comp: Xor,
      category: "encryption",
      title: "XOR cipher",
      asymmetric: false,
    },
    {
      comp: Replace,
      category: "transform",
      title: "Replace",
      asymmetric: false,
    },
    {
      comp: SpellingAlphabet,
      category: "alphabet",
      title: "Spelling alphabet",
      asymmetric: true,
    },
    {
      comp: CaseTransform,
      category: "transform",
      title: "Case transform",
      asymmetric: false,
    },
    {
      comp: BitwiseOperation,
      category: "transform",
      title: "Bitwise operation",
      asymmetric: false,
    },
    {
      comp: NumeralSystem,
      category: "transform",
      title: "Numeral system",
      asymmetric: false,
    },
    {
      comp: AlphabeticalSub,
      category: "encryption",
      title: "Substitution cipher",
      asymmetric: false,
    },
    {
      comp: UnicodePoints,
      category: "encoding",
      title: "Unicode code points",
      asymmetric: true,
    },
    {
      comp: UrlEncoding,
      category: "encoding",
      title: "URL encoding",
      asymmetric: true,
    },
  ];

  const helpers = {
    lengthen: function (input, padWith) {
      const arr = input.split("");
      while (arr.length % 8 !== 0) {
        arr.unshift(padWith);
      }
      return arr.join("");
    },
    uuid: function () {
      const hashTable = "abcdef0123456789";
      let uuid = [];
      for (let i = 0; i < 35; i++) {
        i === 7 || i === 12 || i === 17 || i === 22
          ? (uuid[i] = "-")
          : (uuid[i] =
              hashTable[Math.floor(Math.random() * hashTable.length - 1)]);
      }
      return uuid.join("");
    },
    updateStorage: function (slots) {
      Object.entries(slots).forEach(([key, value]) => {
        sessionStorage.setItem(key, JSON.stringify(value));
      });
    },
    getFromStorage: function (input) {
      return typeof input === "string"
        ? JSON.parse(sessionStorage.getItem(input))
        : input.map((slot) => JSON.parse(sessionStorage.getItem(slot)));
    },
  };
  helpers.charToBin = function (input) {
    return typeof input === "string"
      ? helpers.lengthen(input.charCodeAt(0).toString(2), "0")
      : input.map((char) =>
          helpers.lengthen(char.charCodeAt(0).toString(2), "0")
        );
  };
  helpers.binToChar = function (input) {
    return typeof input === "string"
      ? String.fromCharCode(Number(`0b${input}`))
      : input.map((octet) => String.fromCharCode(Number(`0b${octet}`)));
  };

  helpers.toUTF8 = function () {};

  helpers.updateStorage({
    opsList: opsList,
    inputBins: inputBinary,
    outputBins: outputBinary,
    haltedAt: [],
    descryptionMain: "",
  });

  function introAnim() {
    try {
      let tl = gsap.timeline();
      tl.fromTo(
        "h3",
        0.5,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, stagger: 0.25 }
      );
    } catch {
      document
        .querySelectorAll("#root > *")
        .forEach((el) => (el.style.opacity = "1"));
    }
  }

  function modalAnim(type, indexOfChild) {
    if (type === "open")
      gsap.set(overlay.current.children[indexOfChild], { display: "grid" });

    try {
      let tl = gsap.timeline();
      tl.fromTo(
        overlay.current,
        0.25,
        {
          opacity: type === "open" ? 0 : 1,
          pointerEvents: type === "open" ? "none" : "auto",
        },
        {
          opacity: type === "open" ? 1 : 0,
          pointerEvents: type === "open" ? "auto" : "none",
        }
      ).fromTo(
        overlay.current.children[indexOfChild],
        0.25,
        {
          scale: type === "open" ? "1.125" : "1",
        },
        {
          scale: type === "open" ? "1" : "1.125",
          onComplete: () => {
            overlay.current.children[indexOfChild].scrollTo(0, 0);

            document.body.style.overflowY = type === "open" ? "hidden" : "auto";
            if (type === "close") {
              overlay.current.children[indexOfChild].style.display = "none";
              overlay.current.children[indexOfChild].dataset.active = false;
            } else overlay.current.children[indexOfChild].dataset.active = true;
          },
        },
        "-=0.25"
      );
    } catch {
      overlay.current.style.pointerEvents = type === "open" ? "auto" : "none";
      overlay.current.style.opacity = type === "open" ? 1 : 0;
      overlay.current.children[indexOfChild].scrollTo(0, 0);
      document.body.style.overflowY = type === "open" ? "hidden" : "auto";
    }
  }

  function handleInFormatSwap(value) {
    let inputBinary = helpers.getFromStorage("inputBins");
    let display;
    switch (value) {
      case "binary":
        display = inputBinary.join(" ");
        break;

      case "text":
        display = helpers.binToChar(inputBinary).join("");
        break;

      case "hex":
        display = inputBinary
          .map((octet) => Number(`0b${octet}`).toString(16))
          .join(" ");
        break;
    }
    inputFieldRef.current.value = display;
  }

  function handleOutFormatSwap(value) {
    let outputBinary = helpers.getFromStorage("outputBins");
    let display;
    switch (value) {
      case "binary":
        display = outputBinary.join(" ");
        break;

      case "text":
        display = display = helpers.binToChar(outputBinary).join("");
        break;

      case "hex":
        display = outputBinary
          .map((octet) => Number(`0b${octet}`).toString(16))
          .join(" ");
        break;
    }
    outputFieldRef.current.value = display;
  }

  function menuBtnHandler(info) {
    //let arr = helpers.getFromStorage(["opsList", "inputBins"]);
    let newOp = {
      ...info,
      id: helpers.uuid(),
    };
    newOp.asymmetric = importsArr.find(
      (x) => x.comp.name === newOp.dataAttr
    ).asymmetric;
    let newOpsList = opsList.concat(newOp);
    //helpers.updateStorage({ outputBins: arr[1], opsList: newOpsList });
    setOpsList(newOpsList);
    //setRender(render + 1);
  }

  function inputChangeHandler() {
    let extractedInputBins = helpers.charToBin(
      inputFieldRef.current.value.split("")
    );
    helpers.updateStorage({
      inputBins: extractedInputBins,
      outputBins: extractedInputBins,
    });
    [setInputBinary, setOutputBinary].forEach((fn) => fn(extractedInputBins));
  }

  useEffect(() => {
    let outputBinary = helpers.getFromStorage("outputBins");
    let haltedAt = helpers.getFromStorage("haltedAt");
    introAnim();

    if (opsContainer.current.children.length === 0)
      opsContainer.current.parentElement.style.gap = "0";
    else opsContainer.current.parentElement.style.gap = "0.5rem";

    if (haltedAt.length === 0) {
      outputFieldRef.current.setAttribute("placeholder", "The output");
      switch (selectOutFormatRef.current.value) {
        case "binary":
          outputFieldRef.current.value = outputBinary.join(" ");
          break;

        case "text":
          outputFieldRef.current.value = helpers
            .binToChar(outputBinary)
            .join("");
          break;

        case "hex":
          outputFieldRef.current.value = outputBinary
            .map((x) => Number(`0b${x}`).toString(16))
            .join(" ");
          break;
      }
    } else {
      outputFieldRef.current.value = "";
      outputFieldRef.current.setAttribute(
        "placeholder",
        `${haltedAt.map((obj) => `${obj.at + obj.error}\n`).join("")}`
      );
    }
  });

  return (
    <>
      <div
        className="overlay"
        onClick={(e) => {
          if (e.target.className === "overlay") {
            modalAnim(
              "close",
              [...e.target.children].indexOf(
                [...e.target.children].find((x) => x.dataset.active === "true")
              )
            );
            e.target.dataset.active = "false";
          }
        }}
        ref={overlay}
      >
        <div className="modal" data-active="false">
          <button
            className="close-modal-btn"
            onClick={() => modalAnim("close", 0)}
          >
            <i className="fas fa-times"></i>
          </button>

          {["encryption", "encoding", "transform", "alphabet"].map(
            (category, index) => {
              return (
                <div className={`category ${category}`} key={index}>
                  <h3>{category[0].toUpperCase() + category.substring(1)}</h3>
                  <div className={`buttons-grid ${category}-grid`}>
                    {importsArr
                      .filter((x) => x.category === category)
                      .map((object, i) => {
                        return (
                          <Button
                            key={i}
                            info={{
                              dataAttr: object.comp.name,
                              title: object.title,
                            }}
                            functions={{
                              clickEvent: menuBtnHandler,
                              closeModal: modalAnim,
                            }}
                          />
                        );
                      })}
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div className="modal2" ref={modal2} data-active="false">
          <span>
            Are you sure you want to remove this element from the chain?
          </span>
          <div className="modal2-options">
            <button
              className="modal2-yes"
              onClick={() => {
                setOpsList(
                  opsList.filter(
                    (x) => x.id !== modal2.current.dataset.todelete
                  )
                );
                setOutputBinary(helpers.getFromStorage("inputBins"));
                modalAnim("close", 1);
              }}
            >
              Yes
            </button>
            <button className="modal2-no" onClick={() => modalAnim("close", 1)}>
              No
            </button>
          </div>
        </div>

        <div className="modal3" data-active="false">
          <button
            className="close-modal-btn"
            onClick={() => modalAnim("close", 2)}
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="info">{}</div>
        </div>
      </div>

      <button
        data-scrollto="up"
        id="scroll-btn"
        onClick={(e) => {
          let target = e.target;
          if (target.dataset.scrollto === "up") {
            target.dataset.scrollto = "down";
            window.scrollTo(0, document.body.scrollHeight);
          } else {
            target.dataset.scrollto = "up";
            window.scrollTo(0, 0);
          }
        }}
      >
        <i className="fas fa-arrow-down"></i>{" "}
      </button>

      <Header setService={setService} />
      <main className="wrapper">
        <div className="adjustments">
          <div className="adjustment">
            <span>Input view: </span>
            <select
              ref={selectInFormatRef}
              onInput={(e) => handleInFormatSwap(e.target.value)}
            >
              <optgroup label="UTF-8">
                <option value="text">Text</option>
                <option value="binary">Binary</option>
                <option value="hex">Hexadecimal</option>
              </optgroup>
            </select>
          </div>
          <div className="adjustment">
            <span>Output view: </span>
            <select
              ref={selectOutFormatRef}
              onInput={(e) => handleOutFormatSwap(e.target.value)}
            >
              <optgroup label="UTF-8">
                <option value="text">Text</option>
                <option value="binary">Binary</option>
                <option value="hex">Hexadecimal</option>
              </optgroup>
            </select>
          </div>
        </div>
        <textarea
          id="input-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="Your input"
          ref={inputFieldRef}
          onInput={() => inputChangeHandler()}
        ></textarea>
        <div className="conversion-details">
          <div className="ops-container" ref={opsContainer}>
            {opsList.map((op, index) => {
              return (
                <>
                  <OpGenerate
                    key={index}
                    Component={
                      importsArr.find((x) => x.comp.name === op.dataAttr).comp
                    }
                    setOutputBinary={setOutputBinary}
                    setHaltedAt={setHaltedAt}
                    opInfo={{ ...op, index }}
                    helpers={helpers}
                    modals={{ main: modalAnim, side1: modal2 }}
                    outputFieldRef={outputFieldRef}
                  />
                  {(() => {
                    if (opsList.length - 1 !== index)
                      return (
                        <img src="./chain.svg" className="chain" alt="chain" />
                      );
                  })()}
                </>
              );
            })}
          </div>
          <button
            id="add-op"
            onClick={() => modalAnim("open", 0)}
            title="add tool to the chain."
          >
            <i className="fas fa-plus"></i>
          </button>
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
