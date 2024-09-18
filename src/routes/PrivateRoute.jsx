import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthDataProvider';

export const PrivateRoute = ({children}) => {
  const { currentUser } = useContext(AuthContext)
  // const [isLoggedIn, setIsLoggedIn]= useState(false)
  // console.log(Object.keys(currentUser).length === 0 && currentUser.constructor === Object)
  const isLoggedIn = !!currentUser;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const userdata = await getUserByUid()
  //     console.log(userdata)
  //     if(userdata.role === 'admin')
  //       setIsLoggedIn(true)
  //   };

  //   fetchData();
  // }, [])

  return isLoggedIn ? children : <Navigate to="/auth/login" replace />;
}

export default PrivateRoute