import { React, useEffect, useState } from "react";
import Ascii85 from "./components/ascii85/Ascii85";
import Base64 from "./components/base64/Base64";
import Base32 from "./components/base32/Base32";
import Vigenere from "./components/vigenere/Vigenere";
import Reverse from "./components/reverse/Reverse";
import A1Z26 from "./components/a1z26/A1Z26";
import Caesar from "./components/caesar/Caesar";
import Rot13 from "./components/rot/Rot13";
import Morse from "./components/morse/Morse";
import Braille from "./components/braille/Braille";
import Xor from "./components/xor/Xor";
import Replace from "./components/replace/Replace";
import SpellingAlphabet from "./components/spellingalphabet/SpellingAlphabet";
import CaseTransform from "./components/casetransform/CaseTransform";
import BitwiseOperation from "./components/bitwiseoperation/BitwiseOperation";
import NumeralSystem from "./components/numeralsystem/NumeralSystem";
import Home from "./Home";
import gsap from "gsap";

export default function App() {
  const [service, setService] = useState(sessionStorage.getItem("service"));
  let serviceToLoad = service;

  useEffect(() => {
    try {
      gsap
        .timeline({ defaults: { duration: 0.5 } })
        .fromTo("#root > main", { opacity: 0, y: -50 }, { opacity: 1, y: 0 })
        .fromTo(
          "#root > section",
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0 },
          "-=0.5"
        )
        .fromTo(
          "#root > header",
          { opacity: 0, y: "-100%" },
          { opacity: 1, y: 0 },
          "-=0.25"
        )
        .fromTo(
          "#root > footer",
          { opacity: 0, y: "100%" },
          { opacity: 1, y: 0 },
          "-=0.5"
        );
    } catch {
      document
        .querySelectorAll("#root > *")
        .forEach((el) => (el.style.opacity = "1"));
    }
  });

  try {
    switch (serviceToLoad) {
      case "":
      case null: {
        return <Home setService={setService} />;
        break;
      }
      case "a1z26": {
        return <A1Z26 setService={setService} />;
        break;
      }
      case "caesar": {
        return <Caesar setService={setService} />;
        break;
      }
      case "vigenere": {
        return <Vigenere setService={setService} />;
        break;
      }
      case "xor": {
        return <Xor setService={setService} />;
        break;
      }
      case "ascii85": {
        return <Ascii85 setService={setService} />;
        break;
      }
      case "base64": {
        return <Base64 setService={setService} />;
        break;
      }
      case "base32": {
        return <Base32 setService={setService} />;
        break;
      }
      case "braille": {
        return <Braille setService={setService} />;
        break;
      }
      case "morse": {
        return <Morse setService={setService} />;
        break;
      }
      case "reverse": {
        return <Reverse setService={setService} />;
        break;
      }
      case "replace": {
        return <Replace setService={setService} />;
        break;
      }
      case "replace": {
        return <Replace setService={setService} />;
        break;
      }
      case "spellingalphabet": {
        return <SpellingAlphabet setService={setService} />;
        break;
      }
      case "casetransform": {
        return <CaseTransform setService={setService} />;
        break;
      }
      case "bitwiseoperation": {
        return <BitwiseOperation setService={setService} />;
        break;
      }
      case "rot13": {
        return <Rot13 setService={setService} />;
        break;
      }
      case "numeralsystem": {
        return <NumeralSystem setService={setService} />;
        break;
      }
    }
  } catch {
    return <h1>Oops. Something went wrong :(</h1>;
  }
}
