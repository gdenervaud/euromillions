import functions from "firebase/functions";
import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase/auth";

const app = initializeApp();
const auth = getAuth(app);

exports.updateAccess = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    const newValue = change.after.data();
    const customClaims = {
      role: newValue.role};

    // Set custom user claims on this update.
    return auth.setCustomUserClaims(context.params.userId, customClaims)
      .then(() => {
        console.log("Done!");
      })
      .catch((error) => {
        console.log(error);
      });
  });
