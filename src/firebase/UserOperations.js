import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	updateEmail,
} from "firebase/auth";
import { auth, fbDB } from "./firebaseConfig";
import {
	ref,
	push,
	set,
	get,
	child,
	orderByChild,
	equalTo,
	query,
	update,
	limitToFirst,
} from "firebase/database";

export const signInUser = (email, password) => {
	return signInWithEmailAndPassword(auth, email, password);
};

/* CRUD operations */

/* Add User */
export const addUser = async (displayName, email, password, role) => {

	return createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed up
			const user = userCredential.user;

			updateProfile(user, {
				displayName,
				role: role,
			})
				.then(() => {
					const usersRef = ref(fbDB, "users");
					const newUsersRef = push(usersRef);
					set(newUsersRef, {
						uid: user.uid,
						email: user.email,
						displayName,
						role,
					});
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					console.log(errorCode, errorMessage);
					return false;
				});
			return true;
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			if (errorCode === "auth/email-already-in-use") {
				alert("Email address is already in use");
			} else {
				console.log(errorCode, errorMessage);
			}
			return false;
		});
};

export const getUserByUid = async (email) => {
	try {
		const dbRef = ref(fbDB, "users/");
		const snapshot = await get(
			query(dbRef, orderByChild("email"), equalTo(email))
		);

		if (snapshot.exists()) {
			const users = snapshot.val();
			const user = Object.values(users)[0];
			return user;
		} else {
			console.log("User not found");
			return null;
		}
	} catch (error) {
		console.error("Error fetching user:", error);
		throw error;
	}
};

/*  Get Users */

export const listAllUsers = async () => {
	try {
		const dbRef = ref(fbDB, "users");
		const snapshot = await get(dbRef);

		if (snapshot.exists()) {
			const usersData = Object.values(snapshot.val());
			console.log(usersData);
			return usersData;
		} else {
			console.log("No users found.");
			return [];
		}
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};

/*  Get Limited No. of Users */

export const listFirstUsers = async () => {
	try {
		const dbRef = ref(fbDB, "users");
		const listLimitedUsersRef = query(dbRef, limitToFirst(5));
		const snapshot = await get(listLimitedUsersRef);

		if (snapshot.exists()) {
			const usersData = Object.values(snapshot.val());
			console.log(usersData);
			return usersData;
		} else {
			console.log("No users found.");
			return [];
		}
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};

// export const updateCurrentUserProfile = async (currentUser) => {
//   try {
//     await updateProfile(currentUser, {
//       displayName: currentUser.displayName,
//     });

//     const dbRef = ref(fbDB, 'users');
//     const userRef = child(dbRef, orderByChild("uid"), equalTo(currentUser.uid));

//     await update(userRef, {
//       displayName: currentUser.displayName
//     })

//     console.log("User profile updated successfully");

//     return true; // Indicate success
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     return false; // Indicate failure
//   }
// };

export const updateCurrentUserProfile = async (
	currentUser,
	fullname,
	email
) => {
	/* Update in Realtime DB */
	try {
		const dbRef = ref(fbDB, "users");
		const snapshot = await get(
			query(dbRef, orderByChild("uid"), equalTo(currentUser.uid))
		);

		if (snapshot.exists()) {
			const users = snapshot.val();
			const userKey = Object.keys(users)[0]; // Get the key of the first matching user

			const userRef = child(dbRef, userKey);

			await update(
				userRef,
				{
					displayName: fullname,
				},
				{
					merge: true,
				}
			);

			console.log(
				"User display name updated successfully in Realtime DB"
			);
		} else {
			console.log("User not found");
		}
	} catch (error) {
		console.error("Error updating user display name:", error);
	}

	try {
		/* Update in Firebase Auth */
		await updateEmail(currentUser, email)
			.then(() => {
				updateProfile(currentUser, {
					displayName: fullname,
				});
			})
			.catch((error) => {
				console.error("Error updating user Email:", error);
				return false; // Indicate failure
			});
	} catch (error) {
		console.error("Error updating user profile:", error);
		return false; // Indicate failure
	}
};

// try {
//   // await updateProfile(currentUser, {
//   //   displayName: currentUser.displayName,
//   // });
//   console.log(currentUser, fullname)

//   const dbRef = ref(fbDB, 'users');
//   const userRef = child(dbRef, currentUser.uid);

//   await update(userRef, {
//     displayName: fullname
//   }, {
//     merge: true
//   })

//   console.log("User profile updated successfully");

//   // return true; // Indicate success
// } catch (error) {
//   console.error("Error updating user profile:", error);
//   // return false; // Indicate failure
// }

export const updateCurrentUserPassword = async () => {};
