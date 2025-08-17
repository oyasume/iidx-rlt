import { Helmet } from "react-helmet-async";
import { TicketViewPage } from "./TicketViewPage";

export const HomePage: React.FC = () => {
  return (
    <>
      <TicketViewPage />
      <Helmet>
        <title>RLT Manager</title>
        <meta property="og:title" content="RLT Manager" />
        <meta name="twitter:title" content="RLT Manager" />
      </Helmet>
    </>
  );
};
