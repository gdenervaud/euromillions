
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles((props: {width: string}) => ({
  container: {
    position: "relative",
    width: "100%"
  },
  bar: {
    position: "relative",
    width: props.width,
    height: "20px",
    boxShadow: "0 10px 40px -10px #000",
    borderRadius: "100px",
    background: "linear-gradient(to bottom, #A3E2EF 35%, #4F9CC0)"
  },
  barValue: {
    position: "absolute",
    top: "-2px",
    left: "calc(100% + 6px)",
    whiteSpace: "nowrap",
    textAlign: "right",
    "&.inside": {
      left: "calc(100% - 10px)",
      transform: "translateX(-100%)"
    }
  }
}));

interface BarProps {
  className: string;
  value: number;
  total: number;
  percentage: number;
}


export const Bar = ({ className, value, total, percentage }: BarProps) => {

  const styleProps = {
    width: `${percentage * 100}%`
  };

  const classes = useStyles({ theme: styleProps });

  return (
    <div className={`${classes.container} ${className?className:""}`}>
      <div className={classes.bar}>
        <div className={`${classes.barValue} ${percentage > 0.5?"inside":""}`}>{value} / {total}</div>
      </div>
    </div>
  );
};
