import React, { useState } from "react";
import { checklist } from "./checklistData";
import ChecklistItem from "./ChecklistItem.jsx";
import "./app.css";

function defaultChecked(data) {
  if (Array.isArray(data)) {
    return data.map(defaultChecked);
  }
  if (typeof data === "object" && Array.isArray(data.items)) {
    return {
      self: false,
      children: data.items.map(defaultChecked)
    };
  }
  return false;
}

function setChecked(checked, path) {
  if (!path.length) {
    // Toggle boolean or self property
    if (typeof checked === 'boolean') return !checked;
    if (checked && typeof checked === 'object' && 'self' in checked) {
      return { ...checked, self: !checked.self };
    }
    return checked;
  }
  const [head, ...rest] = path;
  if (Array.isArray(checked)) {
    const idx = typeof head === "number" ? head : parseInt(head, 10);
    return checked.map((c, i) =>
      i === idx ? setChecked(c, rest) : c
    );
  }
  if (checked && typeof checked === 'object' && 'children' in checked) {
    if (head === 'self') {
      return { ...checked, self: !checked.self };
    }
    if (head === 'children') {
      const [childIdx, ...childRest] = rest;
      return {
        ...checked,
        children: checked.children.map((c, i) =>
          i === childIdx ? setChecked(c, childRest) : c
        )
      };
    }
  }
  return checked;
}

export default function App() {
  const [checkedState, setCheckedState] = useState(
    checklist.map(section => defaultChecked(section.items))
  );
  const [darkMode, setDarkMode] = useState(() => {
    // Try to use system preference on first load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  });

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

  const handleThemeToggle = () => setDarkMode(d => !d);

  return (
    <div className={`app-container${darkMode ? ' dark' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
        <h1 style={{ marginBottom: 0 }}>Home Ready to Rent Checklist</h1>
        <button
          onClick={handleThemeToggle}
          style={{ background: darkMode ? '#222' : '#eee', color: darkMode ? '#fff' : '#222', border: '1px solid #ccc', fontSize: '0.95em', padding: '0.4em 1em', marginLeft: '1em' }}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
      <p>
        <em>
          Use this checklist each time to prepare your home for guests. You can check/uncheck individual tasks or reset the entire list for reuse.
        </em>
      </p>
      <button onClick={handleReset}>Reset All</button>
      {checklist.map((section, sectionIdx) => (
        <section key={section.section}>
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