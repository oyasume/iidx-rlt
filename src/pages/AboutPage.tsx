import {
  Box,
  Typography,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
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
        beatmania IIDXの「ランダムレーンチケット」を有効に活用するためのWebアプリケーションです。
      </Typography>
      <Typography variant="body1" component="p">
        所持しているチケットの中から、探したい配置を簡単に見つけられ、実際にどんな譜面になるのかを確認できます。
      </Typography>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>
        こんな人向け
      </Typography>
      <List>
        {[
          "グッズキャンペーンのためにチケットを大量に購入したが、使い道に困っている",
          "特定の楽曲で「当たり」になるチケットを絞り込みたい",
          "「このチケットを使うとあの曲の譜面はどうなるか」を事前に確認したい",
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
            <Typography variant="h6">当たり配置の検索</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body1" component="p">
              「チケット一覧」ページで、探したい配置の条件を入力して検索します。
            </Typography>
            <Typography variant="body1" component="p">
              多くの楽曲の当たり配置は「ターンテーブル側の3鍵盤」に大きく左右されます。そのため、このツールでは左右3つ・4つの鍵盤を分けて指定して検索できるよう設計されています。
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              <AlertTitle>探し方の例（1P側）</AlertTitle>
              <Box component="ul" sx={{ pl: 2, my: 0, color: "text.secondary" }}>
                <Typography component="li" sx={{ mt: 0.5 }}>
                  rage against usual: 「左側の3鍵盤に、147が来てほしい」
                  <br />→ 【左側】147 【右側】****
                </Typography>
                <Typography component="li" sx={{ mt: 0.5 }}>
                  冥: 「低速の縦連がキツいので、左側に2、右側に3が来てほしい」
                  <br />→ 【左側】2** 【右側】3***
                </Typography>
              </Box>
            </Alert>
          </StepContent>
        </Step>
        <Step active>
          <StepLabel>
            <Typography variant="h6">譜面の確認</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body1" component="p">
              目的のチケットが見つかったら、楽曲を選択してチケット横にあるアイコン
              <LaunchIcon fontSize="inherit" sx={{ verticalAlign: "middle", mx: 0.5 }} />
              を押します。実際の譜面がどうなるかを Textage で確認できます。
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
        本ツールの使用はご自身の責任でお願いいたします。使用により生じたいかなる損害についても、開発者は責任を負いかねます。
      </Typography>
      <Typography variant="caption" color="text.secondary" component="p">
        譜面の表示には外部サイト「
        <Link href="https://textage.cc/" target="_blank" rel="noopener noreferrer">
          Textage
        </Link>
        」様を参照しています。
      </Typography>
    </Box>
  );
};
