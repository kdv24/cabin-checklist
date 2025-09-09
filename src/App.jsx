import React, { useState } from "react";
import { checklist } from "./checklistData";
import ChecklistItem from "./ChecklistItem.jsx";

function defaultChecked(data) {
  if (Array.isArray(data)) {
    return data.map(defaultChecked);
  }
  if (typeof data === "object" && data.items) {
    return data.items.map(defaultChecked);
  }
  return false;
}

function setChecked(checked, path) {
  if (path.length === 0) return !checked;
  const [head, ...rest] = path;
  if (Array.isArray(checked)) {
    const idx = typeof head === "number" ? head : parseInt(head, 10);
    return checked.map((c, i) =>
      i === idx ? setChecked(c, rest) : c
    );
  }
  return checked;
}

export default function App() {
  const [checkedState, setCheckedState] = useState(
    checklist.map(section => defaultChecked(section.items))
  );

  const handleToggle = (sectionIdx, itemPath) => {
    setCheckedState(state =>
      state.map((checked, idx) =>
        idx === sectionIdx
          ? setChecked(checked, itemPath)
          : checked
      )
    );
  };

  const handleReset = () => {
    setCheckedState(checklist.map(section => defaultChecked(section.items)));
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Home Ready to Rent Checklist</h1>
      <p>
        <em>
          Use this checklist each time to prepare your home for guests. You can check/uncheck individual tasks or reset the entire list for reuse.
        </em>
      </p>
      <button onClick={handleReset} style={{marginBottom: '1em'}}>Reset All</button>
      {checklist.map((section, sectionIdx) => (
        <section key={section.section} style={{marginBottom: "2em"}}>
          <h2>{section.section}</h2>
          {section.note && <p><small><em>{section.note}</em></small></p>}
          <ul>
            {section.items.map((item, itemIdx) => (
              <ChecklistItem
                key={itemIdx}
                item={item}
                checked={checkedState[sectionIdx][itemIdx]}
                onToggle={itemPath =>
                  handleToggle(sectionIdx, [itemIdx, ...itemPath])
                }
                path={[]}
              />
            ))}
          </ul>
        </section>
      ))}
      <footer style={{marginTop: "2em", fontSize: "90%"}}>
        <hr />
        <strong>Reset Instructions</strong>
        <p>
          To re-use, click the “Reset All” button or uncheck boxes manually.
        </p>
        <p>
          <a href="https://github.com/kdv24/home-rental-checklist" rel="noopener noreferrer" target="_blank">
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}