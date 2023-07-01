import React, { useState } from "react";

export default function FieldConfigBox({
  title,
  helpers,
  fieldRef,
  selectFormatRef,
  groupByRef,
}) {
  const [currentFormat, setCurrentFormat] = useState("");
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
  function formatSwapHandler(type) {
    let streamOctets = helpers.getFromStorage(`${type}Bins`);
    console.log(streamOctets);
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
  function switchFieldsContent() {}

  return (
    <div className="formatting">
      <h3>{title}</h3>
      {() => {
        if (title === "Output") return <button onClick={0}>h</button>;
      }}
      <div className="formatting__inner">
        <div className="format-select">
          <span>Mode</span>
          <select
            ref={selectFormatRef}
            onInput={() => formatSwapHandler(title.toLowerCase())}
          >
            <option value="text">Text (UTF-8)</option>
            <option value="binary">Binary</option>
            <option value="hex">Hexadecimal</option>
          </select>
        </div>
        <div className="groupby-select">
          <span>Group by</span>
          <select ref={groupByRef} onInput={() => formatSwapHandler()}>
            <option value="n">none</option>
            {filteredFormatOptionsJSX(currentFormat)}
          </select>
        </div>
      </div>
    </div>
  );
}

//<FieldConfigBox title="Input" helpers={helpers} fieldRef={inputFieldRef} />
