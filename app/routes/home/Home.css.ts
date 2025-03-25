import { style } from "@vanilla-extract/css";

export const loginForm = style({
  width: "100%",
  maxWidth: "400px",
});

export const formGroup = style({
  marginBottom: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

export const input = style({
  width: "100%",
  padding: "0.75rem 0 0.75rem",
  border: "none",
  borderBottom: "1px solid var(--colour-black)",
  fontSize: "1rem",
  ":focus": {
    outline: "none",
    borderColor: "var(--colour-grey)",
  },
});

export const button = style({
  width: "100%",
  padding: "0.75rem",
  backgroundColor: "var(--colour-black)",
  color: "var(--colour-white)",
  border: "none",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 100ms ease-in-out",
  marginTop: "1rem",
  ":hover": {
    backgroundColor: "var(--colour-grey)",
  },
  ":disabled": {
    backgroundColor: "var(--colour-grey)",
    cursor: "not-allowed",
  },
});

export const errorMessage = style({
  color: "var(--colour-red)",
  marginTop: "0.5rem",
  fontSize: "0.875rem",
});
