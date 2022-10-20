import { useEffect, useRef, useState } from "react";

export default function OpBoilerplate({
  Component,
  opInfo,
  opsList,
  inputBinary,
  setInputBinary,
  outputBinary,
  setOutputBinary,
  count,
  setCount,
  helpers,
  modals,
  outputFieldRef,
}) {
  const opRef = useRef(null);
  const opAdvancedRef = useRef(null);
  const opBriefArrowRef = useRef(null);
  const encodeBtn = useRef(null);
  const decodeBtn = useRef(null);
  let [opType, setOpType] = useState("encode");
  const { dataAttr, title, id, asymmetric, index } = opInfo;

  function clickEventMain(e) {
    const ID = e.target.closest(".op").dataset.id;

    if (/^op-brief(__title| )?/.test(e.target.className)) {
      let currentOp = document.querySelector(`[data-id="${ID}"]`);
      console.log(currentOp);
      /*if (currentOp.classList.contains("opened")) {
        currentOp.classList.remove("opened");
      } else {
        currentOp.classList.add("opened");
      }*/
      currentOp.classList.toggle("opened");
    }
  }
  function clickEventSide(e) {
    if (e.target.classList.contains("encode-btn")) {
      encodeBtn.current.classList.add("active");
      decodeBtn.current.classList.remove("active");
      setOpType("encode");
    } else {
      decodeBtn.current.classList.add("active");
      encodeBtn.current.classList.remove("active");
      setOpType("decode");
    }
  }

  useEffect(() => {
    setCount(index);
    console.log(
      outputBinary.map((x) => String.fromCharCode(Number(`0b${x}`))).join(""),
      index,
      count
    );
  });

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
                  encode
                </button>

                <button
                  className="decode-btn"
                  ref={decodeBtn}
                  onClick={(e) => clickEventSide(e)}
                >
                  decode
                </button>
              </div>
            );
        })()}

        <i
          className="op-brief__arrow fas fa-angle-down"
          ref={opBriefArrowRef}
        ></i>
      </div>
      <div className="op-advanced" ref={opAdvancedRef}>
        <div className="op-advanced-inner">
          <Component
            currentOp={opType}
            opsList={opsList}
            inputBinary={inputBinary}
            setInputBinary={setInputBinary}
            outputBinary={outputBinary}
            setOutputBinary={setOutputBinary}
            count={count}
            outputField={outputFieldRef.current}
            helpers={helpers}
          />
        </div>
      </div>
    </div>
  );
}
