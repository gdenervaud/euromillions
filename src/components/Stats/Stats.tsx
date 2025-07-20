

import { FC, useState, useCallback, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { Scrollbars } from "react-custom-scrollbars-2";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { Draw } from "../../types";
import { SmoothingMethod, SortCriteria } from "../../types";
import { ValueComponentProps } from "../Value";
import Toggle from "../Toggle";
import { Favorites } from "./Favorites";
import { Serie } from "./Serie";
import { PeriodSelector } from "./PeriodSelector";
import { SmoothingSelector } from "./SmoothingSelector";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    width: "100% ",
    height: "100%",
    display: "grid",
    gridTemplateRows: "min-content 1fr",
    gridTemplateColumns: "1fr"
  },
  header: {
    margin: "10px",
    "& > div": {
      display: "inline-block",
      "& + div": {
        marginLeft: "20px"
      }
    },
    "@media screen and (min-width:768px)": {
      margin: "20px 20px 10px 20px"
    }
  },
  gridViewToggle: {
    whiteSpace: "nowrap"
  },
  favoritesToggle: {
    whiteSpace: "nowrap"
  },
  stats: {
    padding: "0 10px 10px 10px",
    overflowX: "hidden",
    "& > div + div": {
      marginTop: "20px"
    },
    "@media screen and (min-width:768px)": {
      padding: "0 20px 20px 20px"
    }
  },
  serie: {
    "& + $serie": {
      marginTop: "15px"
    }
  },
  settingsBtn: {
    position: "absolute",
    top: 0,
    right: "12px",
    margin: 0,
    padding: "8px",
    border: 0,
    background: "transparent",
    fontSize: "x-large",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "1px 1px 2px black"
    },
    "@media screen and (min-width:1024px)": {
      top: "5px",
      right: "2px"
    }
  },
  settings: {
    "& > div + div": {
      marginTop: "15px"
    }
  }
});

export interface Serie<DrawType extends Draw> {
  maxValue: number;
  drawSize: number;
  itemComponent: FC<ValueComponentProps>;
  getValue: (draw: DrawType) => number[];
  favorites: number[];
  onFavoriteToggle: (value?: number, add?: boolean) => void;
}

export interface StatsProps<DrawType extends Draw> {
  draws: DrawType[];
  series: Serie<DrawType>[];
  columns: number
}


export const Stats = <DrawType extends Draw, >({ draws, series, columns}: StatsProps<DrawType>) => {

  const drawsByDate = [...draws].sort((a, b) => b.date.localeCompare(a.date));

  const [showSettings, setShowSettings] = useState(false);
  const [period, setPeriod] = useState(drawsByDate.length);
  const [smoothing, setSmoothing] = useState(drawsByDate.length >= 10?10:drawsByDate.length);
  const [smoothingMethod, setSmoothingMethod] = useState(SmoothingMethod.sma);

  const [sortAscending, setSortAscending] = useState(true);
  const [sortCriteria, setSortCriteria] = useState(SortCriteria.value);

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showAsGrid, setShowAsGrid] = useState(true);

  const handleOnSort = useCallback((criteria: SortCriteria) => {
    if (criteria === sortCriteria) {
      setSortAscending(!sortAscending);
    } else {
      setSortAscending(criteria === SortCriteria.value);
      setSortCriteria(criteria);
    }
  }, [sortAscending, sortCriteria]);

  const handleShowSettings = useCallback(() => setShowSettings(true), []);
  const handleCloseSettings = useCallback(() => setShowSettings(false), []);

  const hasFavorites = useMemo(() => series.some(serie => !!serie.favorites.length), [series]);

  const handleOnShowOnlyFavoritesChange = useCallback((value: unknown): void => setShowOnlyFavorites(value as boolean), [setShowOnlyFavorites]);

  const handleOnShowAsGridChange = useCallback((value: unknown): void => {
    setShowAsGrid(value as boolean);
    setSortCriteria(SortCriteria.value);
    setSortAscending(true);
    setShowOnlyFavorites(false);
  }, [setShowAsGrid]);

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.header} >
        <button className={classes.settingsBtn} aria-label="configuration" onClick={handleShowSettings}><FontAwesomeIcon icon="cog" title="configuration" /></button>
        <Modal show={showSettings} onHide={handleCloseSettings}>
          <Modal.Header closeButton>
            <Modal.Title><FontAwesomeIcon icon="cog" title="configuration" /> Configuration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={classes.settings}>
              <PeriodSelector draws={draws} period={period} onChange={setPeriod} />
              <SmoothingSelector draws={draws} smoothing={smoothing} method={smoothingMethod} onSmoothingChange={setSmoothing} onMethodChange={setSmoothingMethod} />
            </div>
          </Modal.Body>
        </Modal>
        <Toggle
          className={classes.gridViewToggle}
          value={showAsGrid}
          items={[
            {
              value: true,
              label: "",
              icon: "th",
              activeColor: "#40a9f3",
              inactiveColor: "rgb(224, 224, 224)"
            },
            {
              value: false,
              label: "",
              icon: "list-ul",
              activeColor: "#40a9f3",
              inactiveColor: "rgb(224, 224, 224)"
            }
          ]}
          onChange={handleOnShowAsGridChange}
        />
        {hasFavorites && !showAsGrid && (
          <Toggle
            className={classes.favoritesToggle}
            value={showOnlyFavorites}
            items={[
              {
                value: true,
                label: "Uniquement les favoris",
                icon: "star",
                activeColor: "yellow",
                inactiveColor: "rgb(224, 224, 224)"
              },
              {
                value: false,
                label: "Tous les numéros",
                icon: "circle",
                activeColor: "#40a9f3",
                inactiveColor: "rgb(224, 224, 224)"
              }
            ]}
            onChange={handleOnShowOnlyFavoritesChange}
          />
        )}
      </div>
      <div>
        <Scrollbars autoHide>
          <div className={classes.stats} >
            {series.map(({maxValue, drawSize, itemComponent, getValue, favorites, onFavoriteToggle}, index) => (
              <div  key={index} className={classes.serie} >
                {!showOnlyFavorites && !showAsGrid && (
                  <Favorites favorites={favorites} favoriteComponent={itemComponent} onFavoriteClick={onFavoriteToggle} />
                )}
                <Serie draws={draws} maxValue={maxValue} drawSize={drawSize} favorites={favorites} itemComponent={itemComponent} getValue={getValue} onFavoriteToggle={onFavoriteToggle} period={period} smoothing={smoothing} smoothingMethod={smoothingMethod} sortAscending={sortAscending} sortCriteria={sortCriteria} onSort={handleOnSort} showOnlyFavorites={showOnlyFavorites} showAsGrid={showAsGrid} columns={columns}/>
              </div>
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default Stats;
