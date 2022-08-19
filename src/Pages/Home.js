import React, { useState, useEffect } from 'react'
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
  QuerySnapshot,
  getDocs,
} from 'firebase/firestore';
import Post from '../Components/Post';


// access data base from here and pass the info to the post component using a prop much like the shopping cart situation
export default function Home() {
  const [ posts, setPosts ] = useState([])
  useEffect(() => {
    loadPosts();
  },[])

  async function loadPosts() {
    // Create the query to load the last 12 posts and listen for new ones.
    const recentPostsQuery = query(collection(getFirestore(), 'posts'), orderBy('timestamp', 'desc'), limit(12));
    const querySnapshot = await getDocs(recentPostsQuery)

    querySnapshot.forEach((doc) => {
      var post = {}
        post.id = doc.id;
        setPosts((prev) => [...prev, post]);
    })
    console.log(posts)
  }
  

  return (
    <div className='container home-page'>
      {posts.map((post, id) => (
          <div className='row' key={id}>
            <Post postData={post} key={id}/ >
          </div>
          ))}
    </div>

  )
}
