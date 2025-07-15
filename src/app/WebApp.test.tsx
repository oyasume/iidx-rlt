import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { WebApp } from "./WebApp";
import * as AppSettingsHook from "../hooks/useAppSettings";

const useAppSettingsSpy = vi.spyOn(AppSettingsHook, "useAppSettings");

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <MemoryRouter>{children}</MemoryRouter>;
};

describe("WebApp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("isLoadingがtrueの場合、ローディングメッセージが表示される", () => {
    useAppSettingsSpy.mockReturnValue({
      isLoading: true,
      settings: { playSide: "1P" },
      updatePlaySide: vi.fn(),
    });
    render(<WebApp />, { wrapper: Wrapper });

    expect(screen.getByText("設定を読み込んでいます...")).toBeInTheDocument();
  });

  it("isLoadingがfalseの場合、メインコンテンツがレンダリングされる", async () => {
    useAppSettingsSpy.mockReturnValue({
      isLoading: false,
      settings: { playSide: "1P" },
      updatePlaySide: vi.fn(),
    });
    render(<WebApp />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("チケット一覧")).toBeInTheDocument();
    });
  });
});
