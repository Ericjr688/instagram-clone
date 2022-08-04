import React from 'react'
import { Link } from 'react-router-dom'
import Account from './Account'
// import firebase from '../firebase'

export default function NavBar(props) {

  return (
    <nav className='blue-grey darken-3 blue-grey-text text-lighten-5'>
      <div className='nav-wrapper container'>
        <Link className='brand-logo left large-font-size' to='/'>Owuragram</Link>
        <ul id="nav-mobile" className="right">
          <li><Link to='/'>Home</Link></li>
          <li><Account /></li>
        </ul>
      </div>
    </nav>
  )
}
