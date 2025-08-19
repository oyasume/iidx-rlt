import { renderHook, act } from "@testing-library/react";
import { useImporter } from "./useImporter";
import { describe, beforeEach, it, expect, vi } from "vitest";

describe("useImporter", () => {
  const onImportMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    onImportMock.mockReset();
  });

  describe("正常系", () => {
    it("初期状態", () => {
      const { result } = renderHook(() => useImporter(onImportMock));

      expect(result.current.state.status).toBe("idle");
      expect(result.current.state.error).toBeNull();
      expect(result.current.state.importedCount).toBe(0);
    });

    it("インポート開始", () => {
      onImportMock.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useImporter(onImportMock));

      act(() => {
        void result.current.importTickets("[]");
      });

      expect(result.current.state.status).toBe("loading");
      expect(result.current.state.error).toBeNull();
    });

    it("インポート成功", async () => {
      const { result } = renderHook(() => useImporter(onImportMock));
      const mockTickets = [{ laneText: "1234567" }, { laneText: "7654321" }];

      await act(async () => {
        await result.current.importTickets(JSON.stringify(mockTickets));
      });

      expect(onImportMock).toHaveBeenCalledWith(mockTickets);
      expect(result.current.state.status).toBe("success");
      expect(result.current.state.importedCount).toBe(mockTickets.length);
      expect(result.current.state.error).toBeNull();
    });

    it("リセットで初期状態に戻る", async () => {
      const { result } = renderHook(() => useImporter(onImportMock));

      await act(async () => {
        await result.current.importTickets("");
      });
      expect(result.current.state.status).toBe("error");
      act(() => {
        result.current.resetStatus();
      });

      expect(result.current.state.status).toBe("idle");
      expect(result.current.state.error).toBeNull();
      expect(result.current.state.importedCount).toBe(0);
    });
  });

  describe("異常系", () => {
    it("インポート失敗: 空文字列", async () => {
      const { result } = renderHook(() => useImporter(onImportMock));

      await act(async () => {
        await result.current.importTickets("");
      });

      expect(result.current.state.status).toBe("error");
      expect(result.current.state.error).toBe("インポートするチケットデータがありません。");
    });

    it("インポート失敗: 不正な形式", async () => {
      const { result } = renderHook(() => useImporter(onImportMock));

      await act(async () => {
        await result.current.importTickets("test");
      });

      expect(result.current.state.status).toBe("error");
      expect(result.current.state.error).toContain("チケットデータの形式が正しくありません。");
    });

    it("インポート失敗: 配列ではない形式", async () => {
      const { result } = renderHook(() => useImporter(onImportMock));

      await act(async () => {
        await result.current.importTickets("{}");
      });

      expect(result.current.state.status).toBe("error");
      expect(result.current.state.error).toBe("データが配列形式になっていません。");
    });

    it("インポート失敗: 予期せぬエラー", async () => {
      onImportMock.mockRejectedValueOnce(new Error("予期せぬエラー"));
      const { result } = renderHook(() => useImporter(onImportMock));

      await act(async () => {
        await result.current.importTickets("[]");
      });

      expect(result.current.state.status).toBe("error");
      expect(result.current.state.error).toContain("チケットのインポート中に予期せぬエラーが発生しました。");
    });
  });
});
