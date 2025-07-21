import {
  Box,
  Typography,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LaunchIcon from "@mui/icons-material/Launch";
import { GitHubLink } from "../components/links/GitHubLink";
import { XLink } from "../components/links/XLink";

export const AboutPage = () => {
  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          このツールについて
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <GitHubLink />
        <XLink />
      </Box>
      <Typography variant="body1" component="p">
        KONAMIの音楽ゲーム beatmania IIDX
        の「ランダムレーンチケット」を有効に活用するための非公式Webアプリケーションです。
      </Typography>
      <Box component="details" sx={{ mt: 2 }}>
        <Box component="summary" sx={{ cursor: "pointer" }}>
          <strong>ランダムレーンチケットとは？</strong>
        </Box>
        <Typography sx={{ mt: 1, pl: 2 }}>
          通常、プレイごとに譜面が変わるRANDOMオプションに対し、譜面をチケット記載の配置に固定できる課金アイテムです。
          <Link
            href="https://p.eagate.573.jp/game/2dx/32/howto/lightning_model/random_lane.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            IIDX公式のヘルプページ
          </Link>
          で詳細が確認できます。
        </Typography>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>
        こんな人向け
      </Typography>
      <List>
        {[
          "グッズキャンペーンのためにチケットを大量に購入したが、どの曲で使えばいいのか分からない",
          "チケットを絞り込んで、あの曲で当たり配置になるものがあるか確認したい",
          "このチケットを使うとあの曲の譜面はどうなるのか、をプレイ前に確認したい",
        ].map((text, idx) => (
          <ListItem key={idx} disableGutters>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={text} slotProps={{ primary: { variant: "body1" } }} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>
        使い方
      </Typography>
      <Stepper orientation="vertical" sx={{ mt: 2 }}>
        <Step active>
          <StepLabel>
            <Typography variant="h6">チケットのインポート</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body1" component="p">
              「インポート」ページにあるブックマークレットを使い、公式サイトからチケットを取り込みます。データはブラウザ内にのみ保存されます。
            </Typography>
          </StepContent>
        </Step>
        <Step active>
          <StepLabel>
            <Typography variant="h6">チケットの活用先を考える</Typography>
          </StepLabel>
          <StepContent>
            <List>
              {[
                [
                  "【チケットの使い道が分からない方】 当たり配置候補の確認",
                  "チケット一覧で各チケットをタップ（クリック）すると、当たり配置の可能性がある曲の候補が表示されます。",
                ],
                [
                  "【探したい配置がある方】 チケットの検索",
                  "「皿側が135」のような特定の配置をもつチケットを絞り込めます。",
                ],
              ].map((texts, idx) => (
                <ListItem key={idx} disableGutters>
                  <ListItemIcon sx={{ minWidth: 40, alignSelf: "flex-start", mt: 1 }}>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={texts[0]} secondary={texts[1]} />
                </ListItem>
              ))}
            </List>
          </StepContent>
        </Step>
        <Step active>
          <StepLabel>
            <Typography variant="h6">譜面の確認</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body1" component="p">
              当たり配置候補として表示された曲は、そのままアイコン
              <LaunchIcon fontSize="inherit" sx={{ verticalAlign: "middle", mx: 0.25 }} />
              をクリックすれば、Textageで譜面を確認できます。
            </Typography>
            <Typography variant="body1" component="p" sx={{ mt: 2 }}>
              チケット一覧の上にある「楽曲を選択」から曲を選ぶと、所持チケットの横にアイコンが表示され、譜面が確認できます。
            </Typography>
          </StepContent>
        </Step>
      </Stepper>
      <Divider sx={{ my: 4 }} />
      <Typography variant="caption" color="text.secondary" component="p">
        beatmaniaは株式会社コナミデジタルエンタテインメントの登録商標です。
        本アプリケーションは個人で開発・公開している非公式のツールです。当該法人および関連企業とは一切関係ありません。
      </Typography>
      <Typography variant="caption" color="text.secondary" component="p">
        譜面リンクには外部サイト「
        <Link href="https://textage.cc/" target="_blank" rel="noopener noreferrer">
          Textage
        </Link>
        」様を参照しています。サイトへ過度な負荷をかけないよう、リンクの利用は良識の範囲内でお願い致します。
      </Typography>
      <Typography variant="caption" color="text.secondary" component="p">
        本アプリケーションの使用はご自身の責任でお願いいたします。使用により生じたいかなる損害についても、開発者は責任を負いかねます。
      </Typography>
      <Typography variant="caption" color="text.secondary" component="p">
        本アプリケーションはオープンソースソフトウェアを利用しています。ライセンス情報は
        <Link
          href="https://github.com/oyasume/iidx-rlt/blob/main/THIRD_PARTY_NOTICES.txt"
          target="_blank"
          rel="noopener noreferrer"
        >
          こちら
        </Link>
        をご覧ください。
      </Typography>
    </Box>
  );
};
