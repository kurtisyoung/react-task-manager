import { style } from "@vanilla-extract/css";

export const header = style({
  marginBottom: "2rem",
  borderBottom: "1px solid #000000",
});

export const headerContent = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
});

export const headerLink = style({
  marginBlock: "1rem",
  textDecoration: "none",
  transition: "all 100ms ease-in-out",
  ":visited": {
    color: "#000000",
  },
  ":hover": {
    color: "#d1d1d1",
  },
});
