import React, { useEffect, useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function AlphabeticalSub({
  opInfo,
  helpers,
  setOutputBinary,
  setDescryption,
}) {
  const plainAlphaRef = useRef(null);
  const cipherAlphaRef = useRef(null);

  function validate() {
    let checkIfNotEmpty = helpers.getFromStorage("outputBins").length !== 0;
    let checkLackOfPlainDuplicate = true;
    let checkLackOfCipherDuplicate = true;

    {
      if (
        plainAlphaRef.current.value
          .split("")
          .some(
            (char) =>
              plainAlphaRef.current.value.match(
                new RegExp(`[\\\\${char}]`, "g")
              ).length > 1
          )
      ) {
        checkLackOfPlainDuplicate = false;
      }

      if (
        cipherAlphaRef.current.value
          .split("")
          .some(
            (char) =>
              cipherAlphaRef.current.value.match(
                new RegExp(`[\\\\${char}]`, "g")
              ).length > 1
          )
      ) {
        checkLackOfCipherDuplicate = false;
      }
    }
    if (
      checkLackOfCipherDuplicate &&
      checkLackOfPlainDuplicate &&
      checkIfNotEmpty
    ) {
      return true;
    } else {
      if (!checkLackOfPlainDuplicate) {
        helpers.updateStorage({
          haltedAt: [
            ...helpers.getFromStorage("haltedAt"),
            {
              at: `${opInfo.index + 1}.${opInfo.title}: `,
              error: "duplicate characters are not allowed in plaintext field",
            },
          ],
        });
      }
      if (!checkLackOfCipherDuplicate) {
        helpers.updateStorage({
          haltedAt: [
            ...helpers.getFromStorage("haltedAt"),
            {
              at: `${opInfo.index + 1}.${opInfo.title}: `,
              error: "duplicate characters are not allowed in ciphertext field",
            },
          ],
        });
      }
      return false;
    }
  }

  function substitude(text) {
    let arr = [];
    for (let char of text) {
      if (plainAlphaRef.current.value.includes(char)) {
        let indexInPlainAlpha = plainAlphaRef.current.value
          .split("")
          .indexOf(char);
        if (cipherAlphaRef.current.value[indexInPlainAlpha] !== undefined) {
          arr.push(cipherAlphaRef.current.value[indexInPlainAlpha]);
        } else arr.push(char);
      } else arr.push(char);
    }
    return arr;
  }

  function triggerFn() {
    if (validate()) {
      const InputInString = helpers
        .binToChar(helpers.getFromStorage("outputBins"))
        .join("");
      let result = substitude(InputInString);
      helpers.updateStorage({
        outputBins: helpers.charToBin(result),
      });
    }
  }

  useEffect(() => triggerFn());

  return (
    <>
      <div className="inputs-flex">
        <label htmlFor="plainAlpha">
          plaintext alphabet
          <input
            type="text"
            id="plainAlpha"
            defaultValue="abcdefghijklmnopqrstuvwxyz"
            placeholder="plaintext alphabet"
            ref={plainAlphaRef}
            onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
            pattern=".+"
            required
          />
        </label>
        <label htmlFor="cipherAlpha">
          ciphertext alphabet
          <input
            type="text"
            id="cipherAlpha"
            defaultValue="zyxwvutsrqponmlkjihgfedcba"
            placeholder="ciphertext alphabet"
            ref={cipherAlphaRef}
            onInput={() => setOutputBinary(helpers.getFromStorage("inputBins"))}
            pattern=".+"
            required
          />
        </label>
      </div>
      {/* <section>
        <section className="info">
          <h3>What is Substitution cipher?</h3>
          <p>
            In cryptography, a substitution cipher is a method of encrypting in
            which units of plaintext are replaced with the ciphertext, in a
            defined manner, with the help of a key; the "units" may be single
            letters (the most common), pairs of letters, triplets of letters,
            mixtures of the above, and so forth. The receiver deciphers the text
            by performing the inverse substitution process to extract the
            original message.{" "}
          </p>
          <p>
            Substitution ciphers can be compared with transposition ciphers. In
            a transposition cipher, the units of the plaintext are rearranged in
            a different and usually quite complex order, but the units
            themselves are left unchanged. By contrast, in a substitution
            cipher, the units of the plaintext are retained in the same sequence
            in the ciphertext, but the units themselves are altered.{" "}
          </p>
          <p>
            There are a number of different types of substitution cipher. If the
            cipher operates on single letters, it is termed a simple
            substitution cipher; a cipher that operates on larger groups of
            letters is termed polygraphic. A monoalphabetic cipher uses fixed
            substitution over the entire message, whereas a polyalphabetic
            cipher uses a number of substitutions at different positions in the
            message, where a unit from the plaintext is mapped to one of several
            possibilities in the ciphertext and vice versa.{" "}
          </p>
          <a
            href="https://en.wikipedia.org/wiki/Substitution_cipher"
            target="_blank"
          >
            read more
          </a>
        </section>
      </section> */}
    </>
  );
}
