import { Container, Typography, Alert, Divider, Box, CircularProgress } from "@mui/material";
import { useState, useMemo } from "react";
import { useFetchTodos } from "./hooks/useFetchTodos";
import { Pagination, TodoList, AddTodoForm } from "./components";
import { MAX_PAGE, MAX_ITEMS, ITEMS_PER_PAGE, type Todo } from "./types/todo.types";

type LocalChanges = {
  added: Todo[];
  deleted: Set<number>;
  toggled: Set<number>;
  edited: Map<number, string>;
};

export default function App() {
  const { pages, loading, error } = useFetchTodos();
  const [currentPage, setCurrentPage] = useState(1);
  const [localChanges, setLocalChanges] = useState<LocalChanges>({
    added: [],
    deleted: new Set(),
    toggled: new Set(),
    edited: new Map(),
  });

  const handlePrevious = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(MAX_PAGE, prev + 1));

  const allTodos = useMemo(() => {
    const fetchedTodos: Todo[] = [];
    for (let i = 1; i <= MAX_PAGE; i++) {
      fetchedTodos.push(...(pages[i] || []));
    }

    const withChanges = fetchedTodos
      .filter((todo) => !localChanges.deleted.has(todo.id))
      .map((todo) => ({
        ...todo,
        completed: localChanges.toggled.has(todo.id) ? !todo.completed : todo.completed,
        title: localChanges.edited.get(todo.id) ?? todo.title,
      }));

    return [...localChanges.added, ...withChanges];
  }, [pages, localChanges]);

  const totalPages = Math.max(1, Math.ceil(allTodos.length / ITEMS_PER_PAGE));
  const currentTodos = allTodos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAdd = (title: string) => {
    if (allTodos.length >= MAX_ITEMS) return;

    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    };

    setLocalChanges((prev) => ({
      ...prev,
      added: [newTodo, ...prev.added],
    }));
    setCurrentPage(1);
  };

  const handleToggle = (id: number) => {
    setLocalChanges((prev) => {
      const toggled = new Set(prev.toggled);
      if (toggled.has(id)) {
        toggled.delete(id);
      } else {
        toggled.add(id);
      }
      return { ...prev, toggled };
    });
  };

  const handleDelete = (id: number) => {
    setLocalChanges((prev) => {
      const added = prev.added.filter((t) => t.id !== id);
      const deleted = new Set(prev.deleted);
      deleted.add(id);
      return { ...prev, added, deleted };
    });
  };

  const handleEdit = (id: number, title: string) => {
    setLocalChanges((prev) => {
      const addedIndex = prev.added.findIndex((t) => t.id === id);
      if (addedIndex !== -1) {
        const added = [...prev.added];
        added[addedIndex] = { ...added[addedIndex], title };
        return { ...prev, added };
      }
      const edited = new Map(prev.edited);
      edited.set(id, title);
      return { ...prev, edited };
    });
  };

  const showLoading = loading;
  const showError = error;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Todos
      </Typography>

      <AddTodoForm
        onAdd={handleAdd}
        disabled={allTodos.length >= MAX_ITEMS}
        isLoading={showLoading || !!showError}
      />

      {showError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {showError}
        </Alert>
      )}
      {showLoading ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="30vh"
          gap={2}
        >
          <CircularProgress size={40} />
          <Typography color="text.secondary">Loading todos...</Typography>
        </Box>
      ) : (
        <>
          {!showError && (
            <>
              <TodoList
                todos={currentTodos}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />

              <Divider sx={{ my: 2 }} />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            </>
          )}
        </>
      )}

    </Container>
  );
}
