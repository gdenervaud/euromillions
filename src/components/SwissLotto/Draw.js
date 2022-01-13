import React, { useState } from "react";
import { createUseStyles } from "react-jss";

import { getUpdatedList } from "../../helpers/DrawHelper";
import { Number as NumberComponent } from "../Number";
import { Draw as DrawComponent } from "../Draws";

const useStyles = createUseStyles({
  number: {
    borderRadius: 0,
    backgroundColor: "white",
    color: "red",
    boxShadow: "0 5px 10px 0 hsl(0deg 0% 75% / 50%)",
    "&.checked": {
      backgroundColor: "#001367",
      color: "white"
    }
  },
  chance: {
    borderRadius: "50%",
    backgroundColor: "white",
    color: "red",
    boxShadow: "0 5px 10px 0 hsl(0deg 0% 75% / 50%)",
    "&.checked": {
      backgroundColor: "#eebb05",
      color: "red"
    }
  }
});

export const Number = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <NumberComponent value={value} checked={checked} className={classes.number} />
  );
};

export const Chance = ({ value, checked}) => {

  const classes = useStyles();

  return (
    <NumberComponent value={value} checked={checked} className={classes.chance} />
  );
};


export const Draw = ({ draw, favorites, canEdit, onSave, onDelete, onFavoritesChange }) => {

  const [readOnly, setReadOnly] = useState(!!draw.lastUpdated);
  const [date, setDate] = useState(draw.date);
  const [numbers, setNumbers] = useState([...draw.numbers]);
  const [chance, setChance] = useState(draw.chance);

  const handleDateChange = date => {
    setDate(date);
  };

  const handleNumberClick = (number, add) => {
    const list = getUpdatedList(numbers, number, add);
    setNumbers(list);
  };

  const handleChanceClick = (chance, add) => {
    if (add) {
      setChance(chance);
    } else {
      setChance(null);
    }
  };

  const handleEdit = () => {
    setReadOnly(false);
  };

  const handleSave = () => {
    draw.date = date;
    draw.numbers = numbers;
    draw.chance = chance;
    setReadOnly(true);
    onSave(draw);
  };

  const handleDelete = () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setChance(draw.chance);
    setReadOnly(true);
    onDelete(draw);
  };

  const handleCancelEdit = () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setChance(draw.chance);
    setReadOnly(true);
    if (!draw.lastUpdated) {
      onDelete(draw);
    }
  };

  const handleFavoriteNumberClick = (number, add) => {
    const list = getUpdatedList(favorites[0], number, add);
    onFavoritesChange([
      list,
      favorites[1]
    ]);
  };

  const handleFavoriteChanceClick = (chance, add) => {
    const list = getUpdatedList(favorites[1], chance, add);
    onFavoritesChange([
      favorites[0],
      list
    ]);
  };

  const listOfNumbers = Array.from(Array(42)).map((_, index) => index+1).filter(index => readOnly?numbers.includes(index):true).map(index => ({
    value: index,
    checked: numbers.includes(index),
    readOnly: readOnly || !(numbers.length < 6 || numbers.includes(index)),
    isFavorite: favorites[0].includes(index)
  }));

  const listOfChances = Array.from(Array(6)).map((_, index) => index+1).filter(index => readOnly?index === chance:true).map(index => ({
    value: index,
    checked: chance === index,
    readOnly: readOnly,
    isFavorite: favorites[1].includes(index)
  }));

  const lists = [
    {
      items: listOfNumbers,
      itemComponent: Number,
      onItemClick: handleNumberClick,
      onItemFavorite: handleFavoriteNumberClick
    },
    {
      items: listOfChances,
      itemComponent: Chance,
      onItemClick: handleChanceClick,
      onItemFavorite: handleFavoriteChanceClick
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