import { useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Firestore } from "firebase/firestore";

import { Tabs } from "../Tabs";
import { Loader } from "../Loader";
import { Draws } from "../Draws/Draws";
import { Draw } from "./Draw";
import { Stats } from "./Stats";

import { getUpdatedList } from "../../helpers/DrawHelper";
import { getDbList, saveDbItem, deleteDbItem } from "../../helpers/DbHelper";
import { toDateString } from "../../helpers/DrawHelper";
import { SwissLottoDraw, swissLottoDrawConverter, isDrawMatching } from "../../helpers/SwissLottoDrawHelper";
import { Number } from "./Number";
import { Chance } from "./Chance";
// import { draws as defaultDraws } from "../../data/swissLottoDraws";

const SwissLottoLocalStorageKey = "SwissLotto";
const saved_favorites_string = (typeof Storage === "undefined" || !localStorage.getItem(SwissLottoLocalStorageKey))?null:localStorage.getItem(SwissLottoLocalStorageKey);
let saved_favorite: number[][] = [[], []];
try {
  const res = JSON.parse(saved_favorites_string?saved_favorites_string:"");
  const [numbers, chance] = res;
  saved_favorite = [
    Array.isArray(numbers)?numbers:[],
    Array.isArray(chance)?chance:[]
  ];
} catch (e) {
  //
}

interface SwissLottoProps {
  db: Firestore;
  dbCollection: string;
  canEdit: boolean;
}

const SwissLotto = ({ db, dbCollection, canEdit }: SwissLottoProps) => {

  const [draws, setDraws] = useState<SwissLottoDraw[]>([]);
  const [view, setView] = useState("DRAWS");

  const [favorites, setFavorites] = useState(saved_favorite);

  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {

    // defaultTirages.forEach(tirage => {
    //   const draw = new EuroMillionsDraw(uuidv4(), tirage.date, tirage.numbers, tirage.stars, null);
    //   saveDbItem(db, dbCollection, draw, swissLottoDrawConverter);
    // });

    getDbList(db, dbCollection, swissLottoDrawConverter, "date", false)
      .then(result => {
        setDraws(result as SwissLottoDraw[]);
        // console.log(JSON.stringify(result.map(d => {
        //   const c = {...d};
        //   delete c.lastUpdated;
        //   return c;
        // })));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [db, dbCollection]);

  const onAddDraw = useCallback(() => {
    const draw = new SwissLottoDraw(uuidv4(), toDateString(new Date()), [], null, null);
    setDraws(draws => [draw, ...draws]);
  }, []);
  const onSaveDraw = useCallback(async (draw: SwissLottoDraw) => {
    await saveDbItem<SwissLottoDraw>(db, dbCollection, draw, swissLottoDrawConverter);
    setDraws(draws => draws.map(d => d.id === draw.id?draw:d));
  }, [db, dbCollection]);
  const onDeleteDraw = useCallback((draw: SwissLottoDraw) => {
    if (draw.lastUpdated) {
      deleteDbItem(db, dbCollection, draw.id);
    }
    setDraws(draws => draws.filter(d => d.id !== draw.id));
  }, [db, dbCollection]);

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
        const updatedList = value?getUpdatedList(favorites[index], value, add):[];
        const updatedFav = [...favorites];
        updatedFav[index] = updatedList;
        updateFavorites(updatedFav);
      }
    }));
  }, [favorites, updateFavorites]);

  return (
    <Tabs title="Swiss Lotto" logo="/swissLotto.png" tabs={tabs} selected={view} onClick={setView} >
      {isLoading?
        <Loader text="Récupération des tirages Swiss Lotto..." shadow={false} />
        :
        view !== "STATS"?
          <Draws<SwissLottoDraw> draws={draws} favorites={fav} DrawComponent={Draw} canEdit={canEdit} onAddDraw={onAddDraw} onSaveDraw={onSaveDraw} onDeleteDraw={onDeleteDraw} onResetFavorites={handleResetFavorites} isDrawMatching={isDrawMatching} />
          :
          <Stats draws={draws} favorites={fav} />
      }
    </Tabs>
  );
};


export default SwissLotto;