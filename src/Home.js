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
          <h3>Encryption</h3>
          <div className="buttons-grid encryption-grid">
            <Button classN="a1z26" text="A1Z26" clickEvent={CE} />
            <Button classN="caesar" text="Caesar cipher" clickEvent={CE} />
            <Button classN="rot13" text="ROT-13" clickEvent={CE} />
            <Button
              classN="alphabeticalsub"
              text="Substitution Cipher"
              clickEvent={CE}
            />
            <Button classN="vigenere" text="Vigenère cipher" clickEvent={CE} />
            <Button classN="xor" text="XOR cipher" clickEvent={CE} />
          </div>
        </div>

        <div className="category encoding">
          <h3>Encoding</h3>
          <div className="buttons-grid encoding-grid">
            <Button classN="ascii85" text="Ascii85" clickEvent={CE} />
            <Button classN="base32" text="Base32" clickEvent={CE} />
            <Button classN="base64" text="Base64" clickEvent={CE} />
            <Button
              classN="unicodepoints"
              text="Unicode code points"
              clickEvent={CE}
            />
            <Button classN="urlencoding" text="URL encoding" clickEvent={CE} />
          </div>
        </div>

        <div className="category transform">
          <h3>Transform</h3>
          <div className="buttons-grid text-grid">
            <Button
              classN="bitwiseoperation"
              text="Bitwise operation"
              clickEvent={CE}
            />
            <Button
              classN="casetransform"
              text="Case transform"
              clickEvent={CE}
            />
            <Button
              classN="numeralsystem"
              text="Numeral system"
              clickEvent={CE}
            />
            <Button classN="replace" text="Replace" clickEvent={CE} />
            <Button classN="reverse" text="Reverse" clickEvent={CE} />
          </div>
        </div>

        <div className="category alphabet">
          <h3>Alphabet</h3>
          <div className="buttons-grid alphabet-grid">
            <Button classN="braille" text="Braille" clickEvent={CE} />
            <Button classN="morse" text="Morse code" clickEvent={CE} />
            <Button
              classN="spellingalphabet"
              text="Spelling alphabet"
              clickEvent={CE}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
