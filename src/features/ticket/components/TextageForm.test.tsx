import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SongInfo } from "../../../types";
import { TextageForm } from "./TextageForm";

describe("TextageForm", () => {
  const song: SongInfo = {
    title: "A(A)",
    url: "https://textage.cc/score/7/a_amuro.html?1AC00",
    level: 12,
  };
  const songs: SongInfo[] = [song];

  it("曲を選択できる", async () => {
    const user = userEvent.setup();
    const onSongSelect = vi.fn();
    render(<TextageForm songs={songs} selectedSong={null} onSongSelect={onSongSelect} />);

    const autocomplete = screen.getByLabelText("楽曲を選択");
    await user.click(autocomplete);
    await user.type(autocomplete, "A");
    const songOption = await screen.findByText("A(A)");
    await user.click(songOption);

    expect(onSongSelect).toHaveBeenCalledWith(song);
  });
});
