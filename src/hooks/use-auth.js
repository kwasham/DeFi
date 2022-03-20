import { useContext } from 'react';
import { AuthContext } from '../contexts/web3-context';

export const useAuth = () => useContext(AuthContext);
