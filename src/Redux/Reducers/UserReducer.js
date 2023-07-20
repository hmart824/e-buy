import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword , 
    updateProfile , 
    onAuthStateChanged , 
    signOut, 
    GoogleAuthProvider, 
    signInWithPopup } from "firebase/auth";
import { setDoc , doc } from 'firebase/firestore';
import db , { auth } from "../../Firbase/Firebase";
import { toast } from "react-toastify";

const initialState = {
    user: null,
    loading: false
};

export const signUpWithEmailAndPassword = createAsyncThunk(
    'user/signUpWithEmailAndPassword',
    async (data) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  
        console.log('signed up successfully!!');
  
        await updateProfile(userCredential.user, {
          displayName: data.name,
        });
  
        const currentUser = {
          displayName: userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          userId: userCredential.user.uid,
          password: data.password,
        };
  
        const userDocRef = doc(db, 'users', currentUser.email);
        await setDoc(userDocRef, currentUser);
  
        return currentUser;
      } catch (error) {
        toast.error('Invalid Credentials!!');
        throw error;
      }
    }
  );

export const signInWithGoogle = createAsyncThunk(
    'user/signInWithGoogle',
    async () => {
      try {
        const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
  
        const currentUser = {
          displayName: userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          userId: userCredential.user.uid,
        };
  
        const userDocRef = doc(db, 'users', currentUser.email);
        await setDoc(userDocRef, currentUser);
  
        return currentUser;
      } catch (error) {
        const errorMessage = error.message;
        toast.error('Invalid Credentials!!');
        throw error;
      }
    }
  );

  
export const signIn = createAsyncThunk(
    'user/signIn',
    async (data) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
  
        const currentUser = {
          displayName: userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          userId: userCredential.user.uid,
        };
  
        return currentUser;
      } catch (error) {
        toast.error('Invalid Credentials!!');
        throw error;
      }
    }
  );
  
export const authentication = createAsyncThunk(
    'user/authentication',
    async () => {
      try {
        const currentUser = await new Promise((resolve, reject) => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              const currentUser = {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                userId: user.uid,
              };
              resolve(currentUser);
            } else {
              resolve(null);
            }
          });
        });
  
        return currentUser;
      } catch (error) {
        throw error;
      }
    }
  );
  
export const signout = createAsyncThunk(
    'user/signout',
    async () => {
      try {
        await signOut(auth);
        return null;
      } catch (error) {
        alert(error.message);
        throw error;
      }
    }
  );

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) =>[
        builder.addCase(signUpWithEmailAndPassword.pending , (state , action)=>{
            state.loading = true;
        })
        .addCase(signUpWithEmailAndPassword.fulfilled , (state , action)=>{
            state.user = action.payload;
            state.loading = false;
        })
        .addCase(signUpWithEmailAndPassword.rejected , (state , action)=>{
            state.loading = false;
            //TODO do something
        })
        .addCase(signInWithGoogle.pending , (state , action)=>{
            state.loading = true;
        })
        .addCase(signInWithGoogle.fulfilled , (state , action)=>{
            state.user = action.payload;
            state.loading = false;
        })
        .addCase(signInWithGoogle.rejected , (state , action)=>{
            state.loading = false;
            //TODO do something
        })
        .addCase(signIn.pending , (state , action)=>{
            state.loading = true;
        })
        .addCase(signIn.fulfilled , (state , action)=>{
            state.user = action.payload;
            state.loading = false;
        })
        .addCase(signIn.rejected , (state , action)=>{
            state.loading = false;
            //TODO do something
        })
        .addCase(authentication.pending , (state , action)=>{
            state.loading = true;
        })
        .addCase(authentication.fulfilled , (state , action)=>{
            state.user = action.payload;
            state.loading = false;
        })
        .addCase(authentication.rejected , (state , action)=>{
            state.loading = false;
            //TODO do something
        })
        .addCase(signout.fulfilled , (state , action)=>{
            state.user = action.payload;
        })
    ]
});

export const userReducer = userSlice.reducer;

//selector
export const userSelector = (state)=> state.userReducer;