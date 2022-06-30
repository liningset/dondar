import { React, useState } from "react";
import Base64 from "./components/base64/Base64";
import Vigenere from "./components/vigenere/Vigenere";
import Reverse from "./components/reverse/Reverse";
import Rot from "./components/rot/Rot";
import Morse from "./components/morse/Morse";
import Braille from "./components/braille/Braille";
import Home from "./Home";
import Navbar from "./components/Navbar";

export default function App() {
  const [service, setService] = useState("");

  if (service === "") return <Home setService={setService} />;
  else if (service === "rot") return <Rot />;
  else if (service === "vigenere") return <Vigenere />;
  else if (service === "base64") return <Base64 />;
  else if (service === "reverse") return <Reverse />;
  else if (service === "morse") return <Morse />;
  else if (service === "braille") return <Braille />;
}
