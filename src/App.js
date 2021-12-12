import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


function App() {
  const[posts, setPosts] = useState([]);
  const[open, setOpen] = useState(false);
  const[openSignIn, setOpenSignIn] = useState(false);
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const[email, setEmail] = useState('');
  const[user, setUser] = useState(null);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if (authUser){
        console.log(authUser);
        setUser(authUser);
      }else{
        setUser(null);
       }
      })
      return () => {
        unsubscribe();
      }
    }, [user, username]);


    useEffect(() => {

      db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })));
      })

    },[]);

    const signUp = (event) =>{
      event.preventDefault();

      auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))

      setOpen(false);
    }

    const signIn = (event) => {
      event.preventDefault();

      auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

      setOpenSignIn(false);

    }

  return (
    <div className="App">
     

           <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="app__signup">
         <Input
         placeholder="username"
         type="text"
         value={username}
         onChange={(e)=> setUsername(e.target.value)}
         />
         <Input
         placeholder="email"
         type="text"
         value={email}
         onChange={(e)=> setEmail(e.target.value)}
         />
         <Input
         placeholder="password"
         type="text"
         value={password}
         onChange={(e)=> setPassword(e.target.value)}
         />


         <Button type="submit" onClick={signUp}>SignUp</Button>
         </form>
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="app__signup">
         <Input
         placeholder="email"
         type="text"
         value={email}
         onChange={(e)=> setEmail(e.target.value)}
         />
         <Input
         placeholder="password"
         type="text"
         value={password}
         onChange={(e)=> setPassword(e.target.value)}
         />


         <Button type="submit" onClick={signIn}>SignIn</Button>
         </form>
        </Box>
      </Modal>
      
    <div className="app__header">
      <img 
      className="app__headerImage"
      src="https://knockknockwhoisthere.files.wordpress.com/2018/03/dotblog.png"
      alt=""
      />
    

    {user ? (
      <Button onClick={() => auth.signOut()}>Logout</Button>
    ): (
    <div className="app__loginContainer">
    <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
    <Button onClick={() => setOpen(true)}>Sign Up</Button>
    </div>
    )}
    
    </div>
    {user?.displayName ? ( 
        <ImageUpload username={user.displayName} />
      ): (
        <h3>Sorry you need to login to upload </h3>
      )}
    <h1>Welcome to Ucode blog 😁</h1>
    
    {
      posts.map(({id, post}) => (
        <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
      ))
    }

    </div>
  );
}

export default App;
