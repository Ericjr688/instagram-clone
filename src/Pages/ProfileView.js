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
  getDocs,
  updateDoc,
  where,
  doc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

export default function ProfileView(props) {
  let { userId } = useParams(); // used to access individual profile pages
  const [ profileData, setProfileData ] = useState({});
  const [ currentUserProfileData, setCurrentUserProfileData ] = useState({});
  const [ followed, setFollowed ] = useState('no')

  
    

  // this is to get the current active user
  const [ activeUser, setActiveUser ] = useState(getAuth().currentUser);
  useEffect(() => {
    onAuthStateChanged(getAuth(), () => {
      setActiveUser(getAuth().currentUser);
      // getUserFromEmail();
      getProfileDataFromId();
      getCurrentUserFollowing();
    });
  }, [])


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
  })}

  

  const userEmail = profileData.email; // the user email would be the key to get the user information of which the profile belongs to from firebase.

  // use the id to access the email and assign it to userEmail

  // gets information from firebase and sets state using information
  // async function getUserFromEmail() {
  //   var ref = doc(getFirestore(), 'profiles', userEmail)
  //   const docSnap = await getDoc(ref);
  //   setProfileData({
  //     id: docSnap.data().id,
  //     name: docSnap.data().name,
  //     email: docSnap.data().email,
  //     profilePicUrl: docSnap.data().profilePicUrl,
  //     followers: docSnap.data().followers, // array of followers
  //     following: docSnap.data().following, // array of following
  //     posts: docSnap.data().posts,
  //   })
  // }

  async function getCurrentUserFollowing() {
    var ref = doc(getFirestore(), 'profiles', activeUser.email)
    const docSnap = await getDoc(ref);
    setCurrentUserProfileData({
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

  async function increaseFollowers() {
    // add current profile to target email followers
    try {
      let ref = doc(getFirestore(), 'profiles', userEmail);
      await updateDoc(
        ref, {
          followers: profileData.followers.concat(activeUser.email), // adds the current user's email to the followers email of the target user
        }
      )
      setFollowed('Unfollow')
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


  // add a button to follow that is hidden if current user is = to the user of the page. Then update followers for target profile
  // and following for current profile
  return (
    <div className='container profile-view'>
      <div className='header'>
        <img src={profileData.profilePicUrl} alt='profile pic'></img>
        <div className='right-side'>
          <div>
            <h6>{profileData.name} </h6>
            { !isCurrentUserProfile() && followed === 'no' ? <button onClick={increaseFollowers}>Follow</button>: null  }
            { !isCurrentUserProfile() && followed === 'yes' ? <button>Unollow</button> : null }
          </div>
          
          <div>
            {/* <p> <span>{profileData.posts.length}</span> photos</p> */}
            {/* <p> <span>{profileData.followers.length}</span> followers</p>
            <p> <span>{profileData.following.length}</span> following</p> */}
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
