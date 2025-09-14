import React from "react";

export default function ChecklistItem({ item, checked, onToggle, path }) {
  if (typeof item === "string") {
    return (
      <li>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em', width: '100%' }}>
          <input
            type="checkbox"
            checked={!!checked}
            onChange={() => onToggle(path)}
          />
          <span>{item}</span>
        </label>
      </li>
    );
  }
  // If this is a group (object with label and items), render a checkbox for the label and for each subitem
  if (item && Array.isArray(item.items)) {
    // checked: { self: boolean, children: [...] }
    const checkedObj = checked || { self: false, children: [] };
    return (
      <li>
        {item.label && item.label.trim() !== '' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em', width: '100%' }}>
            <input
              type="checkbox"
              checked={!!checkedObj.self}
              onChange={() => onToggle([...path, 'self'])}
            />
            <span style={{ fontWeight: 600 }}>{item.label}</span>
          </label>
        )}
        <ul style={{ marginLeft: '1.2em', marginTop: 0 }}>
          {item.items.map((subItem, i) => (
            <ChecklistItem
              key={i}
              item={subItem}
              checked={checkedObj.children && checkedObj.children[i]}
              onToggle={onToggle}
              path={[...path, 'children', i]}
            />
          ))}
        </ul>
      </li>
    );
  }
  // fallback (should not happen)
  return null;
}