import { PaginationMeta } from "../orval/model"

interface ListResponse {
  meta: PaginationMeta
}

export const getNextPageParam = (lastPage: ListResponse) => {
  if (lastPage.meta.currentPage === lastPage.meta.totalPages) {
    return undefined
  }
  return lastPage.meta.currentPage + 1
}
