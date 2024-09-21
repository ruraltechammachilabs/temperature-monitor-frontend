import { db } from "./firebaseConfig";
import { getDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";
import {
  ref,
  set,
  push,
  onValue,
  child,
  get,
  orderByChild,
  startAt,
  endAt,
  remove,
  query,
} from "firebase/database";
import { fbDB } from "./firebaseConfig";

export const fetchData = async () => {
  const docRef = doc(db, "Data_center", "Data_reads");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
};

export const listenForDocumentChanges = (callback) => {
  const unsubscribe = onSnapshot(
    doc(db, "Data_center", "Data_reads"),
    (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        console.log("No such document exist!");
      }
    }
  );

  return unsubscribe;
};

/* Detect change in Temp Range */
export const listenForTempRangeChanges = (callback) => {
  const unsubscribe = onSnapshot(doc(db, "data_read", "temp_range"), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      console.log("No such document exist!");
    }
  });

  return unsubscribe;
};

/* Detect change in Humidity Range */
export const listenForHumidRangeChanges = (callback) => {
  const unsubscribe = onSnapshot(doc(db, "data_read", "humid_range"), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      console.log("No such document exist!");
    }
  });

  return unsubscribe;
};

/* Detect change in Humidity Range */
export const listenForSmokeRangeChanges = (callback) => {
  const unsubscribe = onSnapshot(doc(db, "data_read", "smoke_range"), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      console.log("No such document exist!");
    }
  });

  return unsubscribe;
};

/* Live Graph */

export const setRealtimeValues = (data) => {
  const monitorRef = ref(fbDB, "monitor");
  const newMonitorRef = push(monitorRef);
  set(newMonitorRef, data);
};

export const convertToTimestamp = (dateTimeString) => {
  const [dateStr, timeStr] = dateTimeString.split(" ");
  const [day, month, year] = dateStr.split("/");
  const [hours, minutes, seconds] = timeStr.split(":");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds)
  );
  return date.getTime();
};

export const convertDateStringToMilliseconds = async (dateString) => {
  // const dateString = "20/09/2024 14:14:28";
  if(dateString !== "" && dateString !== undefined) {
    // Split the date and time parts
    const [datePart, timePart] = dateString.split(" ");
  
    // Extract day, month, and year from the date part
    const [day, month, year] = datePart.split("/").map(Number);
  
    // Extract hours, minutes, and seconds from the time part
    const [hours, minutes, seconds] = timePart.split(":").map(Number);
  
    // Create a Date object using year, month (subtract 1 because months are 0-indexed), and day
    const dateObj = new Date(year, month - 1, day, hours, minutes, seconds);
  
    // Convert the date object to milliseconds since Unix epoch
    const milliseconds = dateObj.getTime();
  
    return milliseconds;
  } else return Date.now() 
};

export const getChartData = async (sensorType, callback) => {
  const dbRef = ref(fbDB, "monitor");

  let tempChartData = [];
  let humidChartData = [];
  let smokeChartData = [];

  onValue(
    dbRef,
    (snapshot) => {
      let finalData = [];
      const data = snapshot.val();

      // Filter data for the past 24 hours
      const filteredData = Object.values(data);
      // .filter(item => {
      //   const timestamp = convertToTimestamp(item.Timestamp)
      //   const now = Date.now();
      //   return now - timestamp <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      // });

      tempChartData = filteredData.map((item) => {
        const tempData = [convertToTimestamp(item.Timestamp), item.Temperature];
        return tempData;
      });

      humidChartData = filteredData.map((item) => {
        const tempData = [convertToTimestamp(item.Timestamp), item.Humidity];
        return tempData;
      });

      smokeChartData = filteredData.map((item) => {
        const tempData = [convertToTimestamp(item.Timestamp), item.Smoke];
        return tempData;
      });

      if (sensorType === "Temperature") {
        finalData = tempChartData;
      } else if (sensorType === "Humidity") {
        finalData = humidChartData;
      } else if (sensorType === "Smoke") {
        finalData = smokeChartData;
      } else {
        finalData = [];
      }

      callback(finalData);
    },
    {
      onlyOnce: true,
    }
  );
};

export const getChartDataByDateTime = async () => {
  try {
    const now = new Date().getTime();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    const dbRef = ref(fbDB, "monitor");
    const timestampRef = query(
      dbRef,
      orderByChild("TimestampTime"),
      startAt(twentyFourHoursAgo),
      endAt(now)
    );
    const snapshot = await get(timestampRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const monitorData = Object.values(data);

      const liveArr = {
        temperature: [],
        humidity: [],
        smoke: [],
      };

      const tempChartData = monitorData.map((item) => {
        const tempData = [convertToTimestamp(item.Timestamp), item.Temperature];
        return tempData;
      });

      const humidChartData = monitorData.map((item) => {
        const tempData = [convertToTimestamp(item.Timestamp), item.Humidity];
        return tempData;
      });

      const smokeChartData = monitorData.map((item) => {
        const tempData = [convertToTimestamp(item.Timestamp), item.Smoke];
        return tempData;
      });

      liveArr.temperature = tempChartData;
      liveArr.humidity = humidChartData;
      liveArr.smoke = smokeChartData;

      return liveArr;
    } else {
      console.log("No recent data found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching recent data:", error);
    throw error;
  }
};

export const deleteNodesWithoutTimestampTime = async () => {
  try {
    const dbRef = ref(fbDB, "monitor");
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const nodes = snapshot.val();

      // Filter nodes that don't have "TimestampTime"
      const nodesToDelete = Object.keys(nodes).filter(
        (key) => !nodes[key].TimestampTime
      );

      // Delete filtered nodes
      for (const key of nodesToDelete) {
        const nodeRef = child(dbRef, key);
        await remove(nodeRef);
      }

      console.log('Nodes without "TimestampTime" deleted');
    } else {
      console.log("No nodes found");
    }
  } catch (error) {
    console.error("Error deleting nodes:", error);
  }
};

/* Add Dummy Temp Monitor Data */
// const generateAndInsertData = async () => {
//   try {
//     const dbRef = ref(fbDB, "monitor");

//     // Calculate timestamps for the start and end of the 24-hour period
//     const startTime = new Date("2024-09-10T08:00:00Z").getTime();
//     const endTime = startTime + (24 * 60 * 60 * 1000);

//     // Generate 30 data points with random values within realistic ranges
//     for (let i = 0; i < 30; i++) {
//       const timestamp = startTime + i * 30 * 60 * 1000; // 30 minutes interval
//       const data = {
//         Humidity: Math.random() * 100, // Random humidity between 0 and 100
//         Humidity_Status: Math.random() > 0.8 ? "High" : "Low",
//         Smoke: Math.floor(Math.random() * 10000), // Random smoke value between 0 and 9999
//         Smoke_Status: Math.random() > 0.9 ? "High" : "No Smoke",
//         Temperature: Math.random() * 40 + 15, // Random temperature between 15 and 55
//         Temperature_Status: Math.random() > 0.6 ? "High" : "Low",
//         Timestamp: new Date(timestamp).toLocaleDateString(),
//         TimestampTime: timestamp,
//       };

//       const newRef = push(dbRef);
//       await set(newRef, data);
//     }

//     console.log("Data inserted successfully!");
//   } catch (error) {
//     console.error("Error inserting data:", error);
//   }
// };

/* Telegram */

export const getTelegramCredentials = async () => {
  const docRef = doc(db, "data_read", "telegram_detail");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
};

export const setTelegramCredentials = async (chatId, token) => {
  const docRef = doc(db, "data_read", "telegram_detail");
  return await updateDoc(docRef, {
    CHAT_ID: chatId,
    TOKEN: token,
  });
};
