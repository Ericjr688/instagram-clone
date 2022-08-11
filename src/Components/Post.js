import React from 'react'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from 'firebase/storage';

export default function Post(props) {
  const storage= getStorage();

  async function getPostImageUrl() {
    let url = await getDownloadURL(ref(storage, props.postData.picDirectory))
    return url;
  }

  const postPicUrl = getPostImageUrl();

  return (
    <div className='post'>
      <div className='post-header'>
        <img src={props.postData.profilePicUrl} alt='profile pic'></img>
        <span>{props.postData.name}</span>
      </div>
      <div className='post-image'>
      <img src={postPicUrl} alt='post pic'></img>
      </div>
      <div className='post-content'>
        <div className='likes'> {props.postData.likes} likes</div>
      </div>
      <div className='post-add-comment'>
        {props.postData.description}
      </div>
    </div>
  )
}

