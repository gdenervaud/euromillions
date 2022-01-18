import React, { useState, useEffect } from "react";
import _  from "lodash-uuid";

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
let saved_favorite = [[], []];
try {
  const res = JSON.parse(saved_favorites_string);
  const [numbers, chance] = res;
  saved_favorite = [
    Array.isArray(numbers)?numbers:[],
    Array.isArray(chance)?chance:[]
  ];
} catch (e) {
  //
}

const SwissLotto = ({ db, dbCollection, canEdit }) => {

  const [draws, setDraws] = useState([]);
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
    //   const draw = new EuroMillionsDraw(_.uuid(), tirage.date, tirage.numbers, tirage.stars, null);
    //   saveDbItem(db, dbCollection, draw, swissLottoDrawConverter);
    // });

    getDbList(db, dbCollection, swissLottoDrawConverter, "date", false).then(result => {
      setDraws(result);
      // console.log(JSON.stringify(result.map(d => {
      //   const c = {...d};
      //   delete c.lastUpdated;
      //   return c;
      // })));
      setIsLoading(false);
    });
  }, [db, dbCollection]);

  const onAddDraw = () => {
    const draw = new SwissLottoDraw(_.uuid(), toDateString(new Date()), [], null, null);
    setDraws(draws => [draw, ...draws]);
  };
  const onSaveDraw = async draw => {
    await saveDbItem(db, dbCollection, draw, swissLottoDrawConverter);
    setDraws(draws => draws.map(d => d.id === draw.id?draw:d));
  };
  const onDeleteDraw = draw => {
    if (draw.lastUpdated) {
      deleteDbItem(db, dbCollection, draw.id);
    }
    setDraws(draws => draws.filter(d => d.id !== draw.id));
  };

  const updateFavorites = fav => {
    setFavorites(fav);
    typeof Storage !== "undefined" && localStorage.setItem(SwissLottoLocalStorageKey, JSON.stringify(fav));
  };

  const handleResetFavorites = () => {
    updateFavorites([[], []]);
  };

  const components = [Number, Chance];
  const fav = favorites.map((list, index) => ({
    list: list,
    itemComponent: components[index],
    onItemToggle: (value, add) => {
      const updatedList = value?getUpdatedList(favorites[index], value, add):[];
      const updatedFav = [...favorites];
      updatedFav[index] = updatedList;
      updateFavorites(updatedFav);
    }
  }));

  return (
    <Tabs title="Swiss Lotto" logo="/swissLotto.png" tabs={tabs} selected={view} onClick={setView} >
      {isLoading?
        <Loader text="Récupération des tirages Swiss Lotto..." shadow={false} />
        :
        view !== "STATS"?
          <Draws draws={draws} favorites={fav} DrawComponent={Draw} canEdit={canEdit} onAddDraw={onAddDraw} onSaveDraw={onSaveDraw} onDeleteDraw={onDeleteDraw} onResetFavorites={handleResetFavorites} isDrawMatching={isDrawMatching} />
          :
          <Stats draws={draws} favorites={fav} />
      }
    </Tabs>
  );
};


export default SwissLotto;