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

export const filterContainer = style({
  display: "flex",
  gap: "1rem",
  marginBottom: "1.5rem",
});

export const taskList = style({
  display: "grid",
  gap: "1rem",
});
