import React from "react";

function TableSorter({ sortField, sortOrder, onSortChange }) {
  const handleFieldChange = (e) => {
    onSortChange(e.target.value, sortOrder);
  };

  const handleOrderChange = (order) => {
    onSortChange(sortField, order);
  };

  return (
    <div style={{ marginBottom: "15px", display: "flex", gap: "10px", alignItems: "center" }}>
      <label>Sort by:</label>
      <select value={sortField} onChange={handleFieldChange}>
        <option value="">None</option>
        <option value="name">Name</option>
        <option value="industry">Industry</option>
        <option value="location">Location</option>
        <option value="employees">Employees</option>
        <option value="founded">Founded</option>
      </select>

      <button
        onClick={() => handleOrderChange("asc")}
        style={{ background: sortOrder === "asc" ? "#ddd" : "white" }}
      >
        Asc
      </button>

      <button
        onClick={() => handleOrderChange("desc")}
        style={{ background: sortOrder === "desc" ? "#ddd" : "white" }}
      >
        Desc
      </button>
    </div>
  );
}

export default TableSorter;
