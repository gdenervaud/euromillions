
import { createUseStyles } from "react-jss";

import MultiToggle from "./MultiToggle";
import { Item } from "./MultiToggleItem";

const useStyles = createUseStyles({
  container: {
    "& > div": {
      position: "relative",
      "& > div": {
        display: "inline-block"
      }
    }
  }
});

interface ToggleProps {
  className?: string;
  value: unknown;
  items: Item[];
  onChange: (value: unknown) => void;
}

export const Toggle = ({ className, value, items, onChange }: ToggleProps) => {

  const classes = useStyles();

  const selectedItem = items.find((item:Item) => item.value === value);

  return (
    <div className={`${classes.container} ${className?className:""}`}>
      <div>
        <div>
          <MultiToggle selectedValue={value} onChange={onChange}>
            {items.map((item:Item) => (
              <MultiToggle.Toggle key={`${item.value}`} {...item} />
            ))}
          </MultiToggle>
        </div>
        {selectedItem && selectedItem.label && (
          <div>&nbsp;{selectedItem.label}</div>
        )}
      </div>
    </div>
  );
};

export default Toggle;