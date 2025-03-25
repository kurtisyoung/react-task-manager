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
  backgroundColor: "#000000",
  color: "white",
  border: "none",
  fontSize: "1rem",
  cursor: "pointer",
  height: "3rem",
  transition: "all 100ms ease-in-out",
  ":hover": {
    backgroundColor: "#d1d1d1",
  },
  ":disabled": {
    backgroundColor: "#a0a0a0",
    cursor: "not-allowed",
  },
});

export const filterContainer = style({
  display: "flex",
  gap: "1rem",
  marginBottom: "1.5rem",
});

export const filterButton = style({
  padding: "0.5rem 1rem",
  border: "1px solid #000000",
  backgroundColor: "white",
  cursor: "pointer",
  transition: "all 100ms ease-in-out",
  ":hover": {
    backgroundColor: "#000000",
    color: "white",
    borderColor: "#000000",
  },
  selectors: {
    '&[data-active="true"]': {
      backgroundColor: "#000000",
      color: "white",
      borderColor: "#000000",
    },
  },
});

export const taskList = style({
  display: "grid",
  gap: "1rem",
});
