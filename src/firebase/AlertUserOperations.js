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
  limitToFirst,
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
    const snapshot = await get(
      query(dbRef, orderByChild("phone"), limitToFirst(3))
    );

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

export const addAlertUser = async (newAlertUser, counts) => {
  try {
    const userRef = ref(fbDB, "alertusers");
    const newUserRef = push(userRef);

    set(newUserRef, {
      name: newAlertUser.name,
      phone: newAlertUser.phone,
      updates: newAlertUser.updates,
      ...counts,
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
  const triggerDocRef = doc(db, "data_read", "trig_sms");

  /* Counts */
  let regularCount = 0;
  let stageCount = 0;
  let powerCount = 0;
  let callCount = 0;
  let triggerCount = 0;

  let counts = {};

  /* Snapshot */

  const regularDocSnap = await getDoc(regularDocRef);
  const stageDocSnap = await getDoc(stageDocRef);
  const powerDocSnap = await getDoc(powerDocRef);
  const callDocSnap = await getDoc(callDocRef);
  const triggerDocSnap = await getDoc(triggerDocRef)

  /* Set Counts */
  if (regularDocSnap.exists()) {
    const regular = regularDocSnap.data();
    // Get the last key-value pair
    const keys = Object.keys(regular); // Get all keys in an array
    const lastKey = keys[keys.length - 1]; // Access the last key
    const lastPersonValue = Number(lastKey.split("_")[1])
    regularCount = lastPersonValue
    // const lastValue = regular[lastKey]; // Get the value associated with the last key
  } else {
    console.log("No such document named regular_sms !");
  }

  if (stageDocSnap.exists()) {
    const stage = stageDocSnap.data();

    // Get the last key-value pair
    const keys = Object.keys(stage); // Get all keys in an array
    const lastKey = keys[keys.length - 1]; // Access the last key
    const lastPersonValue = Number(lastKey.split("_")[1])
    stageCount = lastPersonValue
  } else {
    console.log("No such document named stage_sms !");
  }

  if (powerDocSnap.exists()) {
    const power = powerDocSnap.data();
    
    // Get the last key-value pair
    const keys = Object.keys(power); // Get all keys in an array
    const lastKey = keys[keys.length - 1]; // Access the last key
    const lastPersonValue = Number(lastKey.split("_")[1])
    powerCount = lastPersonValue
  } else {
    console.log("No such document named power_sms !");
  }

  if (callDocSnap.exists()) {
    const calls = callDocSnap.data();
    // Get the last key-value pair
    const keys = Object.keys(calls); // Get all keys in an array
    const lastKey = keys[keys.length - 1]; // Access the last key
    const lastPersonValue = Number(lastKey.split("_")[1])
    callCount = lastPersonValue
  } else {
    console.log("No such document named call !");
  }

  if (triggerDocSnap.exists()) {
    const trigger = triggerDocSnap.data();
    // Get the last key-value pair
    const keys = Object.keys(trigger); // Get all keys in an array
    const lastKey = keys[keys.length - 1]; // Access the last key
    const lastPersonValue = Number(lastKey.split("_")[1])
    triggerCount = lastPersonValue
  } else {
    console.log("No such document named call !");
  }

  /* Add Number */
  newAlertUser.updates.map((type) => {
    switch (type) {
      case 0: {
        let regularName = "person_" + (regularCount + 1);
        counts["regularCount"] = regularCount + 1;
        counts;
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
        let stageName = "person_" + (stageCount + 1);
        counts["stageCount"] = stageCount + 1;
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
        let powerName = "person_" + (powerCount + 1);
        counts["powerCount"] = powerCount + 1;
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
        let callName = "person_" + (callCount + 1);
        counts["callCount"] = callCount + 1;
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
      case 4: {
        let triggerName = "person_" + (triggerCount + 1);
        counts["triggerCount"] = triggerCount + 1;
        updateDoc(
          triggerDocRef,
          {
            // [newAlertUser.name]: newAlertUser.phone,
            [triggerName]: newAlertUser.phone,
          },
          {
            merge: true,
          }
        )
          .then(() => {
            console.log("Trigger SMS Document updated successfully");
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

  // counts = {
  //   regularCount,
  //   stageCount,
  //   powerCount,
  //   callCount,
  //   triggerCount
  // }

  return counts;
};

export const deleteAlertUser = async (alertUser) => {

  /* Delete Alert User Number From Firestore */

  const regularDocRef = doc(db, "data_read", "regular_sms");
  const stageDocRef = doc(db, "data_read", "stage_sms");
  const powerDocRef = doc(db, "data_read", "power_sms");
  const callDocRef = doc(db, "data_read", "call");
  const triggerDocRef = doc(db, "data_read", "trig_sms");

  alertUser.updates.map((type) => {
    switch (type) {
      case 0: {
        const name = "person_" + alertUser.regularCount;
        updateDoc(regularDocRef, {
          // [alertUser.name]: deleteField()
          [name]: deleteField(),
        })
          .then(() => {
            console.log("User Deleted from Regular SMS Document successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        break;
      }
      case 1: {
        const name = "person_" + alertUser.stageCount;
        updateDoc(stageDocRef, {
          // [alertUser.name]: deleteField()
          [name]: deleteField(),
        })
          .then(() => {
            console.log("User Deleted from Stage SMS Document successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        break;
      }
      case 2: {
        const name = "person_" + alertUser.powerCount;
        updateDoc(powerDocRef, {
          // [alertUser.name]: deleteField()
          [name]: deleteField(),
        })
          .then(() => {
            console.log("User Deleted from Power up SMS Document successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        break;
      }
      case 3: {
        const name = "person_" + alertUser.callCount;
        updateDoc(callDocRef, {
          // [alertUser.name]: deleteField()
          [name]: deleteField(),
        })
          .then(() => {
            console.log("User Deleted from Call Document successfully");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        break;
      }
      case 4: {
        const name = "person_" + alertUser.triggerCount;
        updateDoc(triggerDocRef, {
          // [alertUser.name]: deleteField()
          [name]: deleteField(),
        })
          .then(() => {
            console.log("User Deleted from Trigger SMS Document successfully");
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

  /* Delete Alert User From Realtime DB */
  try {
    const dbRef = ref(fbDB, "alertusers");
    const snapshot = await get(
      query(dbRef, orderByChild("phone"), equalTo(alertUser.phone))
    );

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userKey = Object.keys(userData)[0]; // Get the key of the first matching user

      const userRef = child(dbRef, userKey);
      await remove(userRef);
      console.log("User removed successfully");
      return true;
    } else {
      console.log("User not found");
      return false
    }
  } catch (error) {
    console.error("Error fetching Alert users:", error);
    throw error;
  }
}
