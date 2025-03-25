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
  borderBottom: "1px solid #000000",
  fontSize: "1rem",
  ":focus": {
    outline: "none",
    borderColor: "#d1d1d1",
  },
});

export const button = style({
  width: "100%",
  padding: "0.75rem",
  backgroundColor: "#000000",
  color: "white",
  border: "none",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 100ms ease-in-out",
  marginTop: "1rem",
  ":hover": {
    backgroundColor: "#d1d1d1",
  },
  ":disabled": {
    backgroundColor: "#c8c8c8",
    cursor: "not-allowed",
  },
});

export const errorMessage = style({
  color: "#e53e3e",
  marginTop: "0.5rem",
  fontSize: "0.875rem",
});
