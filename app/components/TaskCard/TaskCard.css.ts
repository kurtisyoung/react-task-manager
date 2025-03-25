import { style } from "@vanilla-extract/css";

export const checkbox = style({
  display: "none",
});

export const checkboxCustom = style({
  width: "1rem",
  height: "1rem",
  backgroundColor: "white",
  border: "1px solid #000000",
  cursor: "pointer",
  borderRadius: "50%",
  transition: "all 100ms ease-in-out",

  selectors: {
    [`${checkbox}:checked + &`]: {
      backgroundColor: "#000000",
      borderColor: "#000000",
    },
    "&:hover": {
      backgroundColor: "#d1d1d1 !important",
      borderColor: "#d1d1d1 !important",
    },
  },
});

export const taskCard = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem",
  backgroundColor: "#ffffff",
  border: "1px solid #000000",
  cursor: "pointer",
  transition: "all 100ms ease-in-out",

  selectors: {
    '&[data-completed="true"]': {
      borderColor: "#b1b1b1",
    },
    "&:hover": {
      borderColor: "#dddddd",
    },
  },
});

export const taskInfo = style({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

export const checkboxWrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.25rem",
  height: "1.25rem",
});

export const taskTitle = style({
  fontSize: "1rem",
  fontWeight: "semibold",
  selectors: {
    '&[data-completed="true"]': {
      textDecoration: "line-through",
      color: "#b3b3b3",
    },
  },
});

export const taskDate = style({
  color: "#8e8e8e",
  fontSize: "0.875rem",
  selectors: {
    '&[data-completed="true"]': {
      textDecoration: "line-through",
      color: "#b3b3b3",
    },
  },
});

export const deleteButton = style({
  padding: "0.5rem",
  backgroundColor: "#000000",
  color: "white",
  border: "none",
  cursor: "pointer",
  transition: "all 100ms ease-in-out",
  ":hover": {
    backgroundColor: "#5d0202",
  },
});
