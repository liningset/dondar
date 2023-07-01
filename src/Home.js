import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import gsap from "gsap";
import Button from "./common/Button";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Pipe from "./common/Pipe";
import Modules from "./modules";
import FieldConfigBox from "./common/FieldConfigBox";

export default function Home() {
  const [selectInFormatRef, selectOutFormatRef] = [useRef(null), useRef(null)];
  const [inputFieldRef, outputFieldRef] = [useRef(null), useRef(null)];
  const opsContainer = useRef(null);
  const [overlay, modal2] = [useRef(null), useRef(null)];
  const [opsList, setOpsList] = useState([]);
  const [inputBinary, setInputBinary] = useState([]);
  const [outputBinary, setOutputBinary] = useState([]);
  const [inputGroupByRef, outputGroupByRef] = [useRef(null), useRef(null)];
  const [currentInputFormat, setCurrentInputFormat] = useState("");
  const [currentOutputFormat, setCurrentOutputFormat] = useState("");
  const [mainHalted, setMainHalted] = useState(false);

  //filers what bit-grouping options to show depending on format
  //recieves string - outputs JSX elements
  function filteredFormatOptionsJSX(format) {
    switch (format) {
      case "binary":
        return (
          <>
            <option value="4">4 bits</option>
            <option value="5">5 bits</option>
            <option value="6">6 bits</option>
            <option value="7">7 bits</option>
            <option value="8" selected>
              byte
            </option>
            <option value="16">2 bytes</option>
            <option value="24">3 bytes</option>
            <option value="32">4 bytes</option>
            <option value="64">8 bytes</option>
          </>
        );
      case "hex":
        return (
          <>
            <option value="4">4 bits</option>
            <option value="8" selected>
              byte
            </option>
            <option value="16">2 bytes</option>
            <option value="24">3 bytes</option>
            <option value="32">4 bytes</option>
            <option value="64">8 bytes</option>
          </>
        );
    }
  }
  /*a utility object that contains repetitive functions used throughout codebase*/
  const helpers = {
    //args: lengthen(<string>, <string>, <number> || 8, <string> || start)
    lengthen: function (input, padWith = "0", padLength = 8, dir = "start") {
      const arr = input.split("");
      while (arr.length % padLength > 0) {
        dir === "start" ? arr.unshift(padWith) : arr.push(padWith);
      }
      return arr.join("");
    },
    //args: updateStorage(<object>)
    updateStorage: function (slots) {
      Object.entries(slots).forEach(([key, value]) => {
        sessionStorage.setItem(key, JSON.stringify(value));
      });
    },
    //args: getFromStorage(<string> || <array>)
    getFromStorage: function (input) {
      return typeof input === "string"
        ? JSON.parse(sessionStorage.getItem(input))
        : input.map((slot) => JSON.parse(sessionStorage.getItem(slot)));
    },
    //args: charToBin(<array>)
    charToBin(input) {
      let encoder = new TextEncoder("utf-8");
      /*return typeof input === "string"
        ? this.lengthen(input.charCodeAt().toString(2), "0")
        : input.map((char) =>
            this.lengthen(char.charCodeAt().toString(2), "0")
          );*/
      return [...encoder.encode(input.join(""))].map((octet) =>
        this.lengthen(octet.toString(2), "0")
      );
    },
    //args: binToChar(<array>)
    binToChar(input) {
      if (typeof input === "string") input = [input];
      // return typeof input === "string"
      //   ? String.fromCharCode(Number(`0b${input}`))
      //   : input.map((octet) => String.fromCharCode(Number(`0b${octet}`)));
      let decoder = new TextDecoder("utf-8");
      let result = decoder.decode(
        new Uint8Array(input.map((x) => Number(`0b${x}`)))
      );
      /*if (/\ufffd/.test(result)) {
        this.haltMessage(
          null,
          `invalid UTF-8 encoded text at 0x${result
            .indexOf("\ufffd")
            .toString(16)
            .padStart(
              2,
              "0"
            )}, switch to binary/hexadecimal format to view the output`
        );
        setMainHalted(true);
        return [""];
      } else {
        setMainHalted(false);*/
      return result.split("");
      //}
    },
    //args: charToBin(<object> || null, <string>)
    haltMessage: function (opInfo, text) {
      helpers.updateStorage({
        haltedAt: [
          ...helpers.getFromStorage("haltedAt"),
          {
            at: opInfo != null ? `${opInfo.index + 1}.${opInfo.title}: ` : "",
            error: text,
          },
        ],
      });
    },
  };

  //initialize entries in session storage
  helpers.updateStorage({
    opsList: opsList,
    inputBins: inputBinary,
    outputBins: outputBinary,
    haltedAt: [],
  });

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

  function groupBytes(node, input, type) {
    let bitsToGroupBy = Number(node.current.value) || 8;

    if (type === "hex") {
      let reg = new RegExp(
        `[\\da-f]{${bitsToGroupBy / 4}}|(?<=[\\da-f]{${
          bitsToGroupBy / 4
        }})[01]+|[\\da-f]+`,
        "gi"
      );
      console.log(
        input.map((octet) =>
          helpers.lengthen(Number(`0b${octet}`).toString(16), "0", 2, "start")
        )
      );

      return input
        .map((octet) =>
          helpers.lengthen(Number(`0b${octet}`).toString(16), "0", 2, "start")
        )
        .join("")
        .match(reg)
        .join(" ");
    } else if (type === "binary") {
      let reg = new RegExp(
        `[01]{${bitsToGroupBy}}|(?<=[01]{${bitsToGroupBy}})[01]+`,
        "g"
      );

      return input.join("").match(reg).join(" ");
    }
  }

  function inputFormatSwapHandler() {
    let inputBinary = helpers.getFromStorage("inputBins");
    let format = selectInFormatRef.current.value;
    setCurrentInputFormat(selectInFormatRef.current.value);

    inputGroupByRef.current.parentElement.className = `groupby-select${
      format !== "text" ? " enabled" : ""
    }`;
    if (inputBinary.length === 0) return;

    setTimeout(() => {
      let display = "";
      switch (format) {
        case "binary":
          console.log(inputGroupByRef.current.value);
          if (inputGroupByRef.current.value === "n") {
            display = inputBinary.join("");
          } else display = groupBytes(inputGroupByRef, inputBinary, "binary");
          break;

        case "text":
          display = helpers.binToChar(inputBinary).join("");
          break;

        case "hex":
          if (inputGroupByRef.current.value === "n") {
            display = inputBinary
              .map((octet) =>
                helpers.lengthen(Number(`0b${octet}`).toString(16), "0", 2)
              )
              .join("");
          } else {
            display = groupBytes(inputGroupByRef, inputBinary, "hex");
          }
      }
      inputFieldRef.current.value = display;
    }, 0);
  }

  function outputFormatSwapHandler() {
    let outputBinary = helpers.getFromStorage("outputBins");
    let format = selectOutFormatRef.current.value;
    setCurrentOutputFormat(selectOutFormatRef.current.value);

    outputGroupByRef.current.parentElement.className = `groupby-select${
      format !== "text" ? " enabled" : ""
    }`;
    if (outputBinary.length === 0) return;

    setTimeout(() => {
      let display = "";
      switch (format) {
        case "binary":
          switch (outputGroupByRef.current.value === "n") {
            case true:
              display = outputBinary.join("");
              break;

            case false:
              display = groupBytes(outputGroupByRef, outputBinary, "binary");
              break;
          }
          break;

        case "text":
          display = helpers.binToChar(outputBinary).join("");
          break;

        case "hex":
          switch (outputGroupByRef.current.value === "n") {
            case true:
              display = outputBinary
                .map((octet) =>
                  helpers.lengthen(Number(`0b${octet}`).toString(16), "0", 2)
                )
                .join("");
              break;

            case false:
              display = groupBytes(outputGroupByRef, outputBinary, "hex");
              break;
          }
          break;
      }
      outputFieldRef.current.value = display;
    }, 0);
  }

  function addPipeHandler(info) {
    //uuid exists because there could be more than one instance of the same module in a chain
    let newOp = {
      ...info,
      id: uuidv4(),
    };

    let newOpsList = opsList.concat(newOp);
    setOpsList(newOpsList);
  }

  function inputChangeHandler() {
    let extractedInputBins = [];
    switch (selectInFormatRef.current.value) {
      case "text":
        extractedInputBins = helpers.charToBin(
          inputFieldRef.current.value.split("")
        );
        break;

      case "binary":
        if (/^([01]{8} ?)+$/.test(inputFieldRef.current.value)) {
          extractedInputBins = inputFieldRef.current.value.match(/[01]{8}/g);
        } else {
          helpers.haltMessage("Invalid binary");
        }
        break;
      case "hex":
        if (/^([\dA-F]{2} ?)+$/i.test(inputFieldRef.current.value))
          extractedInputBins = inputFieldRef.current.value
            .match(/[\dA-F]{2}/gi)
            .map((byte) =>
              helpers.lengthen(Number(`0x${byte}`).toString(2), "0")
            );
        else {
          helpers.haltMessage("Invalid hexadecimal");
        }
        break;
    }
    helpers.updateStorage({
      inputBins: extractedInputBins,
      outputBins: extractedInputBins,
    });
    [setInputBinary, setOutputBinary].forEach((fn) => fn(extractedInputBins));
  }

  useEffect(() => {
    let outputBinary = helpers.getFromStorage("outputBins") || [];
    let haltedAt = helpers.getFromStorage("haltedAt");

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
          if (/\ufffd/.test(helpers.binToChar(outputBinary).join(""))) {
            outputFieldRef.current.value = "";
            outputFieldRef.current.setAttribute(
              "placeholder",
              "invalid UTF-8 encoded data, switch to binary or hexadecimal mode to view the output."
            );
            break;
          }
          outputFieldRef.current.value = helpers
            .binToChar(outputBinary)
            .join("");
          break;

        case "hex":
          outputFieldRef.current.value = outputBinary
            .map((x) => helpers.lengthen(Number(`0b${x}`).toString(16), "0", 2))
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

          {[
            "alphabet",
            "ciphers",
            "encoding",
            "mathematics",
            "modern cryptography",
            "transform",
          ].map((category, index) => {
            return (
              <div className={`category ${category}`} key={index}>
                <h3>{category[0].toUpperCase() + category.substring(1)}</h3>
                <div className={`buttons-grid ${category}-grid`}>
                  {Modules.filter((x) => x.category === category)
                    .sort(
                      (a, b) => a.title.toUpperCase() > b.title.toUpperCase()
                    )
                    .map((object, i) => {
                      return (
                        <Button
                          key={i}
                          info={{ ...object }}
                          functions={{
                            clickEvent: addPipeHandler,
                            closeModal: modalAnim,
                          }}
                        />
                      );
                    })}
                </div>
              </div>
            );
          })}
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

          <div className="info">None</div>
        </div>

        <div className="modal4" data-active="false">
          <button
            className="close-modal-btn"
            onClick={() => modalAnim("close", 3)}
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="guide">None</div>
        </div>
      </div>

      <button
        data-scrollto="up"
        id="scroll-btn"
        title="Scroll down"
        onClick={(e) => {
          let target = e.target;
          target.title = `Scroll ${target.dataset.scrollto}`;
          if (target.dataset.scrollto === "up") {
            target.dataset.scrollto = "down";
            target.title = "scroll up";
            window.scrollTo(0, document.body.scrollHeight);
          } else {
            target.dataset.scrollto = "up";
            target.title = "scroll down";
            window.scrollTo(0, 0);
          }
        }}
      >
        <i className="fas fa-arrow-down"></i>{" "}
      </button>

      <Header />
      <main className="wrapper">
        <div className="input-field field">
          {/* <div className="formatting">
            <h3>Input</h3>
            <div className="formatting__inner">
              <div className="format-select">
                <span>Format</span>
                <select
                  ref={selectInFormatRef}
                  onInput={() => inputFormatSwapHandler()}
                >
                  <option value="text">Text</option>
                  <option value="binary">Binary</option>
                  <option value="hex">Hexadecimal</option>
                </select>
              </div>
              <div className="groupby-select">
                <span>Group by</span>
                <select
                  ref={inputGroupByRef}
                  onInput={() => inputFormatSwapHandler()}
                >
                  <option value="n">none</option>
                  {filteredFormatOptionsJSX(currentInputFormat)}
                </select>
              </div>
            </div>
          </div> */}
          <FieldConfigBox
            title="Input"
            helpers={helpers}
            fieldRef={inputFieldRef}
            selectFormatRef={selectInFormatRef}
            groupByRef={inputGroupByRef}
          />
          <textarea
            id="input-area"
            cols="30"
            rows="10"
            spellCheck="false"
            placeholder="Your input"
            ref={inputFieldRef}
            onInput={() => inputChangeHandler()}
          ></textarea>
        </div>

        <div className="pipeline-wrapper">
          <div className="pipeline" ref={opsContainer}>
            {opsList.map((pipe, index) => {
              return (
                <>
                  <Pipe
                    key={index}
                    setOutputBinary={setOutputBinary}
                    opInfo={{ ...pipe, index }}
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
            id="add-pipe"
            onClick={() => modalAnim("open", 0)}
            title="add tool to the chain."
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>

        <div className="output-field field">
          {/* <div className="formatting">
            <h3>Output</h3>
            <div className="formatting__inner">
              <div className="format-select">
                <span>Format</span>
                <select
                  ref={selectOutFormatRef}
                  onInput={(e) => outputFormatSwapHandler()}
                >
                  <option value="text">Text</option>
                  <option value="binary">Binary</option>
                  <option value="hex">Hexadecimal</option>
                </select>
              </div>
              <div className="groupby-select">
                <span>Group by</span>
                <select
                  ref={outputGroupByRef}
                  onInput={(e) => outputFormatSwapHandler()}
                >
                  <option value="n">none</option>
                  {filteredFormatOptionsJSX(currentOutputFormat)}
                </select>
              </div>
            </div>
          </div> */}
          <FieldConfigBox
            title="Output"
            helpers={helpers}
            fieldRef={outputFieldRef}
            selectFormatRef={selectOutFormatRef}
            groupByRef={outputGroupByRef}
          />
          <textarea
            id="output-area"
            cols="30"
            rows="10"
            spellCheck="false"
            placeholder="Your input"
            ref={outputFieldRef}
          ></textarea>
        </div>
      </main>
      <Footer />
    </>
  );
}
