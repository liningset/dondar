import React, { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function Vigenere({ setService }) {
  const inputField = useRef(null);
  const outputField = useRef(null);
  const chooseOp = useRef(null);
  const askKeyFromUser = useRef(null);

  //-----------------------------------------------------------------------------------------

  /*generates 26 arrays of 26 length containing alphabetic characters. 
first array starts from ["a",...,"z"] and last ["z",..,"a"]*/
  function generateTable() {
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    let items = alphabet.split("");
    let columns = [];
    items.forEach((item, index) => {
      let startingIndex = index;
      let column = [];
      for (let i = 0; i <= 25; i++) {
        column.push(items[startingIndex]);
        startingIndex === 25 ? (startingIndex = 0) : startingIndex++;
      }
      columns.push(column);
    });
    return columns;
  }

  //-----------------------------------------------------------------------------------------

  /*removes the spaces, numbers and replaces uppercase characters 
with their lowercase counterparts (since generated table is only in lowercase)
it also returns all the positions and required info of mentioned characters in an object*/
  function format(subject) {
    //order of operations => remove uppercase => remove numbers => remove spaces

    let [arr1, arr2, obj1] = [[], [], { indexes: [], values: [] }];
    let [reg1, reg2, reg3] = [/\s/g, /[A-Z]/g, /[^a-z ]/gi];
    let allMatches2 = [...subject.matchAll(reg2)];
    let allMatches3 = [...subject.matchAll(reg3)];

    //update uppercase positions
    allMatches2.forEach((match) => arr2.push(match.index));

    //update number positions
    allMatches3.forEach((match) => {
      obj1.indexes.push(match.index);
      obj1.values.push(match.join(""));
    });

    //removing uppercases..........
    let subjectWithoutUppercase = subject.split("");
    arr2.forEach((i) => {
      subjectWithoutUppercase.splice(
        i,
        1,
        subjectWithoutUppercase[i].toLowerCase()
      );
    });

    //removing numbers.............
    let subjectWithoutNums = subjectWithoutUppercase;
    obj1.indexes.forEach((i) => {
      subjectWithoutNums.splice(i, 1, "");
    });

    /*since the position of spaces changes after adding numbers in deformat()
   we rely on the positions of spaces after numbers are removed*/
    let allMatches1 = [...subjectWithoutNums.join("").matchAll(reg1)];
    //update space positions
    allMatches1.forEach((match) => arr1.push(match.index));
    //removing spaces..............
    let subjectWithoutSpaces = subjectWithoutNums.join("");
    let subjectWithoutAll = subjectWithoutSpaces.replaceAll(reg1, "");

    return {
      text: subjectWithoutAll,
      sindexes: arr1,
      cindexes: arr2,
      nindexes: obj1,
    };
  }

  //-----------------------------------------------------------------------------------------

  /*uses the data provided from format() to transform the converted text
 into the format user initially entered the text as*/
  function deformat(obj, textToDeformat) {
    //order of operations => adding spaces => adding numbers => adding uppercase

    const [sIndexes, cIndexes, nIndexes] = [
      obj.sindexes,
      obj.cindexes,
      obj.nindexes,
    ];

    //adding spaces.................
    let textWithSpaces = textToDeformat.split("");
    sIndexes.forEach((i) => {
      textWithSpaces.splice(i, 0, " ");
    });

    //adding numbers................
    let textWithNums = textWithSpaces;
    nIndexes.indexes.forEach((i, index) => {
      textWithNums.splice(i, 0, nIndexes.values[index]);
    });

    //adding uppercase...............
    let textWithUppercase = textWithNums;
    cIndexes.forEach((i) => {
      textWithUppercase.splice(i, 1, textWithUppercase[i].toUpperCase());
    });

    let textWithAll = textWithUppercase.join("");

    return textWithAll;
  }

  //-----------------------------------------------------------------------------------------

  /*repeats the user-given key until it has the same length as plain/cipher text
 << this step is crucial to performing further operations >> */
  function extendKey(key, text) {
    let extended = [];
    let keyChars = key;

    for (let index = 0; index < keyChars.length; ) {
      extended.push(keyChars[index]);
      if (extended.length === text.length) break;
      index === keyChars.length - 1 ? (index = 0) : index++;
    }

    return extended.join("");
  }

  //-----------------------------------------------------------------------------------------

  function encrypt(key, text) {
    const [formatDetails1, formatDetails2] = [format(text), format(key)];
    const [formattedText, formattedKey] = [
      formatDetails1.text.split(""),
      formatDetails2.text.split(""),
    ];

    let extendedKeyword = extendKey(formattedKey, formatDetails1.text);
    let vigenereColumns = generateTable();

    let cipherText = [];
    //makes length the same as text
    formattedText.forEach((char, index) => {
      vigenereColumns.forEach((column, i) => {
        if (column[0] === char) {
          cipherText.push(
            column[vigenereColumns[0].indexOf(extendedKeyword[index])]
          );
        }
      });
    });
    let deformattedCipher = deformat(formatDetails1, cipherText.join(""));
    outputField.current.value = deformattedCipher;
  }

  //-----------------------------------------------------------------------------------------

  function decrypt(key, cipher) {
    const [formatDetails1, formatDetails2] = [format(cipher), format(key)];
    const [formattedCipher, formattedKey] = [
      formatDetails1.text.split(""),
      formatDetails2.text.split(""),
    ];
    //console.log(formatDetails1, formatDetails2);
    let extendedKeyword = extendKey(formattedKey, formatDetails1.text);
    let vigenereColumns = generateTable();

    let plainText = [];
    //makes length the same as text
    formattedCipher.forEach((char, index) => {
      //the alternative key character at the same index
      let keyCounterpart = extendedKeyword[index];
      let alphabet = vigenereColumns[0];
      //the position keyCounterpart is at current iteration when searched in alphabete
      let keyCurrentIndex = alphabet.indexOf(keyCounterpart);

      /*checks each column to see which one of them have current character of cipher in the same index
    as it's keyword alternative index then it will add the first item of that column to the
     plainText array as a decrypted piece of the cipher text*/
      vigenereColumns.forEach((column, i) => {
        if (column[keyCurrentIndex] === char) plainText.push(column[0]);
      });
    });
    let deformattedText = deformat(formatDetails1, plainText.join(""));
    outputField.current.value = deformattedText;
  }

  //-----------------------------------------------------------------------------------------

  /*the function that sets the whole program in motion the moment user 
  interacts with html input fields*/
  function triggerFn() {
    if (askKeyFromUser.current.value !== "") {
      if (/[a-z]/gi.test(inputField.current.value)) {
        let keyword = askKeyFromUser.current.value.replace(
          /(\r\n|\n|\r)/gm,
          ""
        );
        let userText = inputField.current.value.replace(/(\r\n|\n|\r)/gm, "");

        switch (chooseOp.current.value) {
          case "encrypt":
            encrypt(keyword, userText);
            break;

          case "decrypt":
            decrypt(keyword, userText);
            break;
        }
      } else outputField.current.value = inputField.current.value;
    } else outputField.current.value = "";
  }

  return (
    <>
      <Header setService={setService} />
      <main className="wrapper">
        <h1>Vigenère</h1>
        <textarea
          id="input-area"
          rows="10"
          placeholder="Your text goes here..."
          spellCheck="false"
          onInput={() => triggerFn()}
          ref={inputField}
        ></textarea>
        <div className="inner-wrapper">
          <select
            id="choose-operation"
            ref={chooseOp}
            onInput={() => triggerFn()}
          >
            <option value="encrypt">encrypt</option>
            <option value="decrypt">decrypt</option>
          </select>
          <input
            type="text"
            placeholder="The key"
            id="ask-user-key"
            spellCheck="false"
            title="Key cannot be empty or contain non-alphabetic
        characters"
            pattern="[A-Za-z\s]+"
            ref={askKeyFromUser}
            onInput={() => triggerFn()}
          />
        </div>
        <textarea
          id="output-area"
          rows="10"
          spellCheck="false"
          ref={outputField}
          placeholder="The output"
        ></textarea>
      </main>
      <section>
        <section className="info">
          <h1>What is Vigenère Cipher?</h1>
          <p>
            The Vigenère cipher is a method of encrypting alphabetic text by
            using a series of interwoven Caesar ciphers, based on the letters of
            a keyword on a 26*26 table known as Vigenere Square (
            <a href="https://en.wikipedia.org/wiki/Tabula_recta">
              or Tabula Recta
            </a>
            ) . It employs a form of polyalphabetic substitution.
          </p>
          <p>
            First described by Giovan Battista Bellaso in 1553, the cipher is
            easy to understand and implement, but it resisted all attempts to
            break it until 1863, three centuries later. This earned it the
            description le chiffrage indéchiffrable (French for 'the
            indecipherable cipher'). Many people have tried to implement
            encryption schemes that are essentially Vigenère ciphers. In 1863,
            Friedrich Kasiski was the first to publish a general method of
            deciphering Vigenère ciphers.
          </p>
          <a href="https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher">
            read more
          </a>
        </section>
        <section className="notes">
          <h1>Notes:</h1>
          <p>
            1. The table consists of the alphabets written out 26 times in
            different rows, each alphabet shifted cyclically to the left
            compared to the previous alphabet, corresponding to the 26 possible
            Caesar Ciphers.
          </p>
          <p>
            2. At different points in the encryption process, the cipher uses a
            different alphabet from one of the rows.
          </p>
          <p>
            3. The alphabet used at each point depends on a repeating keyword.
          </p>
        </section>
      </section>
      <Footer />
    </>
  );
}
