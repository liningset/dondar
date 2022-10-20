export default function Button({ info, functions }) {
  const title = info.title;
  const { clickEvent, closeModal } = functions;
  return (
    <button
      className="button"
      onClick={() => {
        clickEvent(info);
        closeModal("close", 0);
      }}
    >
      {title}
    </button>
  );
}
