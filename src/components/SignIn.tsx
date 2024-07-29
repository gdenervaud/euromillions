import { useEffect } from "react";
import { createUseStyles } from "react-jss";
import firebase from "firebase/compat/app";
import { Auth } from "firebase/auth"; // onAuthStateChanged
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import type { User } from "firebase/auth";

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


const SignIn = ({ auth, onSetUserProfile }: {auth: Auth, onSetUserProfile: (user: User | null) => Promise<void>}) => {

  const classes = useStyles();

  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    // We track the auth state to reset firebaseUi if the user signs out.
    ui.start("#firebaseui-auth-container", {
      callbacks: {
        signInSuccessWithAuthResult: authResult => { // (authResult, redirectUrl) => {
          // Process result. This will not trigger on merge conflicts.
          // On success redirect to signInSuccessUrl.
          onSetUserProfile(authResult.user);
          ui.reset();
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
          ui.reset();
        }
      },
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false
        }
      ]
    });
    // return () => {
    //   //unregisterAuthObserver();
    //   //ui.reset();
    // };
  }, [auth, onSetUserProfile]);

  return (
    <div className={classes.container}>
      <div className={classes.firebaseuiAuthContainer} id="firebaseui-auth-container"></div>
    </div>
  );
};

export default SignIn;
