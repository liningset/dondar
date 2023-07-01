import React from "react";

export default function Button({ info, opsList, functions }) {
  const title = info.title;
  const { clickEvent, closeModal } = functions;
  return (
    <button
      className="button"
      onClick={() => {
        clickEvent(info, opsList);
        closeModal("close", 0);
      }}
    >
      {title}
    </button>
  );
}
