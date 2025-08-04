import { Link, type LinkProps } from "@mui/material";
import ReactGA from "react-ga4";

export type HashtagLinkProps = Omit<LinkProps, "href" | "target" | "rel" | "aria-label" | "children">;

const handleHashtagClick = () => {
  ReactGA.event({
    category: "UserAction",
    action: "Click Hashtag",
  });
};

export const HashtagLink = (props: HashtagLinkProps) => {
  return (
    <Link
      href="https://twitter.com/search?q=%23RLTManager"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="RLTManager"
      onClick={handleHashtagClick}
      {...props}
    >
      #RLTManager
    </Link>
  );
};
