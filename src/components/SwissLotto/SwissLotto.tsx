import { useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { Tabs } from "../Tabs";
import { Loader } from "../Loader";
import { Draws } from "../Draws/Draws";
import { Draw } from "./Draw";
import { Stats } from "./Stats";

import { getUpdatedList, toDateString } from "../../helpers/DrawHelper";
import { SwissLottoDraw, isDrawMatching } from "../../helpers/SwissLottoDrawHelper";
import { Number } from "./Number";
import { Chance } from "./Chance";

const SwissLottoLocalStorageKey = "SwissLotto";
const saved_favorites_string = (typeof Storage === "undefined" || !localStorage.getItem(SwissLottoLocalStorageKey)) ? null : localStorage.getItem(SwissLottoLocalStorageKey);
let saved_favorite: number[][] = [[], []];
try {
  const res = JSON.parse(saved_favorites_string ? saved_favorites_string : "");
  const [numbers, chance] = res;
  saved_favorite = [
    Array.isArray(numbers) ? numbers : [],
    Array.isArray(chance) ? chance : []
  ];
} catch (e) {
  //
}

interface SwissLottoProps {
  dbCollection: string;
  canEdit: boolean;
}

const SwissLotto = ({ dbCollection, canEdit }: SwissLottoProps) => {
  const dbDrawsData = useQuery(api.draws.list, { collection: dbCollection });
  const saveDrawMutation = useMutation(api.draws.save);
  const deleteDrawMutation = useMutation(api.draws.remove);

  const dbDraws = useMemo(() =>
    dbDrawsData?.map(d => new SwissLottoDraw(d.id, d.date, d.numbers, d.chance, d._creationTime)) || [],
    [dbDrawsData]
  );

  const [localDraws, setLocalDraws] = useState<SwissLottoDraw[]>([]);
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
    const draw = new SwissLottoDraw(uuidv4(), toDateString(new Date()), [], null, null);
    setLocalDraws(draws => [draw, ...draws]);
  }, []);

  const onSaveDraw = useCallback(async (draw: SwissLottoDraw) => {
    if (localDraws.some(d => d.id === draw.id)) {
      setLocalDraws(draws => draws.filter(d => d.id !== draw.id));
    }
    const { ...plainDraw } = draw;
    await saveDrawMutation({ collection: dbCollection, ...plainDraw });
  }, [dbCollection, saveDrawMutation, localDraws]);

  const onDeleteDraw = useCallback((draw: SwissLottoDraw) => {
    if (localDraws.some(d => d.id === draw.id)) {
      setLocalDraws(draws => draws.filter(d => d.id !== draw.id));
    } else if (draw.id) {
      deleteDrawMutation({ collection: dbCollection, id: draw.id });
    }
  }, [dbCollection, deleteDrawMutation, localDraws]);

  const updateFavorites = useCallback((fav: number[][]) => {
    setFavorites(fav);
    typeof Storage !== "undefined" && localStorage.setItem(SwissLottoLocalStorageKey, JSON.stringify(fav));
  }, []);

  const handleResetFavorites = useCallback(() => {
    updateFavorites([[], []]);
  }, [updateFavorites]);

  const fav = useMemo(() => {
    const components = [Number, Chance];
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
    <Tabs title="Swiss Lotto" logo="/swissLotto.png" tabs={tabs} selected={view} onClick={setView} >
      {isLoading ?
        <Loader text="Récupération des tirages Swiss Lotto..." shadow={false} />
        :
        view !== "STATS" ?
          <Draws<SwissLottoDraw> draws={draws} favorites={fav} DrawComponent={Draw} canEdit={canEdit} onAddDraw={onAddDraw} onSaveDraw={onSaveDraw} onDeleteDraw={onDeleteDraw} onResetFavorites={handleResetFavorites} isDrawMatching={isDrawMatching} />
          :
          <Stats draws={draws} favorites={fav} />
      }
    </Tabs>
  );
};

export default SwissLotto;
