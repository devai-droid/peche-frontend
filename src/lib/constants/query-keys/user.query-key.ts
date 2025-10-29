export const userKeys = {
  all: ["users"],
  me: ["me"],
  user: (id: number) => [...userKeys.all, id],
  lists: () => [...userKeys.all, "list"],
  list: (filters: string) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, "detail"],
  detail: (id: number) => [...userKeys.details(), id],
} as const
