import { style } from "@vanilla-extract/css";

export const form = style({
  display: "grid",
  gap: "1rem",
  marginBottom: "2rem",
  alignItems: "flex-end",
  "@media": {
    "screen and (min-width: 640px)": {
      gridTemplateColumns: "1fr 1fr auto",
    },
  },
});

export const button = style({
  padding: "0.75rem 1.5rem",
  backgroundColor: "var(--colour-black)",
  color: "var(--colour-white)",
  border: "none",
  fontSize: "1rem",
  cursor: "pointer",
  height: "3rem",
  transition: "all 100ms ease-in-out",
  ":hover": {
    backgroundColor: "#404040",
  },
  ":disabled": {
    backgroundColor: "var(--colour-grey)",
    cursor: "not-allowed",
  },
  ":focus": {
    outline: "2px solid var(--colour-blue)",
    outlineOffset: "2px",
  },
});

export const filterContainer = style({
  display: "flex",
  gap: "1rem",
  marginBottom: "1.5rem",
});

export const filterButton = style({
  padding: "0.5rem 1rem",
  border: "1px solid var(--colour-black)",
  backgroundColor: "var(--colour-white)",
  color: "var(--colour-black)",
  cursor: "pointer",
  transition: "all 100ms ease-in-out",
  ":hover": {
    backgroundColor: "var(--colour-black)",
    color: "var(--colour-white)",
  },
  ":focus": {
    outline: "2px solid var(--colour-blue)",
    outlineOffset: "2px",
  },
  selectors: {
    '&[data-active="true"]': {
      backgroundColor: "var(--colour-black)",
      color: "var(--colour-white)",
    },
  },
});

export const taskList = style({
  display: "grid",
  gap: "1rem",
});

export const errorMessage = style({
  color: "var(--colour-red)",
  marginTop: "0.5rem",
  fontSize: "0.875rem",
  padding: "0.5rem",
  backgroundColor: "#fef2f2",
  border: "1px solid var(--colour-red)",
});
