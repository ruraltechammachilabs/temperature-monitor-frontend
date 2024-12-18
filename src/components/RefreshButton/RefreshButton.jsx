import { useState } from "react";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import "../../styles/RefreshButton.css"; // Custom CSS file for animation

const RefreshButton = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent multiple clicks
    setIsRefreshing(true);
    await onRefresh(); // Call your refresh function
    setIsRefreshing(false);
  };

  return (
    <IconButton
      onClick={handleRefresh}
      className={isRefreshing ? "refresh-icon rotating" : "refresh-icon"}
      aria-label="refresh"
      color="primary"
      sx={{
        display: 'flex'
      }}
    >
      <RefreshIcon />
    </IconButton>
  );
};

export default RefreshButton;
