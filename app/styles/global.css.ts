import { globalStyle, style } from "@vanilla-extract/css";

globalStyle("html", {
  fontFamily: "Arial, sans-serif",
  maxWidth: "800px",
  margin: "0 auto",
  padding: "2rem 1rem",
  vars: {
    "--colour-black": "#1a1a1a",
    "--colour-white": "#ffffff",
    "--colour-grey": "#6b7280",
    "--colour-blue": "#2563eb",
    "--colour-red": "#dc2626",
    "--colour-green": "#16a34a",
  },
});
