import { useState, useEffect, createContext } from "react";
import { auth } from "../firebase/firebaseConfig";

export const AuthContext = createContext({
	currentUser: {},
	setCurrentUser: () => {},

	dbUser: {},
	setDbUser: () => {},

	isNewUser: {},
	setIsNewUser: () => {},
});

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState({});
	const [dbUser, setDbUser] = useState({});
	const [loading, setLoading] = useState(false);
	const [isNewUser, setIsNewUser] = useState(false);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (isNewUser) {
				setCurrentUser(user);
				localStorage.setItem("userInfo", JSON.stringify(user));
				setLoading(false);  
			}
		});

		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				setCurrentUser,

				dbUser,
				setDbUser,

				isNewUser,
				setIsNewUser,

				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
