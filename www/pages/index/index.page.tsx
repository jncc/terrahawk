import React from "react";
import "../../styles.css";
import { Counter } from "./Counter";

export { Page };

function Page() {
  return (
    <>
      <h1 className="text-green-600 text-3xl lg:text-6xl">Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  );
}
