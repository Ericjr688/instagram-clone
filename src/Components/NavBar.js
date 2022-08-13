import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Account from './Account'
import ProfileIcon from './ProfileIcon'
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

export default function NavBar() {
  const [ user, setUser ] = useState(getAuth().currentUser);
  const [ userId, setUserId ] = useState();
  useEffect(() => {
    onAuthStateChanged(getAuth(), () => {
      setUser(getAuth().currentUser);
    });
  })

  async function getUserId() {
    var ref = doc(getFirestore(), 'profiles', user.email)
    const docSnap = await getDoc(ref);
    setUserId(docSnap.data().id)
  }

  getUserId();

  return (
    <nav className='white black-text '>
      <div className='nav-wrapper container black-text'>
        <Link className='brand-logo left large-font-size black-text' to='/'>Owuragram</Link>
        <ul id="nav-mobile" className="right">
          <li><Link to='/'><i className='material-icons black-text'>home</i></Link></li>
          <li><Link to='upload-post'><i className='material-icons black-text'>upload</i></Link></li>
          <li><Link to={'/profile/'+userId}><ProfileIcon/></Link></li>
          <li><Account /></li>
        </ul>
      </div>
    </nav>
  )
}
