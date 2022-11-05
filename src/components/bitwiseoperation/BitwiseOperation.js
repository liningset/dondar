import React, { useRef } from "react";

export default function BitwiseOperation({ setService }) {
  function triggerFn() {}
  return (
    <>
      <div className="div">
        <span>Type</span>
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
      </div>
      <div className="div">
        <span>Operand B</span>
        <input type="text" placeholder="operand B (repeating)" />
      </div>
    </>
  );
}
