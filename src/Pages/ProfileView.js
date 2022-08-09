import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
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

export default function ProfileView(props) {
  let { username } = useParams(); // used to access individual profile pages
  const [ profileData, setProfileData ] = useState({});

  // this is to get the current active user
  const [ user, setUser ] = useState(getAuth().currentUser);
  useEffect(() => {
    onAuthStateChanged(getAuth(), () => {
      setUser(getAuth().currentUser);
    });
  })
  
  const userEmail = props.userEmail; // the user email would be the key to get the user information of which the profile belongs to from firebase.

  // gets information from firebase and sets state using information
  async function getUserFromEmail() {
    var ref = doc(getFirestore(), 'profiles', userEmail)
    const docSnap = await getDoc(ref);
    setProfileData({
      name: docSnap.data().name,
      email: docSnap.data().email,
      profilePicUrl: docSnap.data().profilePicUrl,
      followers: docSnap.data().followers, // array of followers
      following: docSnap.data().following, // array of following
      photos: docSnap.data().photos,
      posts: docSnap.data().posts,
    })
  }

  function isCurrentUserProfile() {
    // this is to check if the profile belongs to the current active user
    if (user && userEmail === user.email) {
      return 'true'
    }
  }

  
  // use effect?
  getUserFromEmail()

  // add a button to follow that is hidden if current user is = to the user of the page. Then update followers for target profile
  // and following for current profile
  return (
    <div className='container'>
      <div className='header'>
        <img src={profileData.profilePicUrl} alt='profile pic'></img>
        <div className='right-side'>
          <div>
            <h6>{profileData.name} </h6>
            { isCurrentUserProfile() ? null : <button>Follow</button> }
          </div>
          
          <div>
            <p> <span>{profileData.photos}</span> photos</p>
            <p> <span>{profileData.followers}</span> followers</p>
            <p> <span>{profileData.following}</span> following</p>
          </div>
          <p>{profileData.name} </p>
        </div>
      </div>
      {/* create state to select between posts, followers, and following. */}
      <div className='profile-posts'>
        {profileData.posts}
      </div>
    </div>
  )
}
