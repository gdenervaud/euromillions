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
  },
  swissWin: {
    borderRadius: "50%",
    backgroundColor: "white",
    color: "red",
    boxShadow: "0 5px 10px 0 hsl(0deg 0% 75% / 50%)",
    "&.checked": {
      backgroundColor: "red",
      color: "white"
    }
  },
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

export const SwissWin = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <NumberComponent value={value} checked={checked} className={classes.swissWin} />
  );
};

export const Draw = ({ draw, canEdit, onSave, onDelete }) => {

  const [readOnly, setReadOnly] = useState(!!draw.lastUpdated);
  const [date, setDate] = useState(draw.date);
  const [numbers, setNumbers] = useState([...draw.numbers]);
  const [stars, setStars] = useState([...draw.stars]);
  const [swissWin, setSwissWin] = useState([...draw.swissWin]);

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

  const handleSwissWinClick = (number, add) => {
    const list = getUpdatedList(swissWin, number, add);
    setSwissWin(list);
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleSave = () => {
    draw.date = date;
    draw.numbers = numbers;
    draw.stars = stars;
    draw.swissWin = swissWin;
    setReadOnly(true);
    onSave(draw);
  };
  const handleDelete = () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setStars([...draw.stars]);
    setSwissWin([...draw.swissWin]);
    setReadOnly(true);
    onDelete(draw);
  };

  const handleCancelEdit = () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setStars([...draw.stars]);
    setSwissWin([...draw.swissWin]);
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

  const listOfSwissWin = Array.from(Array(50)).map((_, index) => index+1).filter(index => readOnly?swissWin.includes(index):true).map(index => ({
    value: index,
    checked: swissWin.includes(index),
    readOnly: readOnly || !(swissWin.length < 5 || swissWin.includes(index))
  }));

  const lists = [
    {
      items: listOfNumbers,
      itemComponent: Number,
      onItemClick: handleNumberClick
    },
    {
      items: listOfStars,
      itemComponent: Star,
      onItemClick: handleStarClick
    },
    {
      items: listOfSwissWin,
      itemComponent: SwissWin,
      onItemClick: handleSwissWinClick
    }
  ];

  return (
    <DrawComponent
      date={date}
      lists={lists}
      canEdit={canEdit}
      readOnly={readOnly || !canEdit}
      isNew={!draw.lastUpdated}
      onDateChange={handleDateChange}
      onEdit={handleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancelEdit={handleCancelEdit}
    />
  );
};

export default Draw;