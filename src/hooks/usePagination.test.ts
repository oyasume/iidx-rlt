import { renderHook, act } from "@testing-library/react";
import { usePagination } from "./usePagination";
import { describe, it, expect } from "vitest";

describe("usePagination", () => {
  const items = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));

  it("デフォルトで最初のページのアイテムを返すこと", () => {
    const { result } = renderHook(() => usePagination(items, 10));
    expect(result.current.paginatedItems).toHaveLength(10);
    expect(result.current.paginatedItems[0].id).toBe(1);
    expect(result.current.pageCount).toBe(10);
  });

  it("handlePageChangeでページが切り替わること", () => {
    const { result } = renderHook(() => usePagination(items, 10));

    act(() => {
      // @ts-expect-error イベントオブジェクトはテストでは不要なためnull
      result.current.handlePageChange(null, 3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.paginatedItems[0].id).toBe(21);
  });

  it("itemsが変わると1ページ目に戻ること", () => {
    const { result, rerender } = renderHook(({ items }) => usePagination(items, 10), {
      initialProps: { items },
    });

    act(() => {
      // @ts-expect-error イベントオブジェクトはテストでは不要なためnull
      result.current.handlePageChange(null, 5);
    });
    expect(result.current.currentPage).toBe(5);

    rerender({ items: [{ id: 1 }, { id: 2 }, { id: 3 }] });

    expect(result.current.currentPage).toBe(1);
  });

  it("handleItemsPerPageChangeで表示件数が変わること", () => {
    const { result } = renderHook(() => usePagination(items, 10));
    expect(result.current.pageCount).toBe(10);

    act(() => {
      // @ts-expect-error イベントオブジェクトはテストでは不要なためnull
      result.current.handleItemsPerPageChange(null, 20);
    });

    expect(result.current.itemsPerPage).toBe(20);
    expect(result.current.pageCount).toBe(5);
  });
});
