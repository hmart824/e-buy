
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import Myorders from './Components/Orders/Myorders';
import Cart from './Components/Cart/Cart';
import Login from './Components/Login/Login';
import SignUp from './Components/Login/SignUp';

function App() {

  const router = createBrowserRouter([
    { path: '/', 
      element: <Navbar/>,
      children: [
        {index: true , element: <Home/>},
        {path: 'orders' , element: <Myorders/>},
        {path: 'cart' , element: <Cart/>},
        {path: 'signin' , element: <Login/>},
        {path: 'signup' , element: <SignUp/>},
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
