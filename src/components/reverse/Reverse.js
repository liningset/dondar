import React, { useEffect } from "react";

export default function Reverse({
  opsList,
  outputBinary,
  inputBinary,
  setOutputBinary,
  count,
}) {
  useEffect(() => {
    setOutputBinary(outputBinary.reverse());
  }, [opsList, inputBinary, outputBinary]);

  return <span>No advanced options</span>;
}
