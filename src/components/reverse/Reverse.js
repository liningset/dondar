import React, { useEffect } from "react";

export default function Reverse({ helpers }) {
  useEffect(() => {
    helpers.updateStorage({
      outputBins: helpers.getFromStorage("outputBins").reverse(),
    });
  });

  return <span>No advanced options</span>;
}
