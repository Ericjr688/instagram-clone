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


  const userEmail = props.userEmail;
  async function getUserFromEmail() {
    var ref = doc(getFirestore(), 'profiles', userEmail)
    console.log('ref', ref)
    const docSnap = await getDoc(ref);
    console.log(docSnap.data())
    // create states for profile data and assign
  }

  getUserFromEmail()

  // finds user information from firebase and displays it
  return (
    <div>ProfileView for {username} </div>
  )
}
