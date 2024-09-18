import { db } from "./firebaseConfig";
import { doc, updateDoc, deleteField, getDoc } from "firebase/firestore";
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

  /* Counts */
  let regularCount = 0
  let stageCount = 0
  let powerCount = 0
  let callCount = 0

  /* Snapshot */

  const regularDocSnap = await getDoc(regularDocRef)
  const stageDocSnap = await getDoc(stageDocRef)
  const powerDocSnap = await getDoc(powerDocRef)
  const callDocSnap = await getDoc(callDocRef)

  /* Set Counts */
  if (regularDocSnap.exists()) {
    const regular = regularDocSnap.data()
    console.log("Regular data : ", regular);
    regularCount = Object.keys(regular).length
    console.log("Regular data Count : ", regularCount);
  } else {
    console.log("No such document named regular_sms !");
  }

  if (stageDocSnap.exists()) {
    const stage = stageDocSnap.data()
    console.log("Stage data : ", stage);
    stageCount = Object.keys(stage).length
    console.log("Stage data Count : ", stageCount);
  } else {
    console.log("No such document named stage_sms !");
  }

  if (powerDocSnap.exists()) {
    const power = powerDocSnap.data()
    console.log("Power data : ", power);
    powerCount = Object.keys(power).length
    console.log("Power data Count : ", powerCount);
  } else {
    console.log("No such document named power_sms !");
  }
  
  if (callDocSnap.exists()) {
    const calls = callDocSnap.data()
    console.log("Call data : ", calls);
    callCount = Object.keys(calls).length
    console.log("Call data Count : ", callCount);
  } else {
    console.log("No such document named call !");
  }

  /* Add Number */
  newAlertUser.updates.map((type) => {
    switch (type) {
      case 0: {

        let regularName = 'person_' + (regularCount + 1);
        updateDoc(
          regularDocRef,
          {
            // [newAlertUser.name]: newAlertUser.phone,
            [regularName]: newAlertUser.phone,
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
      }

      case 1: {
        let stageName = 'person_' + (stageCount + 1)
        updateDoc(
          stageDocRef,
          {
            // [newAlertUser.name]: newAlertUser.phone,
            [stageName]: newAlertUser.phone,
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
      }

      case 2: {
        let powerName = 'person_' + (powerCount + 1)
        updateDoc(
          powerDocRef,
          {
            // [newAlertUser.name]: newAlertUser.phone,
            [powerName]: newAlertUser.phone,
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
      }

      case 3: {
        let callName = 'person_' + (callCount + 1)
        updateDoc(
          callDocRef,
          {
            // [newAlertUser.name]: newAlertUser.phone,
            [callName]: newAlertUser.phone,
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
      }
      default:
        console.log("Not a valid number. Please provide a valid number.");
    }
  });
}

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
