import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthDataProvider';

export const PrivateRoute = ({children}) => {
  const { currentUser } = useContext(AuthContext)
  const isLoggedIn = !!currentUser;

  return isLoggedIn ? children : <Navigate to="/auth/login" replace />
}

export default PrivateRoute