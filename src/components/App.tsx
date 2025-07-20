import{ useState, useCallback } from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { EventKey, SelectCallback } from "@restart/ui/types";
import { useConvexAuth } from "convex/react";
import { SignInButton, SignOutButton } from "@clerk/clerk-react";
import { useUserSync } from "../hooks/useUserSync";

import EuroMillions from "./EuroMillions/EuroMillions";
import SwissLotto from "./SwissLotto/SwissLotto";
import Users from "./Users";

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100%"
  },
  pannel: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    "@media (orientation: landscape)": {
      display: "flex"
    },
    "@media screen and (min-width:1024px) and (orientation:portrait)": {
      display: "block"
    },
    "@medias screen and (min-width:1024px) and (orientation:landscape)": {
      display: "flex !important"
    },
    "& button": {
      margin: "50px",
      padding: "50px",
      border: 0,
      borderRadius: "30px",
      background: "white",
      boxShadow: "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
      transition: "all 0.3s ease-in-out",
      "&:hover, &:focus, &:active": {
        transform: "scale(1.05)",
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
      },
      "& img": {
        width: "150px",
        height: "50px",
        "@media screen and (min-width:768px) and (orientation: portrait)": {
          width: "300px",
          height: "100px",
        },
        "@media screen and (min-width:1024px)": {
          width: "300px",
          height: "100px",
        }
      }
    }
  },
  menuBtn: {
    position: "absolute",
    zIndex: 10,
    top: "-5px",
    right: "5px",
    border: 0,
    background: "transparent",
    fontSize: "x-large",
    padding: "6px 0",
    color: "#454545",
    "&:hover": {
      boxShadow: "1px 1px 2px #8f8a8a",
      background: "white"
    },
    "@media screen and (min-width:1024px)": {
      top: "5px",
      right: "10px",
      padding: 0
    },
    "& > .nav-item.dropdown": {
      "& > a.dropdown-toggle.nav-link": {
        color: "#454545",
        "&::after": {
          display: "none"
        }
      },
      "& > .dropdown-menu > a.dropdown-item": {
        padding: "1.25rem 1.5rem",
        "@media screen and (min-width:1024px)": {
          padding: ".25rem 1.5rem"
        },
        "& img[alt=\"EuroMillions\"]": {
          transform: "translateX(30px) scale(3)",
          "@media screen and (min-width:1024px)": {
            transform: "translateX(30px) scale(2)"
          }
        },
        "& img[alt=\"Swiss Lotto\"]": {
          transform: "translateX(30px) scale(2.75)",
          "@media screen and (min-width:1024px)": {
            transform: "translateX(30px) scale(1.75)"
          }
        }
      }
    }
  }
});

const App = () => {

  const classes = useStyles();

  const [view, setView] = useState<string | null | undefined>(null);
  const { isAuthenticated } = useConvexAuth();
  const { user: profile } = useUserSync();

  const handleMenuSelect: SelectCallback = useCallback((eventKey: EventKey|null) => {
    switch (eventKey) {
    case "euromillions":
      setView("euromillions");
      break;
    case "swisslotto":
      setView("swisslotto");
      break;
    case "users":
      setView("users");
      break;
    default: // home
      setView(undefined);
    }
  }, []);

  const menuTitle = (<FontAwesomeIcon icon="bars" title="menu" />);

  return (
    <div className={classes.container}>
      {view === "users" && profile?.admin?
        <Users />
        :
        view === "euromillions"?
          <EuroMillions dbCollection="euromillions_draws" canEdit={profile?.role === "editor" || profile?.admin} />
          :
          view === "swisslotto"?
            <SwissLotto dbCollection="swisslotto_draws" canEdit={profile?.role === "editor" || profile?.admin} />
            :
            <div className={classes.pannel}>
              <button onClick={() => setView("euromillions")} title="EuroMillions">
                <img src="/euroMillions.png" alt="EuroMillions" />
              </button>
              <button onClick={() => setView("swisslotto")} title="Swiss Lotto">
                <img src="/swissLotto.png" alt="Swiss Lotto" />
              </button>
            </div>
      }
      <Nav className={classes.menuBtn} onSelect={handleMenuSelect}>
        <NavDropdown title={menuTitle} id="nav-dropdown">
          {!!profile?.admin && (
            <>
              <NavDropdown.Item eventKey="users"><FontAwesomeIcon icon="users" title="users" /> Users</NavDropdown.Item>
              <NavDropdown.Divider />
            </>
          )}
          {!!view && (
            <>
              <NavDropdown.Item eventKey="home"><FontAwesomeIcon icon="home" title="home" /> Home</NavDropdown.Item>
              <NavDropdown.Divider />
            </>
          )}
          {view !== "euromillions" && (
            <>
              <NavDropdown.Item eventKey="euromillions"><img src="/euroMillions.png" alt="EuroMillions" width="48px" height="16px" /></NavDropdown.Item>
              <NavDropdown.Divider />
            </>
          )}
          {view !== "swisslotto" && (
            <>
              <NavDropdown.Item eventKey="swisslotto"><img src="/swissLotto.png" alt="Swiss Lotto" width="48px" height="16px" /></NavDropdown.Item>
              <NavDropdown.Divider />
            </>
          )}
          {isAuthenticated && (
            <SignOutButton> 
              <NavDropdown.Item><FontAwesomeIcon icon="sign-out-alt" title="sign out" /> Sign out</NavDropdown.Item>
            </SignOutButton>
          )}
          {!isAuthenticated && (
            <SignInButton>
              <NavDropdown.Item><FontAwesomeIcon icon="sign-in-alt" title="sign in" /> Sign in</NavDropdown.Item>
            </SignInButton>
          )}
        </NavDropdown>
      </Nav>
    </div>
  );
};

export default App;
