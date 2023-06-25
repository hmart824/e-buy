import React, { useState } from 'react';
import Style from './Login.module.css';
import { useContextValue } from '../../Context/CustomContext';

const SignUp = () => {
    const {clearInputs , onChangeHandler} = useContextValue();
    const [signUpData, setSignUpData] = useState({});

    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log(signUpData);
        clearInputs('sign-up-inp');
    }
  return (
    <div className={Style.container}>
        <form>
            <input type="text" className='sign-up-inp' name="name" id="name" placeholder='Enter Name' onChange={(e)=> onChangeHandler(e.target , signUpData , setSignUpData)}/>
            <input type="email" className='sign-up-inp' name="email" id="email" placeholder='Enter Email' onChange={(e)=> onChangeHandler(e.target , signUpData , setSignUpData)}/>
            <input type="password" className='sign-up-inp' name="password" id="password" placeholder='Enter Password' onChange={(e)=> onChangeHandler(e.target , signUpData , setSignUpData)} />
            <input type="password" className='sign-up-inp' name="confirm_password" id="confirm_password" placeholder='Enter Confirm Password' onChange={(e)=> onChangeHandler(e.target , signUpData , setSignUpData)} />
            <button type="submit" className="btn btn-sm btn-outline-success" onClick={handleSubmit}>Sign Up</button>
            <button type="button" className="btn btn-sm btn-outline-success">Sign In With Google</button>
        </form>
    </div>
  )
}

export default SignUp;