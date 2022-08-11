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
} from 'firebase/firestore';
import Post from '../Components/Post';


// access data base from here and pass the info to the post component using a prop much like the shopping cart situation
export default function Home() {
  const [ posts, setPosts ] = useState([])
  useEffect(() => {
    loadPosts();
  }, [])

  function loadPosts() {
    // Create the query to load the last 12 posts and listen for new ones.
    const recentPostsQuery = query(collection(getFirestore(), 'posts'), orderBy('timestamp', 'desc'), limit(12));
    onSnapshot(recentPostsQuery, function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        if (change.type === 'removed') {
          return // supoosed to delete
        } else {
          var post = change.doc.data();
          setPosts((prev) => [...prev, post]);
        }
      });
    });
  }

  return (
    <div className='container'>
      {posts.map((post, index) => (
            <Post postData={post} key={Math.random() *100}/>
          ))}
    </div>

  )
}
