export default function Button({ classN, text, clickEvent }) {
  return (
    <button className={`button ${classN}`} onClick={() => clickEvent(classN)}>
      {text}
    </button>
  );
}
