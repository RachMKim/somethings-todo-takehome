import { useQueries } from "@tanstack/react-query";
import {
  ITEMS_PER_PAGE,
  PAGE_NUMBERS,
  TODO_DATA_ENDPOINT,
  type PageData,
  type Todo,
} from "../types/todo.types";

const fetchTodos = async (page: number): Promise<Todo[]> => {
  const res = await fetch(
    `${TODO_DATA_ENDPOINT}?_page=${page}&_limit=${ITEMS_PER_PAGE}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch todo data at page ${page}`);
  }
  return res.json();
};

export const useFetchTodos = () => {
  const queries = useQueries({
    queries: PAGE_NUMBERS.map((page) => ({
      queryKey: ["todos", page],
      queryFn: () => fetchTodos(page),
      staleTime: Infinity,
    })),
  });

  const loading = queries.some((q) => q.isLoading);
  const error = queries.find((q) => q.error)?.error?.message ?? "";

  const pages: PageData = {};

  queries.forEach((query, index) => {
    pages[PAGE_NUMBERS[index]] = query.data ?? [];
  });

  return { pages, loading, error };
};
