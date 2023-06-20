
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import Myorders from './Components/Orders/Myorders';
import Cart from './Components/Cart/Cart';

function App() {

  const router = createBrowserRouter([
    { path: '/', 
      element: <Navbar/>,
      children: [
        {index: true , element: <Home/>},
        {path: 'orders' , element: <Myorders/>},
        {path: 'cart' , element: <Cart/>}
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
