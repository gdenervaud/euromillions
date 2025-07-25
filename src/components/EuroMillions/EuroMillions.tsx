import { useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { Tabs } from "../Tabs";
import { Loader } from "../Loader";
import { Draws } from "../Draws/Draws";
import { Draw } from "./Draw";
import { Stats } from "./Stats";
import { Number } from "./Number";
import { Star } from "./Star";
import { SwissWin } from "./SwissWin";

import { getUpdatedList, toDateString } from "../../helpers/DrawHelper";
import type { EuroMillionsDraw } from "../../types";
import { isDrawMatching } from "../../helpers/EuroMillionsDrawHelper";

const EuroMillionsLocalStorageKey = "EuroMillions";
const saved_favorites_string = (typeof Storage === "undefined" || !localStorage.getItem(EuroMillionsLocalStorageKey)) ? null : localStorage.getItem(EuroMillionsLocalStorageKey);
let saved_favorite: number[][] = [[], [], []];
try {
  const res = JSON.parse(saved_favorites_string ? saved_favorites_string : "");
  const [numbers, stars, swissWin] = res;
  saved_favorite = [
    Array.isArray(numbers) ? numbers : [],
    Array.isArray(stars) ? stars : [],
    Array.isArray(swissWin) ? swissWin : []
  ];
} catch (e) {
  console.log(e);
}

interface EuroMillionsProps {
  canEdit: boolean;
}

const EuroMillions = ({ canEdit }: EuroMillionsProps) => {
  const dbDrawsData = useQuery(api.euroMillions.list);
  const saveDrawMutation = useMutation(api.euroMillions.save);
  const deleteDrawMutation = useMutation(api.euroMillions.remove);

  const dbDraws = useMemo(() =>
    dbDrawsData?.map(d => ({
      id: d._id,
      date: d.date,
      numbers: d.numbers,
      stars: d.stars,
      swissWin: d.swissWin || []
    })) || [],
    [dbDrawsData]
  );

  const [localDraws, setLocalDraws] = useState<EuroMillionsDraw[]>([]);
  const [view, setView] = useState("DRAWS");
  const [favorites, setFavorites] = useState(saved_favorite);

  const draws = useMemo(() => [...localDraws, ...dbDraws], [localDraws, dbDraws]);

  const tabs = [
    {
      name: "Tirages",
      value: "DRAWS",
      visible: true,
    },
    {
      name: "Statistiques",
      value: "STATS",
      visible: !!draws.length
    }
  ];

  const onAddDraw = useCallback(() => {
    const draw: EuroMillionsDraw = {
      id: uuidv4(),
      date: toDateString(new Date()),
      numbers: [],
      stars: [],
      swissWin: []
    };
    setLocalDraws(draws => [draw, ...draws]);
  }, []);

  const onSaveDraw = useCallback(async (draw: EuroMillionsDraw) => {
    if (localDraws.some(d => d.id === draw.id)) {
      setLocalDraws(draws => draws.filter(d => d.id !== draw.id));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...plainDraw } = draw;
    await saveDrawMutation({ ...plainDraw });
  }, [saveDrawMutation, localDraws]);

  const onDeleteDraw = useCallback((draw: EuroMillionsDraw) => {
    if (localDraws.some(d => d.id === draw.id)) {
      setLocalDraws(draws => draws.filter(d => d.id !== draw.id));
    } else if (draw.id) {
      deleteDrawMutation({ id: draw.id, date: draw.date });
    }
  }, [deleteDrawMutation, localDraws]);

  const updateFavorites = useCallback((fav: number[][]) => {
    setFavorites(fav);
    if (typeof Storage !== "undefined") {
      localStorage.setItem(EuroMillionsLocalStorageKey, JSON.stringify(fav));
    }
  }, []);

  const handleResetFavorites = useCallback(() => {
    updateFavorites([[], [], []]);
  }, [updateFavorites]);

  const fav = useMemo(() => {
    const components = [Number, Star, SwissWin];
    return favorites.map((list, index) => ({
      list: list,
      itemComponent: components[index],
      onItemToggle: (value?: number, add?: boolean) => {
        const updatedList = value ? getUpdatedList(favorites[index], value, add) : [];
        const updatedFav = [...favorites];
        updatedFav[index] = updatedList;
        updateFavorites(updatedFav);
      }
    }));
  }, [favorites, updateFavorites]);

  const isLoading = dbDrawsData === undefined;

  return (
    <Tabs title="Euro Millions" logo="/euroMillions.png" tabs={tabs} selected={view} onClick={setView} >
      {isLoading ?
        <Loader text="Récupération des tirages Euro Millions..." shadow={false} />
        :
        view !== "STATS" ?
          <Draws<EuroMillionsDraw> draws={draws} favorites={fav} DrawComponent={Draw} canEdit={canEdit} onAddDraw={onAddDraw} onSaveDraw={onSaveDraw} onDeleteDraw={onDeleteDraw} onResetFavorites={handleResetFavorites} isDrawMatching={isDrawMatching} />
          :
          <Stats draws={draws} favorites={fav} />
      }
    </Tabs>
  );
};

export default EuroMillions;
