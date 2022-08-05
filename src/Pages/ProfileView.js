import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';

export default function ProfileView(props) {
  let { username } = useParams();
  const [ profile, setProfile ] = useState({});

  return (
    <div>ProfileView for {username} </div>
  )
}
