import React, { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Scrollbars } from "react-custom-scrollbars";

// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase-admin";
//import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//import { getDbItem } from "../helpers/DbHelper";
//import { firebaseConfig } from "../firebaseConfig.js";

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const auth = getAuth(app);

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100%"
  },
  users: {
    padding: "0 20px 20px 20px",
    "& > ul": {
      listStyleType: "none",
      margin: 0,
      padding: 0,
      "& > li": {
        display: "block",
        "& + li ": {
          marginTop: "20px"
        }
      }
    }
  },
  user: {
    position: "relative",
    width: "100% ",
    height: "100%",
    padding: "10px 5px",
    border: "1px solid #dee2e6",
    borderRadius: "4px",
    background: "linear-gradient( 0deg,#f8f8f8,#fff)",
    overflow: "hidden",
    "@media screen and (min-width:1024px)": {
      padding: "20px"
    }
  }
});


const User = () => {

  const classes = useStyles();

  return (
    <div className={classes.user}></div>
  );
};

const Users = ({ db }) => {

  const classes = useStyles();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    retrieveUsers();
  }, []);

  const retrieveUsers = async () => {

    const getPaginatedUsers = nextPageToken => {
      // List batch of users, 1000 at a time.
      // auth
      //   .listUsers(1000, nextPageToken)
      //   .then(result => {
      //     const list = result.users.reduce((acc, userRecord) => {
      //       acc.push(userRecord.toJSON());
      //       return acc;
      //     }, []);
      //     if (result.pageToken) {
      //       // List next batch of users.
      //       return [...list, ...getPaginatedUsers(result.pageToken)];
      //     }
      //     return list;
      //   })
      //   .catch(error => {
      //     console.log("Error listing users:", error);
      //     return [];
      //   });
      return [];
    };

    const list = getPaginatedUsers();
    console.log(list);
    setUsers(list);
  };

  const onSaveUser = user => {

  };

  const onDeleteUser = user => {

  };

  return (
    <div className={classes.container}>
      <Scrollbars autoHide>
        <div className={classes.draws} >
          <ul>
            {users.map(user => (
              <li key={user.id} >
                <User user={user} onSave={onSaveUser} onDelete={onDeleteUser} />
              </li>
            ))}
          </ul>
        </div>
      </Scrollbars>
    </div>
  );
};

export default Users;