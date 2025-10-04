// File: src/MarkdownEditor.js
import React, { useState, useEffect } from "react";

// Very small markdown-to-html converter (supports headings, bold, italic, code blocks, inline code, paragraphs, lists)
function simpleMarkdownToHtml(md) {
  if (!md) return "";

  const escapeHtml = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = md.split("\n");
  let html = "";
  let inList = false;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      html += inCodeBlock ? "<pre><code>" : "</code></pre>";
      continue;
    }

    if (inCodeBlock) {
      html += escapeHtml(line) + "\n";
      continue;
    }

    const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      html += `<h${level}>${hMatch[2]}</h${level}>`;
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      const item = line.replace(/^\s*[-*+]\s+/, "");
      html += `<li>${inlineFormatting(item)}</li>`;
      continue;
    } else if (inList) {
      html += "</ul>";
      inList = false;
    }

    if (/^\s*([-*_]){3,}\s*$/.test(line)) {
      html += "<hr/>";
      continue;
    }

    if (line.trim() === "") {
      html += "<p></p>";
      continue;
    }

    html += `<p>${inlineFormatting(line)}</p>`;
  }

  if (inList) html += "</ul>";
  if (inCodeBlock) html += "</code></pre>";

  return html;

  function inlineFormatting(text) {
    text = escapeHtml(text);
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    text = text.replace(/_(.*?)_/g, "<em>$1</em>");
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    return text;
  }
}

export default function MarkdownEditor() {
  const initialText = `# Markdown

**bold**`;

  const [text, setText] = useState(initialText);
  const [html, setHtml] = useState(() => simpleMarkdownToHtml(initialText));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => {
      setHtml(simpleMarkdownToHtml(text));
      setLoading(false);
    }, 150);
    return () => clearTimeout(id);
  }, [text]);

  return (
    <div className="markdown-editor">
      <div className="editor-columns">
        <div className="editor-pane">
          <h2>Editor</h2>
          <textarea
            className="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Markdown input"
          />
        </div>

        <div className="preview-pane">
          <h2>
            Preview {loading && <span className="loading">loading...</span>}
          </h2>
          <div className="preview" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
