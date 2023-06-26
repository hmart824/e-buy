import React, { useState , useEffect} from 'react';
import Style from './Login.module.css';
import { useContextValue } from '../../Context/CustomContext';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const {clearInputs , onChangeHandler , signUpWithEmailAndPassword , toast , user} = useContextValue();
    const [signUpData, setSignUpData] = useState({});

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(signUpData.password !== signUpData.confirm_password){
            toast.error('Password and Confirm Password not match');
            return;
        }
        signUpWithEmailAndPassword(signUpData);
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
            <button type="button" className="btn btn-sm btn-outline-success">Sign In With Google</button>
        </form>
    </div>
  )
}

export default SignUp;