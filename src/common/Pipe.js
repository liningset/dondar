import React, { useRef, useState } from "react";

export default function Pipe({
  setOutputBinary,
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
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    Component,
    identifier,
    title,
    asymmetric,
    descryption,
    guide,
    id,
    index,
  } = opInfo;

  function handlePipeDropdown(event) {
    const ID = event.target.closest(".pipe").dataset.id;

    if (/^pipe-brief(__title|__arrow)?$/.test(event.target.className)) {
      let currentOp = document.querySelector(`[data-id="${ID}"]`);
      currentOp.classList.toggle("opened");
      if (currentOp.classList.contains("opened"))
        opBriefArrowRef.current.className = "fas fa-minus";
      else opBriefArrowRef.current.className = "fas fa-plus";
    }
  }
  function handleEncodeDecode(event) {
    setOpType(opType === "encode" ? "decode" : "encode");
    setOutputBinary(helpers.getFromStorage("inputBins"));
    if (event.target.classList.contains("encode-btn")) {
      encodeBtn.current.classList.add("active");
      decodeBtn.current.classList.remove("active");
    } else {
      decodeBtn.current.classList.add("active");
      encodeBtn.current.classList.remove("active");
    }
  }

  return (
    <div
      className={`pipe ${identifier.toLowerCase()}`}
      data-id={id}
      ref={opRef}
      onClick={(e) => handlePipeDropdown(e)}
    >
      <div className="pipe-brief">
        <button
          className="pipe-brief__remove-btn"
          title="remove"
          onClick={() => {
            modals.main("open", 1);
            modals.side1.current.dataset.todelete = id;
          }}
        >
          <i className="fas fa-trash"></i>
        </button>
        <span className="pipe-brief__title">
          {index + 1}. {title}
        </span>
        {(() => {
          if (asymmetric)
            return (
              <div className="pipe-brief__conversiontype">
                <button
                  className="encode-btn active"
                  ref={encodeBtn}
                  onClick={(e) => handleEncodeDecode(e)}
                >
                  ENCODE
                </button>

                <button
                  className="decode-btn"
                  ref={decodeBtn}
                  onClick={(e) => handleEncodeDecode(e)}
                >
                  DECODE
                </button>
              </div>
            );
        })()}

        <i className="pipe-brief__arrow fas fa-plus" ref={opBriefArrowRef}></i>
      </div>
      <div className="pipe-advanced-wrapper">
        <div className="pipe-advanced" ref={opAdvancedRef}>
          <div className="pipe-advanced-inner">
            <Component
              currentOp={opType}
              isDisabled={isDisabled}
              opInfo={opInfo}
              setOutputBinary={setOutputBinary}
              outputField={outputFieldRef.current}
              helpers={helpers}
            />
          </div>
          <div className="pipe-footer">
            <div className="pipe-footer__left">
              <button
                className="pipe-descryption-btn"
                title="Descryption"
                onClick={() => {
                  document.querySelector(".info").innerHTML = descryption;
                  modals.main("open", 2);
                }}
              >
                <i className="fas fa-info-circle"></i>
              </button>
              <button
                className="pipe-guide-btn"
                title="Guide"
                onClick={() => {
                  document.querySelector(".guide").innerHTML = guide;
                  modals.main("open", 3);
                }}
              >
                <i className="fas fa-question-circle"></i>
              </button>
            </div>
            <div className="pipe-footer__right">
              <button
                className="disable-btn"
                title={`When Off, "${
                  index + 1
                }. ${title}" will be skipped in the chain of operations.`}
                onClick={(e) => {
                  if (isDisabled) {
                    setIsDisabled(false);
                    //e.target.style.color = "#47ce35";
                    setOutputBinary(helpers.getFromStorage("inputBins"));
                  } else {
                    setIsDisabled(true);
                    //e.target.style.color = "#ce3535";
                    setOutputBinary(helpers.getFromStorage("inputBins"));
                  }
                }}
              >
                {isDisabled ? "Inactive" : "Active"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
