import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { WebApp } from "./WebApp";
import * as AppSettingsHook from "../hooks/useAppSettings";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

  describe("リダイレクト", () => {
    beforeEach(() => {
      useAppSettingsSpy.mockReturnValue({
        isLoading: false,
        settings: { playSide: "1P" },
        updatePlaySide: vi.fn(),
      });
    });

    it("sessionStorageにリダイレクトパスがない場合、navigateは呼ばれない", async () => {
      render(<WebApp />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    it("sessionStorageにリダイレクトパスがある場合、そのパスでnavigateが呼ばれる", async () => {
      sessionStorage.setItem("redirect", "/test-path");
      render(<WebApp />, { wrapper: Wrapper });
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith("/test-path", { replace: true });
      });
    });

    it("navigateが呼ばれた後、sessionStorageからキーが削除される", async () => {
      sessionStorage.setItem("redirect", "/test-path");
      render(<WebApp />, { wrapper: Wrapper });

      await waitFor(() => {
        expect(sessionStorage.getItem("redirect")).toBeNull();
      });
    });
  });
});
