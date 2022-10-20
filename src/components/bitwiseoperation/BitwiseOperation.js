import React, { useRef } from "react";
import Header from "../Header";
import Footer from "../Footer";

export default function BitwiseOperation({ setService }) {
  const inputFieldRef = useRef(null);
  const outputFieldRef = useRef(null);

  function triggerFn() {}
  return (
    <>
      <select>
        <optgroup label="bitwise gates">
          <option value="and">AND (a & b)</option>
          <option value="nand">NAND ~(a & b)</option>
          <option value="or">OR (a | b)</option>
          <option value="nor">NOR ~(a | b)</option>
          <option value="xor">XOR (a ^ b)</option>
          <option value="xnor">XNOR ~(a ^ b)</option>
          <option value="not">NOT ~(a)</option>
        </optgroup>
        <optgroup label="bit shift">
          <option value="shiftr">Shift right (a {">>"} b)</option>
          <option value="shiftl">Shift left (a {"<<"} b)</option>
        </optgroup>
      </select>
      <input type="text" placeholder="operand B (repeating)" />
    </>
  );
}
