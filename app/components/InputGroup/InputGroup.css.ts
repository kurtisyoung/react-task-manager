import { style } from "@vanilla-extract/css";

export const inputGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const label = style({
  fontSize: "1rem",
  fontWeight: "bold",
});

export const input = style({
  padding: "0.75rem 0 0.75rem",
  border: "none",
  borderBottom: "1px solid #000000",
  fontSize: "1rem",
  height: "1.35rem",
  transition: "all 100ms ease-in-out",
  ":focus": {
    outline: "none",
    borderColor: "#d1d1d1",
  },
});
