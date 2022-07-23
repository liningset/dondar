import { useEffect, useRef } from "react";
import gsap from "gsap";
import Button from "./components/Button";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home({ setService }) {
  let homeWrapper = useRef(null);
  function CE(text) {
    setService(text);
  }

  useEffect(() => {
    try {
      let tl = gsap.timeline();
      tl.fromTo(
        "h3",
        0.5,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, stagger: 0.25 }
      );
    } catch {
      document
        .querySelectorAll("#root > *")
        .forEach((el) => (el.style.opacity = "1"));
    }
  });

  return (
    <>
      <Header setService={setService} />
      <main className="home-wrapper" ref={homeWrapper}>
        <div className="category encryption">
          <h3>Encryption methods</h3>
          <div className="buttons-grid encryption-grid">
            <Button classN="a1z26" text="A1Z26" clickEvent={CE} />
            <Button classN="rot" text="ROT1-25" clickEvent={CE} />
            <Button classN="vigenere" text="Vigenère" clickEvent={CE} />
            <Button classN="xor" text="XOR cipher" clickEvent={CE} />
          </div>
        </div>

        <div className="category encoding">
          <h3>Encoding methods</h3>
          <div className="buttons-grid encoding-grid">
            <Button classN="ascii85" text="Ascii85" clickEvent={CE} />
            <Button classN="base32" text="Base32" clickEvent={CE} />
            <Button classN="base64" text="Base64" clickEvent={CE} />
            <Button classN="braille" text="Braille" clickEvent={CE} />
            <Button classN="morse" text="Morse code" clickEvent={CE} />
          </div>
        </div>

        <div className="category misc">
          <h3>Miscellaneous</h3>
          <div className="buttons-grid misc-grid">
            <Button classN="reverse" text="reverse text" clickEvent={CE} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
