import React, { useState } from "react";

import { getUpdatedList } from "../../helpers/DrawHelper";
import { isDrawMatching } from "../../helpers/SwissLottoDrawHelper";
import { Number } from "./Number";
import { Chance } from "./Chance";
import { Draw as DrawComponent } from "../Draws/Draw";

export const Draw = ({ draw, favorites, canEdit, onSave, onDelete, favoritesFilter }) => {

  const [readOnly, setReadOnly] = useState(!!draw.lastUpdated);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [date, setDate] = useState(draw.date);
  const [numbers, setNumbers] = useState([...draw.numbers]);
  const [chance, setChance] = useState(draw.chance);

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

  const handleSave = async () => {
    draw.date = date;
    draw.numbers = numbers;
    draw.chance = chance;
    setReadOnly(true);
    setIsSaving(true);
    await onSave(draw);
    setIsSaving(false);
  };

  const handleDelete = async () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setChance(draw.chance);
    setReadOnly(true);
    setIsDeleting(true);
    await onDelete(draw);
    setIsDeleting(false);
  };

  const handleCancelEdit = async () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setChance(draw.chance);
    setReadOnly(true);
    if (!draw.lastUpdated) {
      setIsDeleting(true);
      await onDelete(draw);
      setIsDeleting(false);
    }
  };

  const listOfNumbers = Array.from(Array(42)).map((_, index) => index+1).filter(index => readOnly?numbers.includes(index):true).map(index => ({
    value: index,
    checked: numbers.includes(index),
    readOnly: readOnly || !(numbers.length < 6 || numbers.includes(index)),
    isFavorite: favorites[0].list.includes(index)
  }));

  const listOfChances = Array.from(Array(6)).map((_, index) => index+1).filter(index => readOnly?index === chance:true).map(index => ({
    value: index,
    checked: chance === index,
    readOnly: readOnly,
    isFavorite: favorites[1].list.includes(index)
  }));

  const lists = [
    {
      items: listOfNumbers,
      itemComponent: Number,
      onItemClick: handleNumberClick,
      onItemFavorite: favorites[0].onItemToggle
    },
    {
      items: listOfChances,
      itemComponent: Chance,
      onItemClick: handleChanceClick,
      onItemFavorite: favorites[1].onItemToggle
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
      favoritesFilter={favoritesFilter}
      isSaving={isSaving}
      isDeleting={isDeleting}
    />
  );
};

export default Draw;