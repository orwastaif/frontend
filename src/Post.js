import React, {useState, useEffect} from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import { db} from './firebase';
import firebase from "firebase/compat";

function Post({ postId, user, username, caption, imageUrl}) {
const [comments, setComments] = useState([]); 
const [comment, setComment] = useState('');
const [likes, setLikes] = useState([]); 
const [like, setLike] = useState('');




   useEffect(() => {
       let unsubscribe;
       if (postId) {
           unsubscribe = db
             .collection("posts")
             .doc(postId)
             .collection("comments")
             .orderBy('timestamp', 'desc')
             .onSnapshot((snapshot) => {
                 setComments(snapshot.docs.map((doc) => doc.data()));
             });
       }
       return () => {
           unsubscribe();
       }
   }, [postId]);

   useEffect(() => {
    let unsubscribe;
    if (postId) {
        unsubscribe = db
          .collection("posts")
          .doc(postId)
          .collection("likes")
          .onSnapshot((snapshot) => {
              setComments(snapshot.docs.map((doc) => doc.data()));
          });
    }
    return () => {
        unsubscribe();
    }
}, [postId]);

  

   const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
   }

   const likePost = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("likes").add({
        count: like,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setLike('');
   }

   return (
        <div className="post">
            <div className="post__header">
            <Avatar
            className="post__Avatar"
            alt="orwa"
            src="/static/images/avatar/1.png"
            />
          <h3>{username}</h3>
            </div>
        <img  className="post__image" src={imageUrl} alt=""/>

        <h4 className="post__text"><strong>{username}  </strong>{caption} </h4>

        <div className="post__comments">
            {comments.map((comment) => (
                <p>
                    <strong>{comment.username}</strong> {comment.text}
                </p>
            ))}
        </div>
        {user && (
            <form className="post__commentbox">
            <input
                className="post__input"
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            
            />
            <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
            >
                Post
            </button>
        </form>
        )}
        <button onClick={likePost} type="submit">like</button>
        </div>
    )
}

export default Post
