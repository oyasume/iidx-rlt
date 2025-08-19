# RLT Manager

公開先: https://oyasume.github.io/iidx-rlt/

KONAMIの音楽ゲーム「beatmania IIDX」における、「ランダムレーンチケット」（譜面の配置を固定できるアイテム）の活用を支援するツールです。

主に以下の機能を提供します。

- 当たり配置になる曲の推薦: 所持チケットをどの曲で使えばいいのかわからない人向けに、曲を推薦する機能
- チケット検索: 大量のチケットを所持している人向けの、探したいチケットを絞り込む機能
- Textageへのリンク: チケット使用時の譜面を確認するため、外部サイト [Textage](https://textage.cc/) を参照するリンク

<details>
<summary><strong>ランダムレーンチケットについて</strong></summary>

通常、プレイごとに譜面（ノーツの配置）が変わるRANDOMオプションに対し、譜面をチケット記載の配置に固定できる課金アイテムです。

[IIDXの公式サイト](https://p.eagate.573.jp/game/2dx/32/howto/lightning_model/random_lane.html)

</details>

## 背景

以下のような悩みをTwitterで見かけ、**一見価値のないチケットが実は有効活用できる**ことを知れるツールがあったら便利なのでは思って本ツールを開発しました。

- チケットをどの曲で使えばいいかわからない、使わずに期限切れになる
  - 当たり配置の知識がないと使う気が起きない
- 大量に購入したのに当たりチケットが1つもなかった
  - 実はよく知られた配置（246....）以外のチケットにも使い道があることを知らない

これらの悩みを解消するため、いわゆる「当たり配置」になる曲を推薦します。
なにが当たり配置なのかの定義は主観が入りますが、「譜面の難所が左右に分かれて簡単になる」を基準に、なるべく多くのプレイヤーに当てはまるようにしています。

曲ごとの当たり配置定義は、 [Google Spread Sheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vTvdia8KZZiRbJ8WmaaFw64HixFWuuYP3HuxYzqfAYKvDso8ITI0OWITchKiv04T57uD2vk0bm9sMFx/pubhtml) で管理しています。

## 構成

- React, TypeScript, Vite
- Material-UI, React Hook Form, Zod
- ESLint, Prettier
- Vitest, Testing Library, GitHub Actions
