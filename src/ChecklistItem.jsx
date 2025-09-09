import React from "react";

export default function ChecklistItem({ item, checked, onToggle, path }) {
  if (typeof item === "string") {
    return (
      <li>
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle(path)}
          />
          {item}
        </label>
      </li>
    );
  }
  // Nested items
  return (
    <li>
      {item.label && <strong>{item.label}</strong>}
      <ul>
        {item.items.map((subItem, i) => (
          <ChecklistItem
            key={i}
            item={subItem}
            checked={checked[i]}
            onToggle={onToggle}
            path={[...path, "items", i]}
          />
        ))}
      </ul>
    </li>
  );
}