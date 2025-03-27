import { style } from "@vanilla-extract/css";

export const inputGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  position: "relative",
});

export const label = style({
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "var(--colour-black)",
});

export const input = style({
  padding: "0.75rem 0 0.75rem 0",
  marginBottom: "2rem",
  border: "none",
  borderBottom: "1px solid var(--colour-black)",
  fontSize: "1rem",
  ":focus": {
    outline: "2px solid var(--colour-blue)",
    outlineOffset: "2px",
  },
  selectors: {
    "&.error": {
      borderColor: "var(--colour-red)",
    },
    "&.error:focus": {
      outlineColor: "var(--colour-red)",
    },
  },
});

export const error = style({
  borderColor: "var(--colour-red)",
});

export const errorMessage = style({
  color: "var(--colour-red)",
  fontSize: "0.875rem",
  marginTop: "0.25rem",
  position: "absolute",
  bottom: "0",
});
