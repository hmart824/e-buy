import React, { useState } from 'react';
import { Link , Outlet} from 'react-router-dom';
import { useContextValue } from '../../Context/CustomContext';

function Navbar() {
    const {filterProducts} = useContextValue();
    const [searchText, setSearchText] = useState('');

    const handleSearch = ()=>{
        let timeout;
        clearTimeout(timeout);
        timeout = setTimeout(()=>{
            filterProducts(searchText);
        } , 500)
    }
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
                        <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/orders">My Orders</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/cart'>Cart</Link>
                    </li>
                </ul>
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search by Name" aria-label="Search"
                        onChange={(e)=>{setSearchText(e.target.value)}}
                        onKeyUp={handleSearch}
                    />
                </form>
            </div>
        </div>
    </nav>
    <Outlet/>
    </>
  )
}

export default Navbar