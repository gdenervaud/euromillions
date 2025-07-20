import { SignIn } from "@clerk/clerk-react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const SignInPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <SignIn />
    </div>
  );
};

export default SignInPage;
