import React, { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import firebase from "firebase/compat/app";
import { Auth } from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

import { User } from "../helpers/DbHelper";

const useStyles = createUseStyles({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.15)",
    zIndex: 1000
  },
  firebaseuiAuthContainer: {
    "& > .firebaseui-container": {
      marginTop: "50vh",
      transform: "translateY(-50%)"
    }
  }
});


const SignIn = ({ auth, onSetUserProfile }: {auth: Auth, onSetUserProfile: (user: User | null) => void}) => {

  const classes = useStyles();

  const [firebaseUI, setFirebaseUI] = useState<firebaseui.auth.AuthUI | null>(null);

  useEffect(() => {
    if (!firebaseUI) {
      // Initialize the FirebaseUI Widget using Firebase.
      const ui = new firebaseui.auth.AuthUI(auth); //firebase.auth()
      setFirebaseUI(ui);
      ui.start("#firebaseui-auth-container", {
        callbacks: {
          signInSuccessWithAuthResult: authResult => { // (authResult, redirectUrl) => {
            // Process result. This will not trigger on merge conflicts.
            // On success redirect to signInSuccessUrl.
            // eslint-disable-next-line no-debugger
            onSetUserProfile(authResult.user);
            ui.delete();
            return false;
          },
          // signInFailure callback must be provided to handle merge conflicts which
          // occur when an existing credential is linked to an anonymous user.
          signInFailure: error => {
            // For merge conflicts, the error.code will be
            // 'firebaseui/anonymous-upgrade-merge-conflict'.
            if (error.code !== "firebaseui/anonymous-upgrade-merge-conflict") {
              return Promise.resolve();
            }
            // The credential the user tried to sign in with.
            const cred = error.credential;
            console.log(cred);
            onSetUserProfile(null);
            ui.delete();
          }
        },
        signInOptions: [
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
          }
        ]
      });
    }
    return () => {
      try {
        firebaseUI && firebaseUI.delete();
      } catch (e) {
        //already deleted
      }
    };
  }, [auth, firebaseUI]);

  return (
    <div className={classes.container}>
      <div className={classes.firebaseuiAuthContainer} id="firebaseui-auth-container"></div>
    </div>
  );
};

export default SignIn;
