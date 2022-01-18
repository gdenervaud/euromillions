import React, { useState } from "react";

import { getUpdatedList } from "../../helpers/DrawHelper";
import { isDrawMatching } from "../../helpers/EuroMillionsDrawHelper";

import { Draw as DrawComponent } from "../Draws/Draw";
import { Number } from "./Number";
import { Star } from "./Star";
import { SwissWin } from "./SwissWin";

export const Draw = ({ draw, favorites, canEdit, onSave, onDelete, favoritesFilter }) => {

  const [readOnly, setReadOnly] = useState(!!draw.lastUpdated);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [date, setDate] = useState(draw.date);
  const [numbers, setNumbers] = useState([...draw.numbers]);
  const [stars, setStars] = useState([...draw.stars]);
  const [swissWin, setSwissWin] = useState([...draw.swissWin]);

  if (readOnly && !isDrawMatching(draw, favoritesFilter, favorites)) {
    return null;
  }

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

  const handleSave = async () => {
    draw.date = date;
    draw.numbers = numbers;
    draw.stars = stars;
    draw.swissWin = swissWin;
    setReadOnly(true);
    setIsSaving(true);
    await onSave(draw);
    setIsSaving(false);
  };
  const handleDelete = async () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setStars([...draw.stars]);
    setSwissWin([...draw.swissWin]);
    setReadOnly(true);
    setIsDeleting(true);
    await onDelete(draw);
    //setIsDeleting(false);
  };

  const handleCancelEdit = async () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setStars([...draw.stars]);
    setSwissWin([...draw.swissWin]);
    setReadOnly(true);
    if (!draw.lastUpdated) {
      setIsDeleting(true);
      await onDelete(draw);
      //setIsDeleting(false);
    }
  };

  const listOfNumbers = Array.from(Array(50)).map((_, index) => index+1).filter(index => readOnly?numbers.includes(index):true).map(index => ({
    value: index,
    checked: numbers.includes(index),
    readOnly: readOnly || !(numbers.length < 5 || numbers.includes(index)),
    isFavorite: favorites[0].list.includes(index)
  }));

  const listOfStars = Array.from(Array(12)).map((_, index) => index+1).filter(index => readOnly?stars.includes(index):true).map(index => ({
    value: index,
    checked: stars.includes(index),
    readOnly: readOnly || !(stars.length < 2 || stars.includes(index)),
    isFavorite: favorites[1].list.includes(index)
  }));

  const listOfSwissWin = Array.from(Array(50)).map((_, index) => index+1).filter(index => readOnly?swissWin.includes(index):true).map(index => ({
    value: index,
    checked: swissWin.includes(index),
    readOnly: readOnly || !(swissWin.length < 5 || swissWin.includes(index)),
    isFavorite: favorites[2].list.includes(index)
  }));

  const lists = [
    {
      items: listOfNumbers,
      itemComponent: Number,
      onItemClick: handleNumberClick,
      onItemFavorite: favorites[0].onItemToggle
    },
    {
      items: listOfStars,
      itemComponent: Star,
      onItemClick: handleStarClick,
      onItemFavorite: favorites[1].onItemToggle
    },
    {
      items: listOfSwissWin,
      itemComponent: SwissWin,
      onItemClick: handleSwissWinClick,
      onItemFavorite: favorites[2].onItemToggle
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
      isSaving={isSaving}
      isDeleting={isDeleting}
    />
  );
};

export default Draw;