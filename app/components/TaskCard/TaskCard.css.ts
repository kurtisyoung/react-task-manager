import { style } from "@vanilla-extract/css";

export const checkbox = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: "0",
});

export const checkboxCustom = style({
  width: "0.75rem",
  height: "0.75rem",
  backgroundColor: "var(--colour-white)",
  border: "2px solid var(--colour-black)",
  cursor: "pointer",
  transition: "all 100ms ease-in-out",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  selectors: {
    [`${checkbox}:checked + &`]: {
      backgroundColor: "var(--colour-black)",
      borderColor: "var(--colour-black)",
    },
    [`${checkbox}:focus + &`]: {
      outline: "2px solid var(--colour-blue)",
      outlineOffset: "2px",
    },
    "&:hover": {
      borderColor: "var(--colour-black) !important",
      backgroundColor: "var(--colour-white) !important",
    },
  },
});

export const taskCard = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem",
  backgroundColor: "var(--colour-white)",
  border: "1px solid var(--colour-black)",
  transition: "all 100ms ease-in-out",
  cursor: "pointer",

  selectors: {
    '&[data-completed="true"]': {
      opacity: 0.5,
    },
    "&:hover": {
      borderColor: "#bababa",
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
  position: "relative",
});

export const taskTitle = style({
  fontSize: "1rem",
  fontWeight: "500",
  color: "var(--colour-black)",
  selectors: {
    '&[data-completed="true"]': {
      textDecoration: "line-through",
      color: "var(--colour-grey)",
    },
  },
});

export const taskDate = style({
  color: "var(--colour-grey)",
  fontSize: "0.875rem",
  selectors: {
    '&[data-completed="true"]': {
      textDecoration: "line-through",
      color: "var(--colour-grey)",
    },
  },
});

export const deleteButton = style({
  padding: "0.5rem 1rem",
  backgroundColor: "var(--colour-red)",
  color: "var(--colour-white)",
  border: "none",
  cursor: "pointer",
  transition: "all 100ms ease-in-out",
  fontSize: "0.875rem",
  ":hover": {
    backgroundColor: "#b91c1c",
  },
  ":focus": {
    outline: "2px solid var(--colour-blue)",
    outlineOffset: "2px",
  },
});
