


import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    width: "100% ",
    height: "100%",
    margin: 0,
    display: "grid",
    gridTemplateRows: "min-content 1fr",
    gridTemplateColumns: "1fr",
    "& > ul.nav.nav-tabs": {
      border: 0,
      "@media screen and (min-width:1024px)": {
        borderBottom: "1px solid #dee2e6 !important"
      },
      "& > li.nav-item > button.nav-link" : {
        margin: "10px 0.75rem 4px 0.75rem",
        border: "0 !important",
        borderBottom: "2px solid transparent",
        padding: "4px 0",
        paddingBottom: "6px",
        backgroundColor: "#fff",
        color: "#212529",
        "@media screen and (min-width:1024px)": {
          padding: "0.5rem !important",
          margin: "0 !important",
          marginBottom: "-1px !important",
          border: "1px solid transparent !important",
          backgroundColor: "revert !important"
        },
        "&.active" : {
          color: "#212529 !important",
          borderBottom: "2px solid #111 !important",
          "@media screen and (min-width:1024px)": {
            color: "#4d4d4d !important",
            backgroundColor: "#fff !important",
            border: "1px solid transparent !important",
            borderColor: "#dee2e6 #dee2e6 #fff !important",
            borderBottom: "1px solid white !important"
          }
        }
      },
      "& > li.nav-item:first-child" : {
        marginLeft: "100px"
      },
      "& > li.nav-item:first-child > button.nav-link" : {
        "@media screen and (min-width:1024px)": {
          borderLeftWidth: "1px"
        }
      }
    },
    "@media screen and (min-width:1024px)": {
      width: "calc(100% - 40px)",
      height: "calc(100% - 40px)",
      margin: "20px"
    }
  },
  content: {
    position: "relative",
    width: "100% ",
    height: "100%",
    overflow: "hidden",
    "@media screen and (min-width:1024px)": {
      border: "1px solid #dee2e6",
      borderTop: 0
    }
  },
  logo: {
    position: "absolute",
    top: "12px",
    left: "10px",
    width: "75px",
    height: "25px",
    "@media screen and (min-width:1024px)": {
      top: "25px",
      left: "30px"
    }
  }
});

interface Tab {
  name: string;
  value: string;
  visible: boolean;
}

interface TabsProps {
  title: string;
	logo: string;
	tabs: Tab[];
	selected: string;
	onClick: (value: string) => void;
	children: JSX.Element
}

export const Tabs = ({ title, logo, tabs, selected, onClick, children }: TabsProps) => {

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ul className="nav nav-tabs">
        {tabs.filter(tab => tab.visible).map(tab =>
          <li key={tab.value} className="nav-item">
            <button className={`nav-link ${tab.value === selected?"active":""}`} onClick={() => onClick(tab.value)}>{tab.name}</button>
          </li>
        )}
      </ul>
      <div className={classes.content}>
        {children}
      </div>
      <img className={classes.logo} src={logo} alt={title} />
    </div>
  );
};

export default Tabs;
