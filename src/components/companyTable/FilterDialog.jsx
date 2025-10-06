import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FunctionsIcon from "@mui/icons-material/Functions";
import CheckIcon from "@mui/icons-material/Check";

function FilterDialog({ open, onClose, onApply }) {
  const [field, setField] = useState("");
  const [operator, setOperator] = useState("");
  const [value, setValue] = useState("");

  const fieldTypes = {
    id:"number",
    name: "string",
    industry: "string",
    location: "string",
    employees: "number",
    founded: "number",
  };

  const operatorOptions = {
    string: [
      { value: "contains", label: "Contains", icon: <SearchIcon fontSize="small" /> },
      { value: "equals", label: "Equals", icon: <TextFieldsIcon fontSize="small" /> },
      { value: "startsWith", label: "Starts With", icon: <ArrowForwardIcon fontSize="small" /> },
      { value: "endsWith", label: "Ends With", icon: <ArrowBackIcon fontSize="small" /> },
      { value: "doesNotContain", label: "Does Not Contain", icon: <NotInterestedIcon fontSize="small" /> },
    ],
    number: [
      { value: "gt", label: "Greater Than", icon: <ArrowUpwardIcon fontSize="small" /> },
      { value: "gte", label: "Greater or Equal", icon: <FunctionsIcon fontSize="small" /> },
      { value: "lt", label: "Less Than", icon: <ArrowDownwardIcon fontSize="small" /> },
      { value: "lte", label: "Less or Equal", icon: <FunctionsIcon fontSize="small" /> },
      { value: "eq", label: "Equals", icon: <CheckIcon fontSize="small" /> },
    ],
  };

  const handleApply = () => {
    if (field && operator && value !== "") {
      onApply({ field, operator, value });
      setField("");
      setOperator("");
      setValue("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <FilterAltIcon style={{ marginRight: "5px" }} /> Create Filter
      </DialogTitle>
      <DialogContent style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "10px" }}>
        <FormControl fullWidth>
          <InputLabel>Field</InputLabel>
          <Select
            value={field}
            label="Field"
            onChange={(e) => {
              setField(e.target.value);
              setOperator("");
            }}
          >
            {Object.keys(fieldTypes).map((f) => (
              <MenuItem key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {field && (
          <FormControl fullWidth>
            <InputLabel>Operator</InputLabel>
            <Select
              value={operator}
              label="Operator"
              onChange={(e) => setOperator(e.target.value)}
            >
              {operatorOptions[fieldTypes[field]].map((op) => (
                <MenuItem key={op.value} value={op.value} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {op.icon} {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {field && (
          <TextField
            label="Value"
            type={fieldTypes[field] === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleApply} variant="contained" color="primary">
          Create Filter
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FilterDialog;
