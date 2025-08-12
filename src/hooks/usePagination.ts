import { useState, useMemo, useEffect, useCallback } from "react";

export const usePagination = <T>(items: T[], initialItemsPerPage = 50) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // ページング対象のアイテムリストや表示件数が変わったら1ページ目に戻す
  useEffect(() => {
    setCurrentPage(1);
  }, [items, itemsPerPage]);

  const pageCount = useMemo(() => Math.ceil(items.length / itemsPerPage), [items.length, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const handleItemsPerPageChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newItemsPerPage: number | null) => {
      if (newItemsPerPage !== null) {
        setItemsPerPage(newItemsPerPage);
      }
    },
    []
  );

  return {
    currentPage,
    itemsPerPage,
    pageCount,
    paginatedItems,
    handlePageChange,
    handleItemsPerPageChange,
  };
};
