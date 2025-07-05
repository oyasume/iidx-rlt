import { createRoot } from "react-dom/client";
import { Ticket } from "../types";
import Tool from "../Tool";

/**
 * チケットリストの要素からチケット情報を抽出する
 * @param element 抽出対象のHTMLElement
 * @returns 抽出されたチケット情報の配列
 *
 * 公式サイトの構造
 * <div id="ticket-list">
 *   <ul class="head inner">（li3つ）</ul>
 *   <ul class="inner">
 *     <li>（配置）</li>
 *     <li>（期限）</li>
 *     <li>（リサイクルチェックボックス）</li>
 *   </ul>
 * </div>
 */
export const extractTicketsFromDOM = (element: HTMLElement): Ticket[] => {
  const ticketULs = Array.from(element.querySelectorAll("ul.inner"));

  return ticketULs.slice(1).map((ticketUL) => {
    const laneTextNode = ticketUL.querySelector("li")!;
    const laneText = laneTextNode.textContent!.trim();
    const expirationNode = ticketUL.querySelector("li:nth-child(2)")!;
    const expiration = expirationNode.textContent!.trim();

    return {
      laneText,
      expiration,
    };
  });
};

const insertTool = () => {
  const ticketListContainer = document.getElementById("ticket-list")!;
  if (!ticketListContainer) {
    console.log("チケット一覧が見つからない");
    return;
  }

  const tickets = extractTicketsFromDOM(ticketListContainer);

  const toolContainer = document.createElement("div");
  toolContainer.id = "tool-root";
  ticketListContainer.insertAdjacentElement("beforebegin", toolContainer);

  const root = createRoot(toolContainer);

  root.render(<Tool tickets={tickets} />);
};

insertTool();
