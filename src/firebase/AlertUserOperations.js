import { db } from "./firebaseConfig";
import { doc, updateDoc, deleteField } from "firebase/firestore";
import {
  ref,
  set,
  push,
  query,
  get,
  orderByChild,
  equalTo,
  child,
  remove,
  limitToFirst
} from "firebase/database";
import { fbDB } from "./firebaseConfig";

/* Get Alert Users */
export const getAllAlertUsers = async () => {

  try {
    const dbRef = ref(fbDB, "alertusers");
    const snapshot = await get(query(dbRef, orderByChild("phone")));

    if (snapshot.exists()) {
      const usersData = Object.values(snapshot.val());
      return usersData;
    } else {
      console.log("No Alert users found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching Alert users:", error);
    throw error;
  }
};

/* Get Alert Users */
export const getLimitedAlertUsers = async () => {

  try {
    const dbRef = ref(fbDB, "alertusers");
    const snapshot = await get(query(dbRef, orderByChild("phone"), limitToFirst(3) ));

    if (snapshot.exists()) {
      const usersData = Object.values(snapshot.val());
      console.log(usersData)
      return usersData;
    } else {
      console.log("No Alert users found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching Alert users:", error);
    throw error;
  }
};

/* Add Alert User */

export const addAlertUser = async (newAlertUser) => {
  try {
    const userRef = ref(fbDB, "alertusers");
    const newUserRef = push(userRef);
    set(newUserRef, {
      name: newAlertUser.name,
      phone: newAlertUser.phone,
      updates: newAlertUser.updates,
    });
    console.log("Alert user added successfully!");
    return true; // Indicate success
  } catch (error) {
    console.error("Error adding alert user:", error);
    return false; // Indicate failure
  }
};

export const addAlertUserToFirestore = async (newAlertUser) => {
  const regularDocRef = doc(db, "data_read", "regular_sms");
  const stageDocRef = doc(db, "data_read", "stage_sms");
  const powerDocRef = doc(db, "data_read", "power_sms");
  const callDocRef = doc(db, "data_read", "call");

  /* Add Number */
  newAlertUser.updates.map((type) => {
    switch (type) {
      case 0:
        updateDoc(
          regularDocRef,
          {
            [newAlertUser.name]: newAlertUser.phone,
          },
          {
            merge: true,
          }
        )
          .then(() => {
            console.log("Regular SMS Document updated successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        break;

      case 1:
        updateDoc(
          stageDocRef,
          {
            [newAlertUser.name]: newAlertUser.phone,
          },
          {
            merge: true,
          }
        )
          .then(() => {
            console.log("Stage SMS Document updated successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        break;

      case 2:
        updateDoc(
          powerDocRef,
          {
            [newAlertUser.name]: newAlertUser.phone,
          },
          {
            merge: true,
          }
        )
          .then(() => {
            console.log("Power up SMS Document updated successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        break;

      case 3:
        updateDoc(
          callDocRef,
          {
            [newAlertUser.name]: newAlertUser.phone,
          },
          {
            merge: true,
          }
        )
          .then(() => {
            console.log("Call Document updated successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        break;
      default:
        console.log("Not a valid number. Please provide a valid number.");
    }
  });
};

export const deleteAlertUser = async (alertUser) => {
  /* Delete From Realtime DB */
  try {
    const dbRef = ref(fbDB, "alertusers");
    const snapshot = await get(
      query(dbRef, orderByChild("phone"), equalTo(alertUser.phone))
    );

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userKey = Object.keys(userData)[0]; // Get the key of the first matching user
      console.log(userKey);

      const userRef = child(dbRef, userKey);
      await remove(userRef);

        console.log("User removed successfully");
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error fetching Alert users:", error);
    throw error;
  }

  /* Delete Number From Firestore */

  const regularDocRef = doc(db, "data_read", "regular_sms");
  const stageDocRef = doc(db, "data_read", "stage_sms");
  const powerDocRef = doc(db, "data_read", "power_sms");
  const callDocRef = doc(db, "data_read", "call");

  alertUser.updates.map((type) => {
    switch (type) {
      case 0:
        updateDoc(
          regularDocRef,
          {
            [alertUser.name]: deleteField()
          }
        )
          .then(() => {
            console.log("User Deleted from Regular SMS Document successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        break;

      case 1:
        updateDoc(
          stageDocRef,
          {
            [alertUser.name]: deleteField()
          }
        )
          .then(() => {
            console.log("User Deleted from Stage SMS Document successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        break;

      case 2:
        updateDoc(
          powerDocRef,
          {
            [alertUser.name]: deleteField()
          }
        )
          .then(() => {
            console.log("User Deleted from Power up SMS Document successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        break;

      case 3:
        updateDoc(
          callDocRef,
          {
			[alertUser.name]: deleteField()
          }
        )
          .then(() => {
            console.log("User Deleted from Call Document successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        break;
      default:
        console.log("Not a valid number. Please provide a valid number.");
    }
  });

};
