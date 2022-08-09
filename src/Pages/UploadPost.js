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
import { v4 } from 'uuid'; // random strings

// create a post document by putting information of post in an object and uploading it to firebase. Create posts by
// using info from database to create Post components in home page.

export default function UploadPost() {
  const storage = getStorage();
  const [ imageUpload, setImageUpload ] = useState()
  const [ image, setImage ] = useState()
  const [ currentStep, setCurrentStep ] =useState('post-upload') // this would determine which step of the image upload process would be shown at a given time

  async function uploadImage() {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`)
    try {
      await uploadBytes(imageRef, imageUpload)
      alert('image uploaded')
    } catch(error) {
      alert('Error is ', error)
    }
  }
  // create function to upload comment. join both in an upload post function that would upload everything we need

  function backClickHandler() {
    setCurrentStep('post-upload');
  }

  function PostPreview () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col s12 m6 l6'>
            <div className='post-preview card large'>
              <div className='card-title'>
                Profile
              </div>
              <div className='card-image'>
                <img src={image} alt='preview' className='responsive-image'></img>
              </div>
              <div className='card-content'>
                <input placeholder='Add Comment' id='upload-post-comment'></input>
              </div>
            </div>
          </div>  
        </div>
        <div className='row'>
          <button id='upload-post-back' type='button' onClick={backClickHandler}> Back </button>
          <button id='upload' onClick={uploadImage} type= 'button'>Upload Post </button>
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
