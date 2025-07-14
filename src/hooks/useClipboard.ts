import { useCallback } from "react";
import { useSnackbar } from "../contexts/SnackbarContext";

export const useClipboard = () => {
  const { showSnackbar } = useSnackbar();

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showSnackbar("クリップボードにコピーしました", "success");
      } catch (e) {
        showSnackbar(`コピーに失敗しました: ${e as string}`, "error");
      }
    },
    [showSnackbar]
  );

  return { copyToClipboard };
};
