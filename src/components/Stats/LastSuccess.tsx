
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    lineHeight: "1.2rem",
    "&.max": {
      color: "lime"
    },
    "&.high": {
      color: "yellowgreen"
    },
    "&.low": {
      color: "darkorange"
    },
    "&.min": {
      color: "red"
    }
  }
});

const getTrend = (lastSuccess: number,  drawSize: number, maxValue: number): string => {

  if (drawSize <= maxValue) {
    const average = maxValue / drawSize;
    if (lastSuccess < average / 2) {
      return "max";
    }
    if (lastSuccess <= average) {
      return "high";
    }
    if (lastSuccess >= average * 2) {
      return "min";
    }
    if (lastSuccess > average) {
      return "low";
    }
  }

  return "";
};

interface LastSuccessProps {
  lastSuccess: number;
  drawSize: number;
  maxValue: number;
}

export const LastSuccess = ({ lastSuccess, drawSize, maxValue}: LastSuccessProps) => {

  const classes = useStyles();

  const trend = getTrend(lastSuccess,  drawSize, maxValue);

  return (
    <span className={`${classes.container} ${trend}`}>
      {lastSuccess === Number.POSITIVE_INFINITY?"jamais tiré":(lastSuccess > 1)?`${lastSuccess} tirages`:"le dernier tirage"}
    </span>
  );
};
