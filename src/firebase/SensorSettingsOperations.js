import { db } from "./firebaseConfig";
import { getDoc, doc, updateDoc } from "firebase/firestore";

/* Get Data */

export const getTempRanges = async () => {
  const docRef = doc(db, "data_read", "temp_range");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return {};
  }
};

export const getHumidRanges = async () => {
  const docRef = doc(db, "data_read", "humid_range");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return {};
  }
};

export const getSmokeRanges = async () => {
  const docRef = doc(db, "data_read", "smoke_range");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return {};
  }
};

export const getSmsRanges = async () => {
  const docRef = doc(db, "data_read", "sms_limit");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return {};
  }
};

/* Set Data */

export const setTempRange = async (low, normal, high) => {
  const docRef = doc(db, "data_read", "temp_range");
  return await updateDoc(docRef, {
    low_temp_range: low,
    normal_temp_range: normal,
    high_temp_range: high,
  });
};

export const setHumidRange = async (low, normal) => {
  const docRef = doc(db, "data_read", "humid_range");
  return await updateDoc(docRef, {
    low_humid_range: low,
    normal_humid_range: normal,
  });
};

export const setSmokeRange = async (limit) => {
  const docRef = doc(db, "data_read", "smoke_range");
  return await updateDoc(docRef, {
    smoke_limit: limit,
  });
};

export const setSmsRange = async (limit) => {
  const docRef = doc(db, "data_read", "sms_limit");
  return await updateDoc(docRef, {
    sms_limit: limit,
  });
};

/* System Actions */

export const rebootSystem = async () => {
  const docRef = doc(db, "data_read", "reboot_pi");
  // return await updateDoc(docRef, {
  // 	status_test: rebootStr,
  // });

  return await updateDoc(docRef, {
    status: "reboot",
  }).then(() => {
    setTimeout(async () => {
      await updateDoc(docRef, {
        status: "rebut",
      });
    }, 2000);
  });
};

export const shutdownSystem = async () => {
  const docRef = doc(db, "data_read", "shutdown_pi");
  // return await updateDoc(docRef, {
  // 	status_test: rebootStr,
  // });

  return await updateDoc(docRef, {
    status: "shutdown",
  }).then(() => {
    setTimeout(async () => {
      await updateDoc(docRef, {
        status: "shudown",
      });
    }, 2000);
  });
};
