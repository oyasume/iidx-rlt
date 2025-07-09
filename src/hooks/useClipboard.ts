import { useState, useCallback } from "react";

export const useClipboard = (resetDelay = 2000) => {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = useCallback(
    async (text: string) => {
      setError(null);
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), resetDelay);
      } catch (e) {
        setError(`クリップボードへのコピーに失敗しました: ${e as string}`);
        setIsCopied(false);
      }
    },
    [resetDelay]
  );

  return { copyToClipboard, isCopied, error };
};
