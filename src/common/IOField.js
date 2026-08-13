import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function IOField({
  fieldRef,
  title,
  helpers,
  selectFormatRef,
  groupByRef,
  inputChangeHandler,
  opsContainer,
  copyNotifRef,
}) {
  //used to track which format(text/binary/hex) user is currently switched to
  const [currentFormat, setCurrentFormat] = useState("");
  const titleLower = title.toLowerCase();

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
  function groupBytes(node, input, type) {
    let bitsToGroupBy = Number(node.current.value) || 8;

    if (type === "hex") {
      let reg = new RegExp(
        `[\\da-f]{${bitsToGroupBy / 4}}|(?<=[\\da-f]{${
          bitsToGroupBy / 4
        }})[01]+|[\\da-f]+`,
        "gi"
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
  function formatSwitchHandler(type) {
    let streamOctets = helpers.getFromStorage(`${type}Bins`);
    if (streamOctets.length === 0) return;

    let format = selectFormatRef.current.value;
    setCurrentFormat(selectFormatRef.current.value);

    groupByRef.current.parentElement.className = `groupby-select${
      format !== "text" ? " enabled" : ""
    }`;

    setTimeout(() => {
      let display = "";
      switch (format) {
        case "binary":
          if (groupByRef.current.value === "n") {
            display = streamOctets.join("");
          } else display = groupBytes(groupByRef, streamOctets, "binary");
          break;

        case "text":
          display = helpers.binToChar(streamOctets).join("");
          break;

        case "hex":
          if (groupByRef.current.value === "n") {
            display = streamOctets
              .map((octet) =>
                helpers.lengthen(Number(`0b${octet}`).toString(16), "0", 2)
              )
              .join("");
          } else {
            display = groupBytes(groupByRef, streamOctets, "hex");
          }
      }
      fieldRef.current.value = display;
    }, 0);
  }
  function toClipboard(field) {
    let resultText;
    try {
      navigator.clipboard.writeText(field.value);
      resultText = `Copied ${title}`;
    } catch {
      resultText = `Clipboard permission denied`;
    }
    copyNotifRef.current.innerText = resultText;
    copyNotifRef.current.classList.add("moved-notif");
    setTimeout(() => {
      copyNotifRef.current.classList.remove("moved-notif");
    }, 2000);
  }
  function animateCopyToClipboard(e) {
    gsap
      .timeline()
      .to(e.target, 0.15, {
        scale: 0.8,
        onComplete: () => toClipboard(fieldRef.current),
      })
      .to(e.target, 0.15, { scale: 1 });
  }

  useEffect(() => {
    if (title === "Output") {
      let outputBinary = helpers.getFromStorage("outputBins") || [];
      let haltedAt = helpers.getFromStorage("haltedAt");

      if (opsContainer.current.children.length === 0)
        opsContainer.current.parentElement.style.gap = "0";
      else opsContainer.current.parentElement.style.gap = "0.5rem";

      if (haltedAt.length === 0) {
        fieldRef.current.setAttribute("placeholder", "The output");
        switch (selectFormatRef.current.value) {
          case "binary":
            fieldRef.current.value = outputBinary.join(" ");
            break;

          case "text":
            if (/\ufffd/.test(helpers.binToChar(outputBinary).join(""))) {
              fieldRef.current.value = "";
              fieldRef.current.setAttribute(
                "placeholder",
                "invalid UTF-8 encoded data, switch to binary or hexadecimal mode to view the output."
              );
              break;
            }
            fieldRef.current.value = helpers.binToChar(outputBinary).join("");
            break;

          case "hex":
            fieldRef.current.value = outputBinary
              .map((x) =>
                helpers.lengthen(Number(`0b${x}`).toString(16), "0", 2)
              )
              .join(" ");
            break;
        }
      } else {
        fieldRef.current.value = "";
        fieldRef.current.setAttribute(
          "placeholder",
          `${haltedAt.map((obj) => `${obj.at + obj.error}\n`).join("")}`
        );
      }
    }
  });

  return (
    <div className={`${titleLower}-field field`}>
      <div
        className="formatting"
        style={{
          borderTop: `2px solid ${title === "Output" ? "#f35044" : "#31b24b"}`,
        }}
      >
        <div className="title-container">
          <h3>{title}</h3>
          <button
            className="copy-btn"
            title={`Copy ${title}`}
            onClick={(e) => animateCopyToClipboard(e)}
          >
            <i className="fas fa-copy"></i>
          </button>
        </div>
        <div className="formatting__inner">
          <div className="format-select">
            <span>Mode</span>
            <select
              ref={selectFormatRef}
              onInput={() => formatSwitchHandler(title.toLowerCase())}
            >
              <option value="text">Text (UTF-8)</option>
              <option value="binary">Binary</option>
              <option value="hex">Hexadecimal</option>
            </select>
          </div>
          <div className="groupby-select">
            <span>Group by</span>
            <select
              ref={groupByRef}
              onInput={() => formatSwitchHandler(title.toLowerCase())}
            >
              <option value="n">none</option>
              {filteredFormatOptionsJSX(currentFormat)}
            </select>
          </div>
        </div>
      </div>
      <div
        className="color-bar"
        style={{ background: title === "Output" ? "#f35044" : "#31b24b" }}
      ></div>
      {(() => {
        if (title === "Input") {
          return (
            <textarea
              style={{
                borderTop: `2px solid ${
                  title === "Output" ? "#f35044" : "#31b24b"
                }`,
              }}
              id={`${titleLower}-area`}
              cols="30"
              rows="10"
              spellCheck="false"
              placeholder={`Your ${titleLower}`}
              ref={fieldRef}
              onInput={() => inputChangeHandler()}
            ></textarea>
          );
        } else {
          return (
            <textarea
              style={{
                borderTop: `2px solid ${
                  title === "Output" ? "#f35044" : "#31b24b"
                }`,
              }}
              id={`${titleLower}-area`}
              cols="30"
              rows="10"
              spellCheck="false"
              placeholder={`Your ${titleLower}`}
              ref={fieldRef}
            ></textarea>
          );
        }
      })()}
    </div>
  );
}

//<FieldConfigBox title="Input" helpers={helpers} fieldRef={inputref} />
