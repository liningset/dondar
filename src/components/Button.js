import { useRef } from "react";

export default function Button({ classN, text, clickEvent }) {
  return (
    <button
      className={`button ${classN}`}
      onClick={() => {
        clickEvent(classN);
        window.scrollTo(0, 0);
      }}
    >
      {text}
    </button>
  );
}
