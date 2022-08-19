import React from 'react'
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function SignOut() {
  let navigate = useNavigate();

  function handleSignOut(){
    navigate('/')
    signOut(getAuth());
  };

  return (
    <button className='sign-out' onClick={handleSignOut}>
      Sign Out
    </button>
  );
};
