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

const EuroMillions = ({ db, dbCollection }) => {

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

  return (
    <Tabs tabs={tabs} selected={view} onClick={setView} >
      {view !== "STATS"?
        <Draws draws={draws} DrawComponent={Draw} onAddDraw={onAddDraw} onSaveDraw={onSaveDraw} onDeleteDraw={onDeleteDraw} />
        :
        <Stats draws={draws} />
      }
    </Tabs>
  );
};


export default EuroMillions;