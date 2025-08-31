import { Drawer, Paper, useTheme, useMediaQuery } from "@mui/material";
import { Panel } from "./Panel";

interface FloatingPanelProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({ open, onClose, title, children }) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const hasCoarsePointer = useMediaQuery("(pointer: coarse)");
  const useBottomSheet = isSm || hasCoarsePointer;

  if (!open) {
    return null;
  }

  const panelContent = <Panel title={title}>{children}</Panel>;

  if (useBottomSheet) {
    return (
      <Drawer
        anchor="bottom"
        open
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              height: "auto",
              maxHeight: "50vh",
              overflowY: "auto",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            },
          },
        }}
      >
        {panelContent}
      </Drawer>
    );
  }

  return (
    <Paper
      elevation={8}
      sx={(theme) => ({
        position: "fixed",
        bottom: theme.spacing(4),
        right: theme.spacing(4),
        zIndex: theme.zIndex.modal,
        width: theme.spacing(50),
        borderRadius: 3,
        boxShadow: theme.shadows[3],
      })}
    >
      {panelContent}
    </Paper>
  );
};
