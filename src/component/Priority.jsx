import React from "react";
function Priority({ value }) {
  return (
    <span className={`priority ${value ? value.toLowerCase() : "medium"}`}>
      {value}
    </span>
  );
}
export  default Priority;