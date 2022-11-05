import { useEffect, useRef, useState } from "react";

export default function OpBoilerplate({
  Component,
  setOutputBinary,
  setHaltedAt,
  opInfo,
  helpers,
  modals,
  outputFieldRef,
}) {
  const opRef = useRef(null);
  const opAdvancedRef = useRef(null);
  const opBriefArrowRef = useRef(null);
  const encodeBtn = useRef(null);
  const decodeBtn = useRef(null);
  const [opType, setOpType] = useState("encode");
  const [descryption, setDescryption] = useState("");
  const { dataAttr, title, id, asymmetric, index } = opInfo;

  function clickEventMain(e) {
    const ID = e.target.closest(".op").dataset.id;

    if (/^op-brief(__title|__arrow)?$/.test(e.target.className)) {
      let currentOp = document.querySelector(`[data-id="${ID}"]`);
      currentOp.classList.toggle("opened");
      if (currentOp.classList.contains("opened"))
        opBriefArrowRef.current.className = "fas fa-minus";
      else opBriefArrowRef.current.className = "fas fa-plus";
    }
  }
  function clickEventSide(e) {
    setOpType(opType === "encode" ? "decode" : "encode");
    setOutputBinary(helpers.getFromStorage("inputBins"));
    if (e.target.classList.contains("encode-btn")) {
      encodeBtn.current.classList.add("active");
      decodeBtn.current.classList.remove("active");
    } else {
      decodeBtn.current.classList.add("active");
      encodeBtn.current.classList.remove("active");
    }
  }

  return (
    <div
      className={`op ${dataAttr.toLowerCase()}`}
      data-id={id}
      ref={opRef}
      onClick={(e) => clickEventMain(e)}
    >
      <div className="op-brief">
        <button
          className="op-brief__remove-btn"
          title="remove"
          onClick={() => {
            modals.main("open", 1);
            modals.side1.current.dataset.todelete = id;
          }}
        >
          <i className="fas fa-times"></i>
        </button>
        <span className="op-brief__title">
          {index + 1}. {title}
        </span>
        {(() => {
          if (asymmetric)
            return (
              <div className="op-brief__conversiontype">
                <button
                  className="encode-btn active"
                  ref={encodeBtn}
                  onClick={(e) => clickEventSide(e)}
                >
                  ENCODE
                </button>

                <button
                  className="decode-btn"
                  ref={decodeBtn}
                  onClick={(e) => clickEventSide(e)}
                >
                  DECODE
                </button>
              </div>
            );
        })()}

        <i className="op-brief__arrow fas fa-plus" ref={opBriefArrowRef}></i>
      </div>
      <div className="op-advanced" ref={opAdvancedRef}>
        <div className="op-advanced-inner">
          <Component
            currentOp={opType}
            opInfo={opInfo}
            setHaltedAt={setHaltedAt}
            setOutputBinary={setOutputBinary}
            setDescryption={setDescryption}
            outputField={outputFieldRef.current}
            helpers={helpers}
          />
        </div>
        <div className="op-related-btns">
          <button
            className="op-descryption-btn"
            title="Descryption"
            onClick={() => {
              modals.main("open", 2);
            }}
          >
            <i className="fas fa-info-circle"></i>
          </button>
          <button className="op-notes-btn" title="Notes">
            <i className="fas fa-thumbtack"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
