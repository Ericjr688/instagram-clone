import React from 'react';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
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
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore'

//sign in redirects to homepage
export default function SignIn() {
  const profilesQuery = query(collection(getFirestore(), 'profiles'));
  const [ profiles ] = useCollectionData(profilesQuery, {idField: 'id'});
  function getName() {
    return getAuth().currentUser.displayName;
  }
  function getEmail() {
    return getAuth().currentUser.email;
  }
  function getPfp() {
    return getAuth().currentUser.photoURL;
  }

  async function handleSignIn(e) {
    e.preventDefault();
    const provider = new GoogleAuthProvider(); 
    try {
      await signInWithPopup(getAuth(), provider);
      if (isProfilePresent() === 0){
        createNewProfileInFirebaseCollection();
      } 
    } catch (error) {
      console.error("The error is", error);
    };
  };

  async function createNewProfileInFirebaseCollection () {
    try {
      await addDoc(collection(getFirestore(), 'profiles'), {
        name: getName(),
        email: getEmail(),
        profilePicUrl: getPfp(),
        followers: 0,
        following: 0,
        photos: 0,
        posts: '',
      }, getEmail());
    }
    catch(error) {
      console.error('Error adding profile to firebase', error);
    }
  }

  function isProfilePresent() {
    let count = 0;
    profiles.forEach((profile) => {
      if (profile.email === getEmail()){
        count++
      }
    })
    return count
  }

  return (
    <button className='sign-in' onClick={handleSignIn}>
      Sign-In With Google
    </button>
  )
}
