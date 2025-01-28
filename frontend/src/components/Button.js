import React from "react";
import "../styles/button.css";

export default function Button(props) {
  return (
    <button className={props.classes} onClick={props.onClick}>
      {props.text}
    </button>
  );
}
