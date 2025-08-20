import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1a1f35", // Deep navy blue - royal foundation
      light: "#2a304a", // Lighter navy for highlights
      dark: "#121625", // Darker navy for depth
    },
    secondary: {
      main: "#b89f65", // Muted antique gold
      light: "#d4bc84", // Lighter gold for accents
      dark: "#8a7549", // Darker gold for depth
    },
    alternate: {
      main: "#2d3447", // Dark slate blue for cards/sections
    },
    background: {
      default: "#0d1117", // Very dark blue-black background
      paper: "#1c2230", // Slightly lighter dark for paper surfaces
    },
    text: {
      primary: "#e8e6e3", // Soft off-white for primary text
      secondary: "#a8a6a0", // Muted grey for secondary text
    },
    divider: "rgba(184, 159, 101, 0.2)", // Subtle gold divider
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontWeight: 700,
      color: "#b89f65", // Gold headings for royal emphasis
    },
    h2: {
      fontWeight: 700,
      color: "#b89f65",
    },
    h3: {
      fontWeight: 600,
      color: "#e8e6e3",
    },
    h4: {
      fontWeight: 600,
      color: "#e8e6e3",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1f35",
          borderBottom: "1px solid rgba(184, 159, 101, 0.3)",
        },
      },
    },
    // --- UPDATED ---
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1c2230", // Use the default paper color
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#2d3447", // Use the alternate color for cards to stand out
          border: "1px solid rgba(184, 159, 101, 0.15)",
        },
      },
    },
    // --- NEW ---
    MuiButton: {
      styleOverrides: {
        // Style for the main, contained button
        containedPrimary: {
          backgroundColor: "#b89f65", // Gold background
          color: "#1a1f35", // Navy text
          "&:hover": {
            backgroundColor: "#d4bc84", // Lighter gold on hover
          },
        },
        // Style for the secondary, outlined button
        outlinedPrimary: {
          borderColor: "#b89f65",
          color: "#b89f65",
          "&:hover": {
            borderColor: "#d4bc84",
            backgroundColor: "rgba(184, 159, 101, 0.1)", // Subtle gold glow on hover
            color: "#d4bc84",
          },
        },
      },
    },
    // --- NEW ---
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#b89f65", // Gold border on focus
            },
          },
          "& label.Mui-focused": {
            color: "#b89f65", // Gold label on focus
          },
        },
      },
    },
    // --- NEW ---
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#d4bc84", // Lighter gold for links to be visible
          textDecorationColor: "rgba(212, 188, 132, 0.4)",
        },
      },
    },
  },
});

export default theme;
