import React, { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function NumeralSystem({ setService }) {
  const inputFieldRef = useRef(null);
  const outputFieldRef = useRef(null);
  const selectFromRef = useRef(null);
  const selectToRef = useRef(null);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  //const arabicNums = "٠١٢٣٤٥٦٧٨٩";
  //const devanagariNums = "०१२३४५६७८९";

  /*this function will validate the input before doing anything with it
  to make sure that it doesn't contain unwanted characters or values 
  depending on the selected format*/
  function validate() {
    let validator;
    let selectRefValue = Number(selectFromRef.current.value);

    if (selectFromRef.current.value === "r") {
      validator = /^M*(CM)*D*(CD)*C*(XC)*L*(XL)*X*(IX)*V*(IV)*I*\n?$/gim;
    } else if (selectRefValue <= 10) {
      let numRange = `0-${selectRefValue - 1}`;
      validator = new RegExp(`^[\\n${numRange} ]+$`);
    } else {
      let alphabetRange = `A-${alphabet[selectRefValue - 11]}`;
      validator = new RegExp(`^[\\n0-9${alphabetRange} ]+$`, "i");
    }
    return validator.test(inputFieldRef.current.value);
  }

  /*numbers of all types are converted to deciaml first and later to the target format.
  this function recieves a number of any format(binary, hex, etc.) and the base that number has 
  to return the decimalized output*/
  function convertToDecimal(numberInput, base) {
    if (base === "r") {
      /*because Roman numerals dont follow the generic rule, 
      another dedicated function converts it to and from decimal*/
      return convertRoman(numberInput.toUpperCase(""), "romanToDecimal");
    } else {
      let arr = [];
      //a reversed array of input number's digits Uppercased
      let digits = `${numberInput}`.toUpperCase("").split("").reverse("");
      digits.forEach((digit, index) => {
        /*each digit is run through a test. 
        if the digit is alphabetic it's index in alphabete is added by 10 
        and multipled by base times current index
        else the digit itself is multiplied by base times current index
        in either case the output is added to the above array*/
        /[A-Z]/.test(digit)
          ? arr.push((alphabet.indexOf(digit) + 10) * base ** index)
          : arr.push(digit * base ** index);
      });

      //returns arr numbers' sum
      return arr.reduce((a, b) => Number(a) + Number(b), 0);
    }
  }

  /*
  1.the decimal number is divided by the target base over and over until it becomes zero(the outputs are floored)
  1-1.in the meanwhile the floored remainders of each iteration are put in an array
  2.the array of remainders is reversed and stringed toghether
  3.the final output is returned
  */
  function convertToBase(numberInDecimal, baseToConvert) {
    let remainderArr = [];
    let num = numberInDecimal;

    if (num !== 0) {
      while (num !== 0) {
        remainderArr.push(Math.floor(num % baseToConvert));
        num = Math.floor(num / baseToConvert);
      }

      if (baseToConvert > 10) {
        remainderArr = remainderArr.map((remainder) => {
          return remainder < 10 ? remainder : alphabet[remainder - 10];
        });
      }
      return remainderArr.reverse("").join("");
    } else {
      return "0";
    }
  }

  //this function will use the two previous functions to give an output to the user
  function convert(number, fromBase, toBase) {
    let numberInDecimal = convertToDecimal(
      number,
      isNaN(Number(fromBase)) ? fromBase : Number(fromBase)
    );

    switch (toBase) {
      case "r": {
        //the function that deals with roman seperately
        return convertRoman(numberInDecimal, "decimalToRoman");
        break;
      }
      case "10": {
        /*we don't want to do anything else to a number
         that is already decimal on a decimal request*/
        return numberInDecimal;
        break;
      }
      default: {
        /*run convertToBase function if both above cases don't match 
        and pass it the decimalized number and it's base
        as the first and second argument respectively*/
        return convertToBase(
          numberInDecimal,
          isNaN(Number(toBase)) ? toBase : Number(toBase)
        );
        //the second argument will be the string "r" if it's supposed to be converted to Roman
        break;
      }
    }
  }

  /*a function that deals with Roman<==>decimal seperately. 
  It recieves a decimal and returns Roman OR recieves Roman and returns decimal 
  depending on the type parameter. */
  function convertRoman(input, type) {
    const romanDigits = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };

    switch (type) {
      case "decimalToRoman": {
        //checks to see if the input is lesser than 4000 to begin with
        if (Number(input) < 4000) {
          let num = Number(input);

          /*if the number is present in the romanDigits object
           it just returns the symbol associated with it*/
          if (Object.values(romanDigits).includes(num)) {
            return Object.entries(romanDigits).find(
              ([key, val]) => num === val
            )[0];
            //otherwise:
          } else {
            const arr = [];
            /*runs a process of elimination, 
            mutating the num variable until it becomes 0
            in which case we have our output to return*/
            while (num !== 0) {
              /*finds the closest number that is less than or equal to variable num 
              amongst the array of values extracted from romanDigits object. 
              num will be divided by divsor variable to extract the remainder and quotient*/
              const divisor = Object.entries(romanDigits).find(
                ([key, val]) => val <= num
              )[1];
              /*finds the Roman symbol that is associated with the divisor number*/
              const symbol = Object.entries(romanDigits).find(
                ([key, val]) => val === divisor
              )[0];
              /*this is the number of how many times we need to repeat the symbol
               to get the number that is sliced away from num. 
               this number is the quotient of (num / divisor)*/
              const numberToRepeat = Math.floor(num / divisor);
              /*the mutated version of num that will replace num at the end of each iteration of loop.
               this number is basically the remainder of (num / divisor)*/
              const newNum = Math.floor(num % divisor);

              for (let i = 1; i <= numberToRepeat; i++) {
                arr.push(symbol);
              }
              num = newNum;
            }
            return arr.join("");
          }
        } else {
          outputFieldRef.current.setAttribute(
            "placeholder",
            "Input cannot exceed 3999₁₀"
          );
          return "";
        }
        break;
      }

      case "romanToDecimal": {
        /*this regex will be used to split 
        different symbols of the roman input string into an array 
        starting from the biggest number's symbol in romanDigits to smallest */
        const seperatorReg = /M|CM|D|CD|C|XC|L|XL|X|IX|V|IV|I/gi;
        const numbers = input.match(seperatorReg);
        //gives an array of decimal numbers that correspond to each symbol of the numbers array
        let convertedNumbers = numbers.map((number) => {
          return romanDigits[number];
        });

        //returns the output that is the sum of all numbers in convertedNumbers
        return convertedNumbers.reduce((a, b) => a + b, 0);
        break;
      }
    }
  }

  function triggerFn() {
    let result;
    if (inputFieldRef.current.value !== "") {
      if (selectFromRef.current.value !== selectToRef.current.value) {
        if (validate()) {
          outputFieldRef.current.setAttribute("placeholder", "The output");
          result = inputFieldRef.current.value
            .match(/(?<=(^| ))[\da-z]+(?=($| ))/gms)
            .map((val) =>
              convert(
                val,
                selectFromRef.current.value,
                selectToRef.current.value
              )
            )
            .join("\n");
          console.log(result);
          /*convert(
            inputFieldRef.current.value,
            selectFromRef.current.value,
            selectToRef.current.value
          );*/
        } else {
          outputFieldRef.current.setAttribute("placeholder", "Invalid input");
          result = "";
        }
      } else {
        outputFieldRef.current.setAttribute("placeholder", "The output");
        result = inputFieldRef.current.value;
      }
    } else {
      outputFieldRef.current.setAttribute("placeholder", "The output");
      result = "";
    }

    outputFieldRef.current.value = result;
  }

  return (
    <>
      <Header setService={setService} />
      <main className="numeral-wrapper wrapper">
        <h1>Numeral system</h1>
        <textarea
          id="input-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="Your text goes here..."
          ref={inputFieldRef}
          onInput={() => triggerFn()}
        ></textarea>
        <div className="selects-flex">
          <div>
            <span>from </span>{" "}
            <select
              defaultValue="10"
              ref={selectFromRef}
              onInput={() => triggerFn()}
            >
              <optgroup label="by position">
                <option value="2">Base-2 (Binary)</option>
                <option value="3">Base-3</option>
                <option value="4">Base-4</option>
                <option value="5">Base-5</option>
                <option value="6">Base-6</option>
                <option value="7">Base-7</option>
                <option value="8">Base-8 (Octal)</option>
                <option value="9">Base-9</option>
                <option value="10">Base-10 (Decimal)</option>
                <option value="11">Base-11</option>
                <option value="12">Base-12</option>
                <option value="13">Base-13</option>
                <option value="14">Base-14</option>
                <option value="15">Base-15</option>
                <option value="16">Base-16 (Hexadecimal)</option>
                <option value="17">Base-17</option>
                <option value="18">Base-18</option>
                <option value="19">Base-19</option>
                <option value="20">Base-20 (Vigesimal)</option>
                <option value="21">Base-21</option>
                <option value="22">Base-22</option>
                <option value="23">Base-23</option>
                <option value="24">Base-24</option>
                <option value="25">Base-25</option>
                <option value="26">Base-26</option>
                <option value="27">Base-27</option>
                <option value="28">Base-28</option>
                <option value="29">Base-29</option>
                <option value="30">Base-30</option>
                <option value="31">Base-31</option>
                <option value="32">Base-32</option>
                <option value="33">Base-33</option>
                <option value="34">Base-34</option>
                <option value="35">Base-35</option>
                <option value="36">Base-36</option>
              </optgroup>
              <optgroup label="by culture/history">
                <option value="r">Roman numerals</option>
              </optgroup>
            </select>
          </div>
          <div>
            <span>to </span>{" "}
            <select ref={selectToRef} onInput={() => triggerFn()}>
              <optgroup label="by position">
                <option value="2">Base-2 (Binary)</option>
                <option value="3">Base-3</option>
                <option value="4">Base-4</option>
                <option value="5">Base-5</option>
                <option value="6">Base-6</option>
                <option value="7">Base-7</option>
                <option value="8">Base-8 (Octal)</option>
                <option value="9">Base-9</option>
                <option value="10">Base-10 (Decimal)</option>
                <option value="11">Base-11</option>
                <option value="12">Base-12</option>
                <option value="13">Base-13</option>
                <option value="14">Base-14</option>
                <option value="15">Base-15</option>
                <option value="16">Base-16 (Hexadecimal)</option>
                <option value="17">Base-17</option>
                <option value="18">Base-18</option>
                <option value="19">Base-19</option>
                <option value="20">Base-20 (Vigesimal)</option>
                <option value="21">Base-21</option>
                <option value="22">Base-22</option>
                <option value="23">Base-23</option>
                <option value="24">Base-24</option>
                <option value="25">Base-25</option>
                <option value="26">Base-26</option>
                <option value="27">Base-27</option>
                <option value="28">Base-28</option>
                <option value="29">Base-29</option>
                <option value="30">Base-30</option>
                <option value="31">Base-31</option>
                <option value="32">Base-32</option>
                <option value="33">Base-33</option>
                <option value="34">Base-34</option>
                <option value="35">Base-35</option>
                <option value="36">Base-36</option>
              </optgroup>
              <optgroup label="by culture/history">
                <option value="r">Roman numerals</option>
              </optgroup>
            </select>
          </div>
        </div>
        <textarea
          id="output-area"
          cols="30"
          rows="10"
          spellCheck="false"
          placeholder="The output"
          ref={outputFieldRef}
        ></textarea>
      </main>
      <section>
        <section className="info">
          <h1>What is a numeral system?</h1>
          <p>
            A numeral system (or system of numeration) is a writing system for
            expressing numbers; that is, a mathematical notation for
            representing numbers of a given set, using digits or other symbols
            in a consistent manner.
          </p>
          <p>
            The same sequence of symbols may represent different numbers in
            different numeral systems. For example, "11" represents the number
            eleven in the decimal numeral system (used in common life), the
            number three in the binary numeral system (used in computers), and
            the number two in the unary numeral system (e.g. used in tallying
            scores).
          </p>

          <a
            href="https://en.wikipedia.org/wiki/Numeral_system"
            target="_blank"
          >
            read more
          </a>
        </section>
        <section className="notes">
          <h1>Notes:</h1>
          <p>
            this module provides support between conversion from/to base-2,
            base-3, base-4,...,base-36 systems and Roman numerals. Some of the
            popular ones are mentioned below.
          </p>

          <p>
            1. Binary: Binary or base 2 consists of 1s and 0s. It is the system
            that computers understand at a core level.
          </p>
          <p>
            2. Octal: Octal or base 8 is a counting system similar to binary,
            except that digits vary from 0 to 7.
          </p>
          <p>
            3. Decimal: Decimal or base 10, is the system that most humans in
            the world are taught to use. the characters range from 0 to 9.
          </p>
          <p>
            4. Hexadecimal: Hexadecimal (hex) or base 16 is a system that has
            played a major role in computer science alongside binary. the
            characters consist of 0 to 9 and A to F from alphabet.
          </p>
          <p>
            5. Roman numerals: Roman numerals are a set of latin symbols that
            represent a rather limited set of numbers. It was the prevalent
            counting system in ancient Rome and most other parts of Europe. The
            numbers on the Big Ben tower's clock in London are written in Roman.
            the Numbers 0 through 12 are as follows: I, II, III, IV, V, VI ,VII,
            VIII, IX, X, XI, XII.
          </p>
          <p>
            6. If you want to convert multiple numbers simultaneously, seperate
            them with a line break.
          </p>
        </section>
      </section>
      <Footer />
    </>
  );
}
