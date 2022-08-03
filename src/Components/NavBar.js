import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar(props) {
  return (
    <nav className='blue-grey darken-3 blue-grey-text text-lighten-5'>
      <div className='nav-wrapper container'>
        <Link className='brand-logo left large-font-size' to='/'>Owuragram</Link>
        <ul id="nav-mobile" className="right">
          <li><Link to='/'>Home</Link></li>
        </ul>
      </div>
    </nav>
  )
}
