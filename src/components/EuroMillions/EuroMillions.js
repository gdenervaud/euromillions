import React, { useState, useEffect } from "react";
import _  from "lodash-uuid";

import { Tabs } from "../Tabs";
import { Draws } from "../Draws";
import { Draw } from "./Draw";
import { Stats } from "./Stats";

import { getDbList, saveDbItem, deleteDbItem } from "../../helpers/DbHelper";
import { toDateString } from "../../helpers/DrawHelper";
import { EuroMillionsDraw, euroMillionsDrawConverter } from "../../helpers/EuroMillionsDrawHelper";
// import { draws as defaultDraws } from "../../data/euroMillionsDraws";

const EuroMillionsLocalStorageKey = "EuroMillions";
const saved_favorites_string = (typeof Storage === "undefined" || !localStorage.getItem(EuroMillionsLocalStorageKey))?null:localStorage.getItem(EuroMillionsLocalStorageKey);
let saved_favorite = [[], [], []];
try {
  const res = JSON.parse(saved_favorites_string);
  const [numbers, stars, swissWin] = res;
  if (Array.isArray(numbers) && Array.isArray(stars) && Array.isArray(swissWin)) {
    saved_favorite = res;
  }
} catch (e) {
  //
}

const EuroMillions = ({ db, dbCollection, canEdit }) => {

  const [draws, setDraws] = useState([]);
  const [view, setView] = useState("DRAWS");

  const [favorites, setFavorites] = useState(saved_favorite);

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
    });
  }, [db, dbCollection]);

  const onAddDraw = () => {
    const draw = new EuroMillionsDraw(_.uuid(), toDateString(new Date()), [], [], null);
    setDraws(draws => [draw, ...draws]);
  };
  const onSaveDraw = async draw => {
    await saveDbItem(db, dbCollection, draw, euroMillionsDrawConverter);
    setDraws(draws => draws.map(d => d.id === draw.id?draw:d));
  };
  const onDeleteDraw = draw => {
    if (draw.lastUpdated) {
      deleteDbItem(db, dbCollection, draw.id);
    }
    setDraws(draws => draws.filter(d => d.id !== draw.id));
  };

  const handleOnFavoritesChange = fav => {
    setFavorites(fav);
    typeof Storage !== "undefined" && localStorage.setItem(EuroMillionsLocalStorageKey, JSON.stringify(fav));
  };

  return (
    <Tabs title="Euro Millions" logo="/euroMillions.png" tabs={tabs} selected={view} onClick={setView} >
      {view !== "STATS"?
        <Draws draws={draws} favorites={favorites} DrawComponent={Draw} canEdit={canEdit} onAddDraw={onAddDraw} onSaveDraw={onSaveDraw} onDeleteDraw={onDeleteDraw} onFavoritesChange={handleOnFavoritesChange} />
        :
        <Stats draws={draws} favorites={favorites} onFavoritesChange={handleOnFavoritesChange} />
      }
    </Tabs>
  );
};


export default EuroMillions;