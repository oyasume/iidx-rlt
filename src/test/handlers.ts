import { http, HttpResponse } from "msw";

const MOCK_VERSION = { version: "test-version" };
const MOCK_ATARI_RULES = [
  {
    id: "test-id-1",
    songTitle: "rage against usual",
    priority: 1,
    description: "",
    patterns: [
      {
        scratchSideText: "147",
        isScratchSideUnordered: true,
        nonScratchSideText: "****",
        isNonScratchSideUnordered: false,
      },
    ],
  },
];

const MOCK_SONGS = [
  {
    title: "冥(A)",
    url: "https://textage.cc/score/12/_mei.html?1AC00",
    level: 12,
  },
  {
    title: "rage against usual(A)",
    url: "https://textage.cc/score/12/rageagst.html?1AC00",
    level: 12,
  },
];

export const handlers = [
  http.get("*/iidx-rlt/data/version.json", () => {
    return HttpResponse.json(MOCK_VERSION);
  }),
  http.get("*/iidx-rlt/data/atari-rules.json", () => {
    return HttpResponse.json(MOCK_ATARI_RULES);
  }),
  http.get("*/iidx-rlt/data/songs.json", () => {
    return HttpResponse.json(MOCK_SONGS);
  }),
];
