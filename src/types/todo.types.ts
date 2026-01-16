export type Todo = {
id: number;
title: string;
completed: boolean;
userId?: number;
}

export type PageData = Record<number, Todo[]>;

export const MAX_PAGE = 4 
export const ITEMS_PER_PAGE = 5
export const MAX_ITEMS = MAX_PAGE * ITEMS_PER_PAGE
export const TODO_DATA_ENDPOINT = `https://jsonplaceholder.typicode.com/todos`
export const PAGE_NUMBERS = Array.from({ length: MAX_PAGE }, (_, i) => i + 1);



