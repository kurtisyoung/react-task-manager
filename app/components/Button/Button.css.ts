import { recipe } from "@vanilla-extract/recipes";

export const button = recipe({
  base: {
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
    ":disabled": {
      backgroundColor: "var(--colour-grey)",
      color: "var(--colour-white)",
      cursor: "not-allowed",
    },
  },
  variants: {
    variant: {
      filter: {},
      submit: {
        padding: "0.75rem 1.5rem",
        backgroundColor: "var(--colour-black)",
        color: "var(--colour-white)",
        border: "none",
        fontSize: "1rem",
        height: "3rem",
        width: "100%",
        marginBottom: "0.6rem",
        ":hover": {
          backgroundColor: "#404040",
        },
      },
      delete: {
        padding: "0.5rem 1rem",
        backgroundColor: "var(--colour-red)",
        color: "var(--colour-white)",
        border: "none",
        ":hover": {
          backgroundColor: "#b91c1c",
        },
      },
    },
    active: {
      true: {
        backgroundColor: "var(--colour-black)",
        color: "var(--colour-white)",
      },
    },
  },
});
