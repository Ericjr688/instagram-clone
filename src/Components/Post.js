import React, {useState, useEffect} from 'react'
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
  getDocs,
  updateDoc,
  where,
  doc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


// set loading

export default function Post(props) {
  const [ postPic, setPostPic ] = useState();
  const [ isLiked, setIsLiked ] = useState('favorite_border');
  const [ profileId, setProfileId ] = useState();
  const storage= getStorage();

  useEffect(() => {
    getProfileIdFromEmail()
  }, [])
  let navigate = useNavigate();


  async function getPostImageUrl() {
    try {
      let result = await getDownloadURL(ref(storage, props.postData.picDirectory))
      setPostPic(result)
    } catch (error) {
      console.error('Following error with downloading post url: ', error)
    }
  }

  async function getProfileIdFromEmail(){
    const profilesRef = collection(getFirestore(), 'profiles')
    const q = query(profilesRef, where("email", "==", props.postData.email))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      setProfileId(doc.data().id)
  })}

  function navigateToProfile() {
    navigate(`/profile/${profileId}`)
  }

  getPostImageUrl();
  return (
    <div className='col s12 m9 l9 z-depth-2 post'>
      <div className='post-header'>
        <img src={props.postData.profilePicUrl} alt='profile pic' className='circle post-pfp' onClick={navigateToProfile}></img>
        <span onClick={navigateToProfile}>{props.postData.name}</span>
      </div>
      <div className='post-image'>
        <img src={postPic} alt='post pic' className='responsive-img'></img>
      </div>
      <div className='post-content'>
        <div className='like-button-container'>
          <i className='material-icons red-text like-button'>{isLiked}</i>
          <i className='material-icons black-text comment-button'>comment</i>
        </div>
        <div className='likes'> {props.postData.likes} likes</div>
      </div>
      <div className='post-add-comment'>
        {props.postData.description}
      </div>
    </div> 
  )
}

