import React, { useState , useEffect} from 'react';
import Style from './Login.module.css';
import { onChangeHandler , clearInputs } from '../../Utils/util_functions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector , signInWithGoogle , signUpWithEmailAndPassword } from '../../Redux/Reducers/UserReducer';

const SignUp = () => {
    const navigate = useNavigate();
    const {user} = useSelector(userSelector);
    const dispatch = useDispatch();
    const [signUpData, setSignUpData] = useState({});

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(signUpData.password !== signUpData.confirm_password){
            toast.error('Password and Confirm Password not matched');
            return;
        }
        dispatch(signUpWithEmailAndPassword(signUpData));
        clearInputs('sign-up-inp');
    }

    useEffect(() => {
        if(user){
          console.log('active')
          navigate('/');
        }
      }, [user])
  return (
    <div className={Style.container}>
        <form>
            <input type="text" className='sign-up-inp' name="name" id="name" placeholder='Enter Name' onChange={(e)=> onChangeHandler(e.target , signUpData , setSignUpData)} required/>
            <input type="email" className='sign-up-inp' name="email" id="email" placeholder='Enter Email' onChange={(e)=> onChangeHandler(e.target , signUpData , setSignUpData)} required/>
            <input type="password" className='sign-up-inp' name="password" id="password" placeholder='Enter Password' onChange={(e)=> onChangeHandler(e.target , signUpData , setSignUpData)} required/>
            <input type="password" className='sign-up-inp' name="confirm_password" id="confirm_password" placeholder='Enter Confirm Password' onChange={(e)=> onChangeHandler(e.target , signUpData , setSignUpData)} required/>
            <button type="submit" className="btn btn-sm btn-outline-success" onClick={handleSubmit}>Sign Up</button>
            <button type="button" className="btn btn-sm btn-outline-success" onClick={()=> dispatch(signInWithGoogle())}>Sign In With Google</button>
        </form>
    </div>
  )
}

export default SignUp;