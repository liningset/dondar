import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import gsap from "gsap";
import Button from "./common/Button";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Pipe from "./common/Pipe";
import Modules from "./modules";
import IOField from "./common/IOField";

export default function Home() {
  const [selectInFormatRef, selectOutFormatRef] = [useRef(null), useRef(null)];
  const [inputFieldRef, outputFieldRef] = [useRef(null), useRef(null)];
  const opsContainer = useRef(null);
  const [overlay, modal2] = [useRef(null), useRef(null)];
  const [opsList, setOpsList] = useState([]);
  const [inputBinary, setInputBinary] = useState([]);
  const [outputBinary, setOutputBinary] = useState([]);
  const [inputGroupByRef, outputGroupByRef] = [useRef(null), useRef(null)];
  const copyNotifRef = useRef(null);

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
      return [...encoder.encode(input.join(""))].map((octet) =>
        this.lengthen(octet.toString(2), "0")
      );
    },
    //args: binToChar(<array>)
    binToChar(input) {
      if (typeof input === "string") input = [input];
      let decoder = new TextDecoder("utf-8");
      let result = decoder.decode(
        new Uint8Array(input.map((x) => Number(`0b${x}`)))
      );
      return result.split("");
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

  function copyOutputToInputHandler() {
    inputFieldRef.current.value = outputFieldRef.current.value;
    inputChangeHandler();
  }

  function reverseOpsHandler() {
    setOpsList(opsList.reverse());
    helpers.updateStorage({ opsList: opsList });
    inputChangeHandler();
  }

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

      <div className="copy-notif" ref={copyNotifRef}>
        Not Copied
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
        <IOField
          fieldRef={inputFieldRef}
          title="Input"
          helpers={helpers}
          selectFormatRef={selectInFormatRef}
          groupByRef={inputGroupByRef}
          inputChangeHandler={inputChangeHandler}
          opsContainer={opsContainer}
          copyNotifRef={copyNotifRef}
        />

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
          <div className="buttons">
            <button
              id="add-pipe-btn"
              onClick={() => modalAnim("open", 0)}
              title="Add Operation"
            >
              <i className="fas fa-plus"></i>
            </button>
            <button
              id="swap-fields-btn"
              title="Copy the output of second field to first field (this option combined with the 'reverse operations' button effectively swaps places between input and output)"
              onClick={() => copyOutputToInputHandler()}
            >
              <i className="fas fa-exchange-alt"></i>
            </button>
            <button
              id="invert-ops-btn"
              title="Reverse the order of operations. (this option combined with the 'copy output to input' button effectively swaps places between input and output)"
              onClick={() => reverseOpsHandler()}
            >
              <i className="fas fa-sort"></i>
            </button>
          </div>
        </div>
        <IOField
          fieldRef={outputFieldRef}
          title="Output"
          helpers={helpers}
          selectFormatRef={selectOutFormatRef}
          groupByRef={outputGroupByRef}
          inputChangeHandler={inputChangeHandler}
          opsContainer={opsContainer}
          copyNotifRef={copyNotifRef}
        />
      </main>
      <Footer />
    </>
  );
}
