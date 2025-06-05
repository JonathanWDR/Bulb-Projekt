import React from "react";
import LampControl from "./LampControl";
import "./index.css";

export default function App() {
  return (
    /* Weil #root in index.css per Flex zentriert, steht diese App immer mittig */
    <div className="app-root">
      <LampControl />
    </div>
  );
}
