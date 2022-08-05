import React, { useState, useEffect } from 'react'
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import dLogo from "../images/default-logo.png"

export default function ProfileIcon() {
  const [ user, setUser ] = useState(getAuth().currentUser);
  useEffect(() => {
    onAuthStateChanged(getAuth(), () => {
      setUser(getAuth().currentUser);
    });
  })
  

  const userLogo = user ? user.photoURL || dLogo : null;

  return (
    <div className='fit-to-nav'>
      { user === null ? null : <img className='profile-image fit-to-nav circle' src={userLogo} alt="user-logo"></img> }
    </div>
  )
}
