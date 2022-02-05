import React, { useState, useEffect, useCallback } from "react";
import _  from "lodash-uuid";

import { Tabs } from "../Tabs";
import { Loader } from "../Loader";
import { Draws } from "../Draws/Draws";
import { Draw } from "./Draw";
import { Stats } from "./Stats";
import { Number } from "./Number";
import { Star } from "./Star";
import { SwissWin } from "./SwissWin";

import { getUpdatedList } from "../../helpers/DrawHelper";
import { getDbList, saveDbItem, deleteDbItem } from "../../helpers/DbHelper";
import { toDateString } from "../../helpers/DrawHelper";
import { EuroMillionsDraw, euroMillionsDrawConverter, isDrawMatching } from "../../helpers/EuroMillionsDrawHelper";
// import { draws as defaultDraws } from "../../data/euroMillionsDraws";

const EuroMillionsLocalStorageKey = "EuroMillions";
const saved_favorites_string = (typeof Storage === "undefined" || !localStorage.getItem(EuroMillionsLocalStorageKey))?null:localStorage.getItem(EuroMillionsLocalStorageKey);
let saved_favorite = [[], [], []];
try {
  const res = JSON.parse(saved_favorites_string);
  const [numbers, stars, swissWin] = res;
  saved_favorite = [
    Array.isArray(numbers)?numbers:[],
    Array.isArray(stars)?stars:[],
    Array.isArray(swissWin)?swissWin:[]
  ];
} catch (e) {
  //
}

const EuroMillions = ({ db, dbCollection, canEdit }) => {

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
    //   saveDbItem(db, dbCollection, draw, euroMillionsDrawConverter);
    // });

    getDbList(db, dbCollection, euroMillionsDrawConverter, "date", false).then(result => {
      setDraws(result);
      // console.log(JSON.stringify(result.map(d => {
      //   const c = {...d};
      //   delete c.lastUpdated;
      //   return c;
      // })));
      setIsLoading(false);
    });
  }, [db, dbCollection]);

  const onAddDraw = useCallback(() => {
    const draw = new EuroMillionsDraw(_.uuid(), toDateString(new Date()), [], [], null);
    setDraws(draws => [draw, ...draws]);
  }, []);
  const onSaveDraw = useCallback(async draw => {
    await saveDbItem(db, dbCollection, draw, euroMillionsDrawConverter);
    setDraws(draws => draws.map(d => d.id === draw.id?draw:d));
  }, [db, dbCollection]);
  const onDeleteDraw = useCallback(draw => {
    if (draw.lastUpdated) {
      deleteDbItem(db, dbCollection, draw.id);
    }
    setDraws(draws => draws.filter(d => d.id !== draw.id));
  }, [db, dbCollection]);

  const updateFavorites = useCallback(fav => {
    setFavorites(fav);
    typeof Storage !== "undefined" && localStorage.setItem(EuroMillionsLocalStorageKey, JSON.stringify(fav));
  }, []);

  const handleResetFavorites = useCallback(() => {
    updateFavorites([[], [], []]);
  }, [updateFavorites]);

  const components = [Number, Star, SwissWin];
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
    <Tabs title="Euro Millions" logo="/euroMillions.png" tabs={tabs} selected={view} onClick={setView} >
      {isLoading?
        <Loader text="Récupération des tirages Euro Millions..." shadow={false} />
        :
        view !== "STATS"?
          <Draws draws={draws} favorites={fav} DrawComponent={Draw} canEdit={canEdit} onAddDraw={onAddDraw} onSaveDraw={onSaveDraw} onDeleteDraw={onDeleteDraw} onResetFavorites={handleResetFavorites} isDrawMatching={isDrawMatching} />
          :
          <Stats draws={draws} favorites={fav} />
      }
    </Tabs>
  );
};


export default EuroMillions;