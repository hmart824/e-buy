import React, { useEffect, useState } from 'react';
import Style from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { useContextValue } from '../../Context/CustomContext';

const Login = () => {
    const navigate = useNavigate();
    const {clearInputs , onChangeHandler , signIn , user} = useContextValue();
    const [signInData, setSignInData] = useState({});

    const handleSubmit = (e)=>{
        e.preventDefault();
        signIn(signInData);
        clearInputs('sign-in-inp');
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
            <input type="email" className='sign-in-inp' name="email" id="email" placeholder='Enter Email' onChange={(e)=> onChangeHandler(e.target , signInData , setSignInData)} required/>
            <input type="password" className='sign-in-inp' name="password" id="password" placeholder='Enter Password' onChange={(e)=> onChangeHandler(e.target , signInData , setSignInData)} required/>
            <button type="submit" className="btn btn-sm btn-outline-success" onClick={handleSubmit}>Sign In</button>
            <button type="button" className="btn btn-sm btn-outline-success">Sign In With Google</button>
            <button type="button" className="btn btn-sm btn-outline-success" onClick={()=> navigate('/signup')}>Sign Up</button>
        </form>
    </div>
  )
}

export default Login