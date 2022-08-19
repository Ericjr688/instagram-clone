import React, { useState } from 'react'
import {
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import {
  getFirestore,
  setDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getAuth,
} from 'firebase/auth';
import { v4 } from 'uuid'; // random strings
import dLogo from "../images/default-logo.png"


// crop feature to select part of the photo to show and control sizes

export default function UploadPost() {
  // this is to get the current active user
  const user = getAuth().currentUser;


  const storage = getStorage();
  const [ imageUpload, setImageUpload ] = useState()
  const [ image, setImage ] = useState()
  const [ description, setDescription ] = useState('');
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
          likes: [],
          timestamp: serverTimestamp(),
          description: description || '',
          comments: [],
        }
      )
    }
    // name of photo is docRef.id
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
                <form>
                  <input placeholder='Add description' id='upload-post-description' type='text' autoFocus onChange={e => setDescription(e.target.value)} value={description} ></input>
                </form>
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
    <div className='container upload-post'>
      { currentStep === 'post-upload' ? <PostUpload /> : <PostPreview /> }
    </div>
  )
}
