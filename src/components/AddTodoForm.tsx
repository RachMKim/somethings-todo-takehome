import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

interface AddTodoFormProps {
  onAdd: (title: string) => void;
  disabled: boolean;
  isLoading: boolean;
}

export function AddTodoForm({ onAdd, disabled, isLoading }: AddTodoFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && !disabled) {
      onAdd(title.trim());
      setTitle("");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <Box display="flex" gap={1} alignItems="flex-start">
        <TextField
          size="small"
          fullWidth
          placeholder="Add a new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled || isLoading}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={disabled || isLoading || !title.trim()}
          startIcon={<Add />}
          sx={{ mt: "2px" }}
        >
          Add
        </Button>
      </Box>
      {!isLoading && disabled && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
          Maximum 20 todos reached. Delete one to add more.
        </Typography>
      )}
    </Box>
  );
}
