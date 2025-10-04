import React from "react";
import MarkdownEditor from "./MarkdownEditor";
import "./styles.css";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Markdown Editor</h1>
        <p>Write Markdown on the left — preview on the right.</p>
      </header>

      <MarkdownEditor />
    </div>
  );
}
