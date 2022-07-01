import Button from "./components/Button";
import gsap from "gsap";

export default function Home({ setService }) {
  return (
    <main className="home-wrapper">
      <h1>You can convert your text with:</h1>
      <h3>Encryption methods</h3>
      <div className="buttons-grid encryption-grid">
        <Button classN="rot" text="ROT1-25" clickEvent={setService} />
        <Button classN="vigenere" text="Vigenere" clickEvent={setService} />
      </div>

      <h3>Encoding methods</h3>
      <div className="buttons-grid encoding-grid">
        <Button classN="base64" text="Base64" clickEvent={setService} />
        <Button classN="morse" text="Morse code" clickEvent={setService} />
        <Button classN="braille" text="Braille code" clickEvent={setService} />
      </div>

      <h3>Miscellaneous</h3>
      <div className="buttons-grid misc-grid">
        <Button classN="reverse" text="reverse text" clickEvent={setService} />
      </div>
    </main>
  );
}
