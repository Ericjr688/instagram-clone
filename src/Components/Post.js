import React, {useState} from 'react'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from 'firebase/storage';

export default function Post(props) {
  const [ postPic, setPostPic ] = useState();
  const storage= getStorage();

  async function getPostImageUrl() {
    try {
      let result = await getDownloadURL(ref(storage, props.postData.picDirectory))
      setPostPic(result)
    } catch (error) {
      console.error('Following error with downloading post url: ', error)
    }
  }

  getPostImageUrl();
  return (
    <div className='post'>
      <div className='post-header'>
        <img src={props.postData.profilePicUrl} alt='profile pic'></img>
        <span>{props.postData.name}</span>
      </div>
      <div className='post-image'>
        <img src={postPic} alt='post pic' className='responsive-img'></img>
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

