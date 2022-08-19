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
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';


// set loading

export default function Post(props) {
  const [ postPic, setPostPic ] = useState();
  const [ isLiked, setIsLiked ] = useState('no');
  const [ profileId, setProfileId ] = useState();
  const [ activeUser, setActiveUser ] = useState(getAuth().currentUser);
  const [ likes, setLikes ] = useState([])
  const [ postData, setPostData ] = useState({})
  const storage = getStorage();

  

  useEffect(() => {
    onAuthStateChanged(getAuth(), () => {
      setActiveUser(getAuth().currentUser);
      getProfileIdFromEmail();
    });
  })

  useEffect(() => {
    getLivePostData();
  }, [])

  useEffect(() => {
    // getLivePostData();
    // updateFirebaseLike();
  }, [isLiked])

  useEffect(() => {
    if (likes && likes.indexOf(activeUser.email) > -1) {
      setIsLiked('yes')
    }
  })

  let navigate = useNavigate();


  async function getPostImageUrl() {
    try {
      if (!postData.picDirectory) return
      let result = await getDownloadURL(ref(storage, postData.picDirectory))
      setPostPic(result)
    } catch (error) {
      console.error('Following error with downloading post url: ', error)
    }
  }

  // live post data needed for likes and comments
  async function getLivePostData() {
    var ref = doc(getFirestore(), 'posts', props.postData.id)
    const docSnap = await getDoc(ref);
    setLikes(docSnap.data().likes)
    setPostData({
      name: docSnap.data().name,
      profilePicUrl: docSnap.data().profilePicUrl,
      email: docSnap.data().email,
      description: docSnap.data().description,
      timestamp: docSnap.data().timestamp,
      picDirectory: docSnap.data().picDirectory,
    })
  }

  async function getProfileIdFromEmail(){
    if (!postData.email) return
    const profilesRef = collection(getFirestore(), 'profiles')
    const q = query(profilesRef, where("email", "==", postData.email))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      setProfileId(doc.data().id)
  })}

  function navigateToProfile() {
    navigate(`/profile/${profileId}`)
  }

  async function handleLike() {
    // add current profile to target email likes and set liked to yes
    let tempLikes = [...likes].concat(activeUser.email)
    setLikes(tempLikes)
    updateFirebaseLike(tempLikes)
    setIsLiked('yes')
  }

  async function handleUnlike() {
    // add current profile to target email likes and set liked to yes
    let tempLikes = [...likes]
    tempLikes = tempLikes.filter((user) => {
      return user !== activeUser.email
    })
    setLikes(tempLikes)
    setIsLiked('no')
    updateFirebaseLike(tempLikes)
  } 

  async function updateFirebaseLike (tempLikes) {
    try {
      let ref = doc(getFirestore(), 'posts', props.postData.id);
      if (props.postData.id === 'd3196dd2-c6de-4082-b589-d75f861b5a13') console.log(likes)
      // let tempLikes = [...likes]
      await updateDoc(
        ref, {
          // likes: [...likes].concat(activeUser.email), // adds the current user's email to the followers email of the target user
          likes: tempLikes
        }
      )
    }
    catch(error) {
      console.error('Error liking post', error);
    }
  }

  // async function updateFirebaseUnlike() {
  //   try {
  //     let ref = doc(getFirestore(), 'posts', props.postData.id);
  //     // let tempLikes = [...likes]
  //     // tempLikes = tempLikes.filter((user) => {
  //     //   return user !== activeUser.email
  //     // })
  //     await updateDoc(
  //       ref, {
  //         // likes: tempLikes, // adds the current user's email to the followers email of the target user
  //       }
  //     )
  //   }
  //   catch(error) {
  //     console.error('Error unliking post', error);
  //   }
  // }

  getPostImageUrl();
  return (
    <div className='col s12 m9 l9 z-depth-2 post'>
      <div className='post-header'>
        <img src={postData.profilePicUrl} alt='profile pic' className='circle post-pfp' onClick={navigateToProfile}></img>
        <span onClick={navigateToProfile}>{postData.name}</span>
      </div>
      <div className='post-image'>
        <img src={postPic} alt='post pic' className='responsive-img'></img>
      </div>
      <div className='post-content'>
        <div className='like-button-container'>
          {  isLiked === 'no' ? <i className='material-icons black-text like-button' onClick={handleLike}>favorite_border</i>: null  }
          {  isLiked === 'yes' ? <i className='material-icons red-text like-button' onClick={handleUnlike}>favorite</i>: null  }
          <i className='material-icons black-text comment-button'>comment</i>
        </div>
        <div className='likes'> <span>{likes ? likes.length : 0}</span> likes</div>
      </div>
      <div className='post-add-comment'>
        {postData.description}
      </div>
    </div> 
  )
}

