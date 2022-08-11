import React, { useState, useEffect } from 'react'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from 'firebase/storage';
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
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import { v4 } from 'uuid'; // random strings
import dLogo from "../images/default-logo.png"


// create a post document by putting information of post in an object and uploading it to firebase. Create posts by
// using info from database to create Post components in home page.

export default function UploadPost() {
  // this is to get the current active user
  const user = getAuth().currentUser;


  const storage = getStorage();
  const [ imageUpload, setImageUpload ] = useState()
  const [ image, setImage ] = useState()
  const [ description, setDescription ] = useState();
  const [ currentStep, setCurrentStep ] = useState('post-upload') // this would determine which step of the image upload process would be shown at a given time


  function getName() {
    return user.displayName;
  }
  function getEmail() {
    return user.email;
  }
  function getPfp() {
    return user.photoURL;
  }

  let directory = ''; // called outside function so we can have access to it when uploading it to firestore
  async function uploadImage() {
    if (imageUpload == null) return;
    directory = `images/${imageUpload.name + v4()}`;
    const imageRef = ref(storage, directory)
    try {
      await uploadBytes(imageRef, imageUpload)
      alert('image uploaded')
    } catch(error) {
      alert('Error is ', error)
    }
  }

  async function createNewPostInFirebaseCollection () {
    try {
      let ref = doc(getFirestore(), 'posts', v4());
      const docRef = await setDoc(
        ref, {
          name: getName(),
          email: getEmail(),
          profilePicUrl: getPfp(),
          picDirectory: directory,
          likes: 0,
          timestamp: serverTimestamp(),
          description: description,
          comments: [],
        }
      )
    }
    catch(error) {
      console.error('Error adding post to firebase', error);
    }
  }
  // create function to upload description. join both in an upload post function that would upload everything we need

  function backClickHandler() {
    setCurrentStep('post-upload');
  }

  async function uploadPost() {
    await uploadImage();
    await createNewPostInFirebaseCollection();
  }

  // fires some sort of request on every change so it doesn't breaks focus with input on change for some reason
  function handleDescriptionChange(event) {
    setDescription(event.target.value)
  }
  const userName = user.displayName;
  const userLogo = user.photoURL || dLogo;

  function PostPreview () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col s12 m6 l6'>
            <div className='post-preview card large'>
              <div className='card-title'>
                <img className='profile-image post-profile-img circle' src={userLogo} alt="user-logo"></img>
                <span>{userName}</span>
              </div>
              <div className='card-image'>
                <img src={image} alt='preview' className='responsive-image'></img>
              </div>
              <div className='card-content'>
                <input placeholder='Add description' id='upload-post-description' type='text' value = {description} onChange = {handleDescriptionChange} ></input>
              </div>
            </div>
          </div>  
        </div>
        <div className='row'>
          <button id='upload-post-back' type='button' onClick={backClickHandler}> Back </button>
          <button id='upload' onClick={uploadPost} type= 'button'>Post </button>
        </div>
        
      </div>
    )
  }

  function PostUpload() {
    return (
      <div>
        <input type='file' onChange = {(event) => {
          setImageUpload(event.target.files[0])
          setImage(URL.createObjectURL(event.target.files[0]))
          setCurrentStep('post-preview')
          }} />
      </div>
    )
  }

  return (
    <div>
      { currentStep === 'post-upload' ? <PostUpload /> : <PostPreview /> }
    </div>
  )
}
