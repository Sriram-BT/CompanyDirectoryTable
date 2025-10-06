import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import FilterDialog from "./FilterDialog";

function CompanyTable() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalCompanies, setTotalCompanies] = useState(0);

  const [filters, setFilters] = useState({
    id: "",
    name: "",
    industry: "",
    location: "",
    employees: "",
    founded: "",
  });

  const [customFilters, setCustomFilters] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchCompanies = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/companies?_page=${pageNumber}&_per_page=${limit}`
      );
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      const total = res.headers.get("X-Total-Count") || data.items;

      setTotalCompanies(Number(total) || 0);
      setCompanies(data.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(page);
  }, [page]);

  const totalPages = Math.ceil(totalCompanies / limit) || 1;

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <UnfoldMoreIcon fontSize="small" />;
    return sortOrder === "asc" ? (
      <ArrowUpwardIcon fontSize="small" />
    ) : (
      <ArrowDownwardIcon fontSize="small" />
    );
  };

  const handleApplyFilter = (filter) => {
    setCustomFilters((prev) => [...prev, filter]);
  };

  const handleClearFilters = () => {
    setFilters({
      id: "",
      name: "",
      industry: "",
      location: "",
      employees: "",
      founded: "",
    });
    setCustomFilters([]);
  };

  let filteredCompanies = companies.filter((c) => {
    let matches = true;

    matches =
      matches &&
      (filters.id === "" ||
        c.id.toString().includes(filters.id)) &&
      c.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      c.industry.toLowerCase().includes(filters.industry.toLowerCase()) &&
      c.location.toLowerCase().includes(filters.location.toLowerCase()) &&
      (filters.employees === "" ||
        c.employees.toString().includes(filters.employees)) &&
      (filters.founded === "" ||
        c.founded.toString().includes(filters.founded));


    customFilters.forEach(({ field, operator, value }) => {
      const val = c[field];
      if (typeof val === "string") {
        const valLower = val.toLowerCase();
        const filterValLower = value.toLowerCase();

        if (operator === "contains" && !valLower.includes(filterValLower)) matches = false;
        if (operator === "equals" && valLower !== filterValLower) matches = false;
        if (operator === "startsWith" && !valLower.startsWith(filterValLower)) matches = false;
        if (operator === "endsWith" && !valLower.endsWith(filterValLower)) matches = false;
        if (operator === "doesNotContain" && valLower.includes(filterValLower)) matches = false;
      } else if (typeof val === "number") {
        const numVal = Number(value);
        if (operator === "gt" && !(val > numVal)) matches = false;
        if (operator === "gte" && !(val >= numVal)) matches = false;
        if (operator === "lt" && !(val < numVal)) matches = false;
        if (operator === "lte" && !(val <= numVal)) matches = false;
        if (operator === "eq" && val !== numVal) matches = false;
      }
    });

    return matches;
  });



  if (sortField) {
    filteredCompanies = [...filteredCompanies].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
    });
  }

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCompanies);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "10px" }}>
        <IconButton onClick={() => setFilterDialogOpen(true)}>
          <FilterListIcon />
        </IconButton>
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>

      {/* Table */}
      <table
        border="1"
        cellPadding="12"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#f5f5f5",
          zIndex: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}>
          <tr>
            <th>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <TextField
                  variant="standard"
                  placeholder="ID"
                  type="number"
                  value={filters.id}
                  onChange={(e) => handleFilterChange("id", e.target.value)}
                  fullWidth
                />
                <span
                  style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  onClick={() => handleSort("id")}
                >
                  {renderSortIcon("id")}
                </span>
              </div>
            </th>

            <th>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <TextField
                  variant="standard"
                  placeholder="Name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  fullWidth
                />
                <span
                  style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  onClick={() => handleSort("name")}
                >
                  {renderSortIcon("name")}
                </span>
              </div>
            </th>

            <th>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <TextField
                  variant="standard"
                  placeholder="Industry"
                  value={filters.industry}
                  onChange={(e) => handleFilterChange("industry", e.target.value)}
                  fullWidth
                />
                <span
                  style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  onClick={() => handleSort("industry")}
                >
                  {renderSortIcon("industry")}
                </span>
              </div>
            </th>

            <th>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <TextField
                  variant="standard"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  fullWidth
                />
                <span
                  style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  onClick={() => handleSort("location")}
                >
                  {renderSortIcon("location")}
                </span>
              </div>
            </th>

            <th>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <TextField
                  variant="standard"
                  placeholder="Employees"
                  type="number"
                  value={filters.employees}
                  onChange={(e) => handleFilterChange("employees", e.target.value)}
                  fullWidth
                />
                <span
                  style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  onClick={() => handleSort("employees")}
                >
                  {renderSortIcon("employees")}
                </span>
              </div>
            </th>

            <th>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <TextField
                  variant="standard"
                  placeholder="Founded"
                  type="number"
                  value={filters.founded}
                  onChange={(e) => handleFilterChange("founded", e.target.value)}
                  fullWidth
                />
                <span
                  style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  onClick={() => handleSort("founded")}
                >
                  {renderSortIcon("founded")}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <tr key={company.id}>
                <td>{company.id}</td>
                <td>{company.name}</td>
                <td>{company.industry}</td>
                <td>{company.location}</td>
                <td>{company.employees?.toLocaleString()}</td>
                <td>{company.founded}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                {loading ? "Loading..." : "No companies found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination */}

      <div
        style={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          borderTop: "1px solid #ddd",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            color: "#666",
            fontSize: "14px",
          }}
        >
          Results: {startIndex} - {endIndex} of {totalCompanies}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </button>

          <div>
            Page {page} of {totalPages}
          </div>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages || loading}
          >
            Next
          </button>
        </div>
      </div>


      {/* Filter Dialog */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onApply={handleApplyFilter}
      />
    </div>
  );
}

export default CompanyTable;