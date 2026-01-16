import { useState } from "react";
import { ListItem, ListItemText, Chip, IconButton, TextField, Box } from "@mui/material";
import { Delete, Edit, Check, Close } from "@mui/icons-material";
import { type Todo } from "../types/todo.types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, title: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(todo.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <ListItem divider sx={{ gap: 2 }}>
      <Chip
        label={todo.completed ? "Completed" : "Pending"}
        color={todo.completed ? "success" : "default"}
        size="small"
        onClick={() => onToggle(todo.id)}
        sx={{ cursor: "pointer", flexShrink: 0 }}
      />
      {isEditing ? (
        <TextField
          size="small"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          autoFocus
          fullWidth
          sx={{ flex: 1 }}
        />
      ) : (
        <ListItemText
          primary={todo.title}
          sx={{ flex: 1, minWidth: 0 }}
        />
      )}
      <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
        {isEditing ? (
          <>
            <IconButton size="small" onClick={handleSave} color="primary">
              <Check />
            </IconButton>
            <IconButton size="small" onClick={handleCancel}>
              <Close />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(todo.id)} color="error">
              <Delete />
            </IconButton>
          </>
        )}
      </Box>
    </ListItem>
  );
}
