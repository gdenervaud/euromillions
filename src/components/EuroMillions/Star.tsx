import { FC } from "react";
import { createUseStyles } from "react-jss";

import { ValueComponentProps } from "../Value";
import { Star as Component } from "../Star";

const useStyles = createUseStyles({
  star: {
    "& svg": {
      color: "white !important"
    },
    "& div": {
      color: "#eebb05 !important"
    },
    "&.checked": {
      "& svg": {
        color: "#eebb05 !important"
      },
      "& div": {
        color: "white !important"
      }
    }
  }
});

export const Star: FC<ValueComponentProps> = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <Component value={value} checked={checked} className={classes.star} />
  );
};
