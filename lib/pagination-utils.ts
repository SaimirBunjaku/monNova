export type PaginationItem = number | "ellipsis";

const MAX_PAGE_BUTTONS = 5;

export function getVisiblePages(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= MAX_PAGE_BUTTONS) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: PaginationItem[] = [1];

  let rangeStart = Math.max(2, currentPage - 1);
  let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 3) {
    rangeStart = 2;
    rangeEnd = Math.min(4, totalPages - 1);
  } else if (currentPage >= totalPages - 2) {
    rangeStart = Math.max(2, totalPages - 3);
    rangeEnd = totalPages - 1;
  }

  if (rangeStart > 2) {
    pages.push("ellipsis");
  } else {
    for (let page = 2; page < rangeStart; page += 1) {
      pages.push(page);
    }
  }

  for (let page = rangeStart; page <= rangeEnd; page += 1) {
    pages.push(page);
  }

  if (rangeEnd < totalPages - 1) {
    pages.push("ellipsis");
  } else {
    for (let page = rangeEnd + 1; page < totalPages; page += 1) {
      pages.push(page);
    }
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return dedupePaginationItems(pages);
}

export function dedupePaginationItems(
  pages: PaginationItem[],
): PaginationItem[] {
  const result: PaginationItem[] = [];

  for (const page of pages) {
    const previous = result[result.length - 1];

    if (page === "ellipsis" && previous === "ellipsis") {
      continue;
    }

    if (typeof page === "number" && previous === page) {
      continue;
    }

    result.push(page);
  }

  return result;
}
