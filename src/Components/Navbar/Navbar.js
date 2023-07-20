import React from 'react';
import { Link , Outlet , useNavigate , useLocation } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { FaHome } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsFillClipboard2CheckFill } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { userSelector , signout } from '../../Redux/Reducers/UserReducer';
import { filterActions } from '../../Redux/Reducers/FilterReducers';

function Navbar() {
    const { user , loading } = useSelector(userSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
  return (
    <>
    <nav className="navbar navbar-expand-lg" style={{backgroundColor : '#e3f2fd'}}>
        <div className="container-fluid">
            <Link  className="navbar-brand" to="/">Navbar</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mb-2 me-auto mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/"><FaHome style={{verticalAlign: 'initial'}}/> Home</Link>
                    </li>
                    {user && <li className="nav-item">
                        <Link className="nav-link" to="/orders"><BsFillClipboard2CheckFill style={{verticalAlign: 'initial'}}/> My Orders</Link>
                    </li>}
                    {user && <li className="nav-item">
                        <Link className="nav-link" to='/cart'><FaShoppingCart style={{verticalAlign: 'initial'}}/> Cart</Link>
                    </li>}
                </ul>
                {location.pathname === '/' && <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search by Name"
                        onChange={(e)=>{dispatch(filterActions.setSearchQuery(e.target.value))}}
                    />
                </form>}
                <button type="button" className="btn btn-sm btn-outline-success"
                onClick={()=> {
                    user ? dispatch(signout()).then(()=> toast.success("Loged out successfully!")) : navigate('/signin')
                }}>
                    {user ? 'Sign Out' : "Sign In"}
                </button>
            </div>
        </div>
    </nav>
    {loading ? 
        <Loader/> : 
        <>
            <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
            <Outlet/>
        </>
    }
    </>
  )
}

export default Navbar;