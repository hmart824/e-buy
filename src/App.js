import { useSelector , useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { createBrowserRouter , RouterProvider , Navigate} from 'react-router-dom';
import { userSelector , authentication } from './Redux/Reducers/UserReducer';
import './App.css';

import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Myorders from './Components/Orders/Myorders';
import Cart from './Components/Cart/Cart';
import Login from './Components/Login/Login';
import SignUp from './Components/Login/SignUp';



function App() {

  const {user} = useSelector(userSelector);
  const dispatch = useDispatch();

  const router = createBrowserRouter([
    { path: '/', 
      element: <Navbar/>,
      children: [
        {index: true , element: <Home/>},
        {path: 'orders' , element: user ? <Myorders/> : <Navigate to='/'/>},
        {path: 'cart' , element: user ? <Cart/> : <Navigate to='/'/>},
        {path: 'signin' , element: <Login/>},
        {path: 'signup' , element: <SignUp/>},
      ]
    }
  ])

  useEffect(() => {
    dispatch(authentication());
   },[])
  

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
