import React from 'react';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export default function SignIn() {
  async function handleSignIn(e) {
    e.preventDefault();
    const provider = new GoogleAuthProvider(); 
    try {
      await signInWithPopup(getAuth(), provider);
    } catch (error) {
      console.error("The error is", error);
    };
  };
  
  return (
    <button className='sign-in' onClick={handleSignIn}>
      Sign-In With Google
    </button>
  )
}
