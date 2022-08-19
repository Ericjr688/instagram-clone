import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  getDocs,
  updateDoc,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';

export default function ProfileView() {
  let { userId } = useParams(); // used to access individual profile pages
  const [ profileData, setProfileData ] = useState({});
  const [ currentUserProfileData, setCurrentUserProfileData ] = useState({});
  const [ followed, setFollowed ] = useState('no')


  // this is to get the current active user
  const [ activeUser, setActiveUser ] = useState(getAuth().currentUser);
  useEffect(() => {
    onAuthStateChanged(getAuth(), () => {
      setActiveUser(getAuth().currentUser);
      getProfileDataFromId();
      getCurrentUserFollowing();
    });
  })

  useEffect(() => {
    const followers = profileData.followers
    if (followers && followers.indexOf(activeUser.email) > -1) {
      setFollowed('yes')
    }
  })


  async function getProfileDataFromId(){
    const profilesRef = collection(getFirestore(), 'profiles')
    const q = query(profilesRef, where("id", "==", userId))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      setProfileData({
        id: doc.data().id,
        name: doc.data().name,
        email: doc.data().email,
        profilePicUrl: doc.data().profilePicUrl,
        followers: doc.data().followers, // array of followers
        following: doc.data().following, // array of following
        posts: doc.data().posts,
      })
    }
  )}
  


  const userEmail = profileData.email; // the user email would be the key to get the user information of which the profile belongs to from firebase.

  async function getCurrentUserFollowing() {
    var ref = doc(getFirestore(), 'profiles', activeUser.email)
    const docSnap = await getDoc(ref);
    setCurrentUserProfileData({
      email: docSnap.data().email,
      following: docSnap.data().following, // array of following
    })
  }

  //

  function isCurrentUserProfile() {
    // this is to check if the profile belongs to the current active user
    if (activeUser && userEmail === activeUser.email) {
      return 'true'
    }
  }

  async function handleFollow() {
    // add current profile to target email followers
    try {
      let ref = doc(getFirestore(), 'profiles', userEmail);
      await updateDoc(
        ref, {
          followers: profileData.followers.concat(activeUser.email), // adds the current user's email to the followers email of the target user
        }
      )
      setFollowed('yes')
    }
    catch(error) {
      console.error('Error adding user to followers', error);
    }
    
    // add target email to current profile following
    try {
      let ref = doc(getFirestore(), 'profiles', activeUser.email);
      await updateDoc(
        ref, {
          following: currentUserProfileData.following.concat(userEmail),
        }
      )
    }
    catch(error) {
      console.error('Error adding user to following', error);
    }
  }

  async function handleUnfollow() {
    // remove current profile from target email followers
    try {
      let ref = doc(getFirestore(), 'profiles', userEmail);
      let targetFollowers = [...profileData.followers]
      targetFollowers = targetFollowers.filter((user) => {
        return user !== activeUser.email
      })
      await updateDoc(
        ref, {
          followers: targetFollowers, // removes the current user's email from the followers email of the target user
        }
      )
      setFollowed('no')
    }
    catch(error) {
      console.error('Error adding user to followers', error);
    }

    // remove target email from current profile following
    try {
      let ref = doc(getFirestore(), 'profiles', activeUser.email);
      let currentFollowing = [...currentUserProfileData.following]
      currentFollowing = currentFollowing.filter((user) => {
        return user !== userEmail
      })
      await updateDoc(
        ref, {
          following: currentFollowing,
        }
      )
    }
    catch(error) {
      console.error('Error adding user to following', error);
    }
  }

  const image = new Image();
  image.src = profileData.profilePicUrl


  
  // add a button to follow that is hidden if current user is = to the user of the page. Then update followers for target profile
  // and following for current profile
  return (
    <div className='container profile-view'>
      <div className='header'>
        <img src={profileData.profilePicUrl} alt='profile pic'></img>
        
        <div className='right-side'>
          <div>
            <h6>{profileData.name} </h6>
            { !isCurrentUserProfile() && followed === 'no' ? <button onClick={handleFollow}>Follow</button>: null  }
            { !isCurrentUserProfile() && followed === 'yes' ? <button onClick={handleUnfollow}>Unfollow</button> : null }
          </div>
          
          <div>
            <p> <span>{profileData.posts ? profileData.posts.length : 0}</span> photos</p>
            <p> <span>{profileData.followers ? profileData.followers.length : 0}</span> followers</p>
            <p> <span>{profileData.following ? profileData.following.length : 0}</span> following</p>
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
