import React from "react";

function inlineParts(text, keyPrefix = "i") {
  const pattern = /(\*\*[^*]+\*\*|(?<!\*)\*[^*]+\*(?!\*)|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;
  return text.split(pattern).filter(Boolean).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={key}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={key}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (link) return <a key={key} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    return part;
  });
}

export default function ChatMarkdown({ content = "" }) {
  const normalized = String(content).replace(/<br\s*\/?\s*>/gi, "\n").replace(/<\/?(?:p|div)>/gi, "\n");
  const lines = normalized.replace(/\r/g, "").split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith("```") ) {
      const code = []; i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      if (i < lines.length) i++;
      blocks.push(<pre key={`b-${i}`}><code>{code.join("\n")}</code></pre>);
      continue;
    }
    if (/^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || "") && line.includes("|")) {
      const parseRow = (row) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
      const headers = parseRow(line); i += 2; const rows = [];
      while (i < lines.length && lines[i].includes("|")) rows.push(parseRow(lines[i++]));
      blocks.push(<div className="chat-markdown-table-wrap" key={`table-${i}`}><table className="chat-markdown-table"><thead><tr>{headers.map((cell, n) => <th key={n}>{inlineParts(cell, `th-${n}`)}</th>)}</tr></thead><tbody>{rows.map((row, n) => <tr key={n}>{headers.map((_, c) => <td key={c}>{inlineParts(row[c] || "", `td-${n}-${c}`)}</td>)}</tr>)}</tbody></table></div>);
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) { const Tag = `h${heading[1].length}`; blocks.push(<Tag key={`h-${i}`}>{inlineParts(heading[2], `h-${i}`)}</Tag>); i++; continue; }
    if (/^\s*[-*+]\s+/.test(line)) {
      const items = []; while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*+]\s+/, ""));
      blocks.push(<ul key={`ul-${i}`}>{items.map((item, n) => <li key={n}>{inlineParts(item, `ul-${n}`)}</li>)}</ul>); continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = []; while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ""));
      blocks.push(<ol key={`ol-${i}`}>{items.map((item, n) => <li key={n}>{inlineParts(item, `ol-${n}`)}</li>)}</ol>); continue;
    }
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,4})\s|^\s*[-*+]\s+|^\s*\d+[.)]\s+|^```/.test(lines[i])) paragraph.push(lines[i++]);
    blocks.push(<p key={`p-${i}`}>{inlineParts(paragraph.join(" "), `p-${i}`)}</p>);
  }
  return <div className="chat-markdown">{blocks}</div>;
}
