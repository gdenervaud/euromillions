import { FC, useState, useCallback, useMemo } from "react";

import type { DrawProps, SwissLottoDraw } from "../../types";
import { getUpdatedList } from "../../helpers/DrawHelper";
import { isDrawMatching } from "../../helpers/SwissLottoDrawHelper";
import { Number } from "./Number";
import { Chance } from "./Chance";
import { Draw as DrawComponent, List } from "../Draws/Draw";

interface SwissLottoDrawProps extends DrawProps<SwissLottoDraw> {
  isNew?: boolean;
}

export const Draw: FC<SwissLottoDrawProps> = ({ draw, favorites, canEdit, onSave, onDelete, favoritesFilter, isNew = false }) => {

  const [readOnly, setReadOnly] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [date, setDate] = useState(draw.date);
  const [numbers, setNumbers] = useState([...draw.numbers]);
  const [chance, setChance] = useState<number | null>(draw.chance);

  const handleDateChange = useCallback((date: string) => {
    setDate(date);
  }, []);

  const handleNumberClick = useCallback((number: number, add?: boolean) => {
    const list = getUpdatedList(numbers, number, add);
    setNumbers(list);
  }, [numbers]);

  const handleChanceClick = useCallback((chance: number, add?: boolean) => {
    if (add) {
      setChance(chance);
    } else {
      setChance(null);
    }
  }, []);

  const handleEdit = useCallback(() => {
    setReadOnly(false);
  }, []);

  const handleSave = useCallback(async () => {
    draw.date = date;
    draw.numbers = numbers;
    draw.chance = chance;
    setReadOnly(true);
    setIsSaving(true);
    await onSave(draw);
    setIsSaving(false);
  }, [draw, date, numbers, chance, onSave]);

  const handleDelete = useCallback(async () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setChance(draw.chance);
    setReadOnly(true);
    setIsDeleting(true);
    await onDelete(draw);
    setIsDeleting(false);
  }, [draw, onDelete]);

  const handleCancelEdit = useCallback(async () => {
    setDate(draw.date);
    setNumbers([...draw.numbers]);
    setChance(draw.chance);
    setReadOnly(true);
    if (isNew) {
      setIsDeleting(true);
      await onDelete(draw);
      setIsDeleting(false);
    }
  }, [draw, onDelete]);

  const hide = useMemo(() => readOnly && !isDrawMatching(draw, favoritesFilter, favorites), [readOnly, draw, favorites, favoritesFilter]);

  const listOfNumbers = useMemo(() => Array.from(Array(42)).map((_, index) => index+1).filter(index => readOnly?numbers.includes(index):true).map(index => ({
    value: index,
    checked: numbers.includes(index),
    readOnly: readOnly || !(numbers.length < 6 || numbers.includes(index)),
    isFavorite: favorites[0].list.includes(index)
  })), [readOnly, numbers, favorites]);

  const listOfChances = useMemo(() => Array.from(Array(6)).map((_, index) => index+1).filter(index => readOnly?index === chance:true).map(index => ({
    value: index,
    checked: chance === index,
    readOnly: readOnly,
    isFavorite: favorites[1].list.includes(index)
  })), [readOnly, chance, favorites]);

  const lists = useMemo((): List[] => [
    {
      items: listOfNumbers,
      itemComponent: Number,
      onItemClick: handleNumberClick,
      onItemFavorite: favorites[0].onItemToggle,
      inline: true
    },
    {
      items: listOfChances,
      itemComponent: Chance,
      onItemClick: handleChanceClick,
      onItemFavorite: favorites[1].onItemToggle,
      inline: true
    }
  ], [listOfNumbers, listOfChances, favorites, handleNumberClick, handleChanceClick]);

  if (hide) {
    return null;
  }

  return (
    <DrawComponent
      date={date}
      lists={lists}
      canEdit={canEdit}
      readOnly={readOnly || !canEdit}
      isNew={isNew}
      onDateChange={handleDateChange}
      onEdit={handleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      onCancelEdit={handleCancelEdit}
      isSaving={isSaving}
      isDeleting={isDeleting}
      theme={{
        color: "#801010",
        backgroundImage: "linear-gradient(to bottom,#94080d, #801010),linear-gradient(#e4c95b,#e4c95b)"
      }}
    />
  );
};

export default Draw;