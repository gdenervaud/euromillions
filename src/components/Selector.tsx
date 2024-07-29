

import { FormEvent } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  selector: {
    display: "inline-block"
  },
  selectBox: {
    display: "inline-block",
    position: "relative",
    "&:not(.disabled):after": {
      content: "\"\"",
      position: "absolute",
      top: "50%",
      right: "10px",
      width: 0,
      height: 0,
      marginTop: "-3px",
      borderTop: "6px solid #4d4d4d",
      borderRight: "6px solid transparent",
      borderLeft: "6px solid transparent",
      pointerEvents: "none"
    }
  },
  select: {
    marginBottom: 0,
    display: "inline-block",
    minWidth: "100px",
    width: "100%",
    padding: "0.275rem 20px 0.35rem 6px",
    color: "#4d4d4d",
    border:"1px solid #4d4d4d",
    borderRadius: "3px",
    backgroundColor: "white",
    "-webkit-appearance": "none",
    "&:not(.disabled):not(:disabled):hover": {
      //backgroundColor: "#5a6268",
      //borderColor: "#5a6268"
    },
    "&:focus": {
      color: "var(--ft-color-loud)",
      borderColor: "rgba(64, 169, 243, 0.5)",
      backgroundColor: "transparent",
      outline: 0,
      boxShadow: "0 0 0 0.2rem rgb(0 123 255 / 25%)"
    },
    "&.disabled,&:disabled":{
      backgroundColor: "var(--bg-color-blend-contrast1)",
      color: "var(--ft-color-normal)",
      cursor: "text"
    }
  }
});

interface SelectorProps {
  title: string;
  value: number;
  list: {name: string, value: number}[];
  onChange: (value: number) => void;
}

export const Selector = ({title, value, list, onChange}: SelectorProps) => {

  const classes = useStyles();

  const handleChange = (e: FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    onChange(Number.parseInt(target.value));
  };

  return (
    <div className={classes.selector}>
      {title}:&nbsp;
      <div className={classes.selectBox} >
        <select className={classes.select} value={value} onChange={handleChange} title={title} >
          {list.map(item => <option key={item.value} value={item.value}>{item.name}</option>)}
        </select>
      </div>
    </div>
  );
};

export default Selector;
