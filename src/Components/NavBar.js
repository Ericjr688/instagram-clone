import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Account from './Account'
import ProfileIcon from './ProfileIcon'
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';

export default function NavBar(props) {
  const [ user, setUser ] = useState(getAuth().currentUser);
  useEffect(() => {
    onAuthStateChanged(getAuth(), () => {
      setUser(getAuth().currentUser);
    });
  })

  return (
    <nav className='blue-grey darken-3 blue-grey-text text-lighten-5'>
      <div className='nav-wrapper container'>
        <Link className='brand-logo left large-font-size' to='/'>Owuragram</Link>
        <ul id="nav-mobile" className="right">
          <li><Link to='/'><i className='material-icons'>home</i></Link></li>
          <li><Link to='upload-post'><i className='material-icons'>upload</i></Link></li>
          <li><Link to={'/profile/'+user.displayName.replace( /\s/g, '')}><ProfileIcon/></Link></li>
          <li><Account /></li>
        </ul>
      </div>
    </nav>
  )
}
