import React, { useEffect, useRef } from "react";

export default function Reverse({ helpers, isDisabled, setOutputBinary }) {
  const typeRef = useRef(null);
  const normal =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!&()_[]{}?<>.,'".split(
      ""
    );
  const upsideDown =
    "∀ꓭϽᗡƎᖵ⅁HIᒋꓘ⅂ꟽNOԀꝹꓤSꓕՈɅϺX⅄Zɐqɔpǝⅎƃɥᴉɾʞʅɯuodbɹsʇnʌʍxʎz¡⅋)(‾][}{¿><˙',".split(
      ""
    );

  function validate(input) {
    return typeRef.current.value === "line"
      ? input.length > 0 && input.some((b) => b === "00001010")
      : input.length > 0;
  }

  function triggerFn() {
    const inputBinary = helpers.getFromStorage("outputBins");
    if (validate(inputBinary)) {
      switch (typeRef.current.value) {
        case "char":
          helpers.updateStorage({
            outputBins: helpers.charToBin(
              helpers.binToChar(inputBinary).reverse()
            ),
          });
          break;

        case "byte":
          helpers.updateStorage({
            outputBins: inputBinary.reverse(),
          });
          break;

        case "line":
          helpers.updateStorage({
            outputBins: helpers.charToBin(
              helpers
                .binToChar(inputBinary)
                .join("")
                .match(/^.*$/gm)
                .reverse()
                .join("\n")
                .split("")
            ),
          });

          break;

        case "flip":
          let arr = helpers.binToChar(inputBinary).map((char) => {
            if ([normal, upsideDown].some((set) => set.includes(char))) {
              if (normal.includes(char)) {
                return upsideDown[normal.indexOf(char)];
              } else return normal[upsideDown.indexOf(char)];
            } else {
              return char;
            }
          });
          console.log(arr.reverse().join(""));
          helpers.updateStorage({
            outputBins: helpers.charToBin(arr),
          });
          break;
      }
    }
  }

  useEffect(() => {
    if (!isDisabled) triggerFn();
  });

  return (
    <div className="div">
      <span>Reverse by</span>
      <select
        ref={typeRef}
        onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
      >
        <option value="char">Characters</option>
        <option value="byte">Bytes</option>
        <option value="line">Lines</option>
        <option value="flip">Characters + upside down</option>
      </select>
    </div>
  );
}
