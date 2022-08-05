import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

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
import { useCollectionData } from 'react-firebase-hooks/firestore'

export default function ProfileView(props) {
  let { username } = useParams();
  const [ prodileData, setProfileData ] = useState({});


  const userEmail = props.userEmail;
  async function getUserFromEmail() {
    var ref = doc(getFirestore(), 'profiles', userEmail)
    console.log('ref', ref)
    const docSnap = await getDoc(ref);
    console.log(docSnap.data())
    setProfileData({
      name: docSnap.data().name,
      email: docSnap.data().email,
      profilePicUrl: docSnap.data().profilePicUrl,
      followers: docSnap.data().followers,
      following: docSnap.data().following,
      photos: docSnap.data().photos,
      posts: docSnap.data().posts,
    })
  }

  // use effect?
  getUserFromEmail()

  // finds user information from firebase and displays it
  return (
    <div>ProfileView for {username} </div>
  )
}
