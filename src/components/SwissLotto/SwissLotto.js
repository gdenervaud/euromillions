import React, { useState, useEffect } from "react";
import _  from "lodash-uuid";

import { Tabs } from "../Tabs";
import { Draws } from "../Draws";
import { Draw } from "./Draw";
import { Stats } from "./Stats";

import { getDbList, saveDbItem, deleteDbItem } from "../../helpers/DbHelper";
import { toDateString } from "../../helpers/DrawHelper";
import { SwissLottoDraw, swissLottoDrawConverter } from "../../helpers/SwissLottoDrawHelper";
// import { draws as defaultDraws } from "../../data/swissLottoDraws";

const SwissLotto = ({ db, dbCollection, onMenu }) => {

  const [draws, setDraws] = useState([]);
  const [view, setView] = useState("DRAWS");

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

  return (
    <Tabs title="Swiss Lotto" logo="/swissLotto.png" tabs={tabs} selected={view} onClick={setView} onMenu={onMenu} >
      {view !== "STATS"?
        <Draws draws={draws} DrawComponent={Draw} onAddDraw={onAddDraw} onSaveDraw={onSaveDraw} onDeleteDraw={onDeleteDraw} />
        :
        <Stats draws={draws} />
      }
    </Tabs>
  );
};


export default SwissLotto;