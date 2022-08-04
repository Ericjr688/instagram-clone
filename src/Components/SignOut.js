import React from 'react'
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

export default function SignOut() {
  function handleSignOut(){
    signOut(getAuth());
  };

  return (
    <button className='sign-out' onClick={handleSignOut}>
      Sign Out
    </button>
  );
};
