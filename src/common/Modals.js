import React, { useRef } from "react";
import Modules from "../modules";
import Button from "./Button";
import { v4 as uuidv4 } from "uuid";
import gsap from "gsap";
const [overlay, modal2] = [useRef(null), useRef(null)];
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
function addPipeHandler(info, opsList) {
  //uuid exists because there could be more than one instance of the same module in a chain
  let newOp = {
    ...info,
    id: uuidv4(),
  };

  let newOpsList = opsList.get.concat(newOp);
  opsList.set(newOpsList);
}
function Modals({ helpers, opsList, setOutputBinary, modalAnim }) {
  return (
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
                  .sort((a, b) => a.title.toUpperCase() > b.title.toUpperCase())
                  .map((object, i) => {
                    return (
                      <Button
                        key={i}
                        info={{ ...object }}
                        opsList={opsList}
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
              opsList.set(
                opsList.get.filter(
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
  );
}

export default {
  jsx: Modals,
  functions: { modalAnim: modalAnim, addPipeHandler: addPipeHandler },
};
