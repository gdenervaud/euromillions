import React, { FC, useState, useCallback, useMemo } from "react";

import { getUpdatedList, DrawProps } from "../../helpers/DrawHelper";
import { isDrawMatching, EuroMillionsDraw } from "../../helpers/EuroMillionsDrawHelper";

import { Draw as DrawComponent, List } from "../Draws/Draw";
import { Number } from "./Number";
import { Star } from "./Star";
import { SwissWin } from "./SwissWin";

export const Draw: FC<DrawProps<EuroMillionsDraw>> = ({ draw, favorites, canEdit, onSave, onDelete, favoritesFilter }) => {

  const [readOnly, setReadOnly] = useState(!!draw.lastUpdated);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [date, setDate] = useState(draw.date);
  const [numbers, setNumbers] = useState([...draw.numbers]);
  const [stars, setStars] = useState([...draw.stars]);
  const [swissWin, setSwissWin] = useState([...draw.swissWin]);

  const handleDateChange = useCallback(date => {
    setDate(date);
  }, []);

  const handleNumberClick = useCallback((number, add) => {
    const list = getUpdatedList(numbers, number, add);
    setNumbers(list);
  }, [numbers]);

  const handleStarClick = useCallback((star, add) => {
    const list = getUpdatedList(stars, star, add);
    setStars(list);
  }, [stars]);

  const handleSwissWinClick = useCallback((number, add) => {
    const list = getUpdatedList(swissWin, number, add);
    setSwissWin(list);
  }, [swissWin]);

  const handleEdit = useCallback(() => {
    setReadOnly(false);
  }, []);

  const handleSave = useCallback(async () => {
    draw.date = date;
    draw.numbers = numbers;
    draw.stars = stars;
    draw.swissWin = swissWin;
    setReadOnly(true);
    setIsSaving(true);
    await onSave(draw);
    setIsSaving(false);
  }, [draw, date, numbers, stars, swissWin, onSave]);
  const handleDelete = useCallback(async () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setStars([...draw.stars]);
    setSwissWin([...draw.swissWin]);
    setReadOnly(true);
    setIsDeleting(true);
    await onDelete(draw);
    //setIsDeleting(false);
  }, [draw, onDelete]);

  const handleCancelEdit = useCallback(async () => {
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
  }, [draw, onDelete]);

  const hide = useMemo(() => readOnly && !isDrawMatching(draw, favoritesFilter, favorites), [readOnly, draw, favorites, favoritesFilter]);

  const listOfNumbers = useMemo(() => Array.from(Array(50)).map((_, index) => index+1).filter(index => readOnly?numbers.includes(index):true).map(index => ({
    value: index,
    checked: numbers.includes(index),
    readOnly: readOnly || !(numbers.length < 5 || numbers.includes(index)),
    isFavorite: favorites[0].list.includes(index)
  })), [readOnly, numbers, favorites]);

  const listOfStars = useMemo(() => Array.from(Array(12)).map((_, index) => index+1).filter(index => readOnly?stars.includes(index):true).map(index => ({
    value: index,
    checked: stars.includes(index),
    readOnly: readOnly || !(stars.length < 2 || stars.includes(index)),
    isFavorite: favorites[1].list.includes(index)
  })), [readOnly, stars, favorites]);

  const listOfSwissWin = useMemo(() => Array.from(Array(50)).map((_, index) => index+1).filter(index => readOnly?swissWin.includes(index):true).map(index => ({
    value: index,
    checked: swissWin.includes(index),
    readOnly: readOnly || !(swissWin.length < 5 || swissWin.includes(index)),
    isFavorite: favorites[2].list.includes(index)
  })), [readOnly, swissWin, favorites]);

  const lists = useMemo((): List[] => [
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
  ], [listOfNumbers, listOfStars, listOfSwissWin, favorites, handleNumberClick, handleStarClick, handleSwissWinClick]);

  if (hide) {
    return null;
  }

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
      theme={{
        color: "#1f485e",
        //backgroundImage: "linear-gradient(to bottom,#7db9e6,#004777),linear-gradient(#e4c95b,#e4c95b)",
        backgroundImage: "linear-gradient(to bottom,#0e587e,#173646),linear-gradient(#eee,#eee)",
      }}
    />
  );
};

export default Draw;