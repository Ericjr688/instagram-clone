import React, { useState, useEffect } from 'react'
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import dLogo from "../images/default-logo.png"

export default function ProfileIcon() {
  const [ user, setUser ] = useState(getAuth().currentUser);
  const [ userLogo, setUserLogo ] = useState()
  useEffect(() => {
    onAuthStateChanged(getAuth(), () => {
      setUser(getAuth().currentUser);
      getProfilePic();
    });
  })

  function getProfilePic() {
    setUserLogo(user.photoURL || dLogo)
  }

  

  return (
    <div className='fit-to-nav'>
      { user === null ? null : <img className='profile-image fit-to-nav circle black-text' src={userLogo} alt="user-logo"></img> }
    </div>
  )
}
