import { describe, expect, it } from "vitest";
import { makeTextageUrl } from "./makeTextageUrl";

describe("makeTextageUrl", () => {
  it("1Pの正しいURLを生成する", () => {
    const song = {
      title: "A(A)",
      url: "https://textage.cc/score/7/a_amuro.html?1AC00",
      level: 12,
    };
    const url = makeTextageUrl(song, "1P", "1234567");
    expect(url).toBe("https://textage.cc/score/7/a_amuro.html?1AC00R1234567");
  });

  it("2Pの正しいURLを生成する", () => {
    const song = {
      title: "A(A)",
      url: "https://textage.cc/score/7/a_amuro.html?1AC00",
      level: 12,
    };
    const url = makeTextageUrl(song, "2P", "1234567");
    expect(url).toBe("https://textage.cc/score/7/a_amuro.html?2AC00R1234567");
  });
});
