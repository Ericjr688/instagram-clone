import React, { useEffect, useState } from 'react'
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import SignIn from './SignIn'
import SignOut from './SignOut';

// if user exists, sign in. Otherwise profile and logout button

export default function Account() {
  const [ user, setUser ] = useState(getAuth().currentUser);

  onAuthStateChanged(getAuth(), () => {
    setUser(getAuth().currentUser);
  });

  return (
    <div>
      { user !== null ?  <SignOut /> : <SignIn />}
    </div> 
  )
}
