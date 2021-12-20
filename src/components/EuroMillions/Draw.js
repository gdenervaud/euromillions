import React, { useState } from "react";
import { createUseStyles } from "react-jss";

import { getUpdatedList } from "../../helpers/DrawHelper";
import { Number as NumberComponent, Star as StarComponent } from "../Number";
import { Draw as DrawComponent } from "../Draws";

const useStyles = createUseStyles({
  number: {
    borderRadius: "50%",
    backgroundColor: "white",
    color: "#001367",
    boxShadow: "0 5px 10px 0 hsl(0deg 0% 75% / 50%)",
    "&.checked": {
      backgroundColor: "#001367",
      color: "white"
    }
  },
  star: {
    "& svg": {
      color: "white"
    },
    "& div": {
      color: "#eebb05"
    },
    "&.checked": {
      "& svg": {
        color: "#eebb05"
      },
      "& div": {
        color: "white"
      }
    }
  }
});

export const Number = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <NumberComponent value={value} checked={checked} className={classes.number} />
  );
};

export const Star = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <StarComponent value={value} checked={checked} className={classes.star} />
  );
};


export const Draw = ({ draw, onSave, onDelete }) => {

  const [readOnly, setReadOnly] = useState(!!draw.lastUpdated);
  const [date, setDate] = useState(draw.date);
  const [numbers, setNumbers] = useState([...draw.numbers]);
  const [stars, setStars] = useState([...draw.stars]);

  const handleDateChange = date => {
    setDate(date);
  };

  const handleNumberClick = (number, add) => {
    const list = getUpdatedList(numbers, number, add);
    setNumbers(list);
  };

  const handleStarClick = (star, add) => {
    const list = getUpdatedList(stars, star, add);
    setStars(list);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleSave = () => {
    draw.date = date;
    draw.numbers = numbers;
    draw.stars = stars;
    setReadOnly(true);
    onSave(draw);
  };
  const handleDelete = () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setStars([...draw.stars]);
    setReadOnly(true);
    onDelete(draw);
  };

  const handleCancelEdit = () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setStars([...draw.stars]);
    setReadOnly(true);
    if (!draw.lastUpdated) {
      onDelete(draw);
    }
  };

  const listOfNumbers = Array.from(Array(50)).map((_, index) => index+1).filter(index => readOnly?numbers.includes(index):true).map(index => ({
    value: index,
    checked: numbers.includes(index),
    readOnly: readOnly || !(numbers.length < 5 || numbers.includes(index))
  }));

  const listOfStars = Array.from(Array(12)).map((_, index) => index+1).filter(index => readOnly?stars.includes(index):true).map(index => ({
    value: index,
    checked: stars.includes(index),
    readOnly: readOnly || !(stars.length < 2 || stars.includes(index))
  }));

  return (
    <DrawComponent
      date={date}
      list1={listOfNumbers}
      list2={listOfStars}
      readOnly={readOnly}
      isNew={!draw.lastUpdated}
      list1ItemComponent={Number}
      list2ItemComponent={Star}
      onDateChange={handleDateChange}
      onList1ItemClick={handleNumberClick}
      onList2ItemClick={handleStarClick}
      onEdit={handleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancelEdit={handleCancelEdit}
    />
  );
};

export default Draw;