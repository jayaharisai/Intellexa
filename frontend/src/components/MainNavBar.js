import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from "../img/logo.svg";
import "./styles.css";

function MainNavBar() {
  return (
    <div className='navbar'>
      <div>
        <img 
          className='logo rotating-image' 
          src={logo} 
          alt='RAGFusion logo'
        />
      </div>
      <div className='menu'>
        <ul>
          <li>
            <NavLink to="/knowledgebase" className={({ isActive }) => isActive ? 'active' : ''}>
              Knowledge-base
            </NavLink>
          </li>
          <li>
            <NavLink to="/configuration" className={({ isActive }) => isActive ? 'active' : ''}>
              Configuration
            </NavLink>
          </li>
          <li>
            <NavLink to="/chat" className={({ isActive }) => isActive ? 'active' : ''}>
              Chat
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/monitoring" className={({ isActive }) => isActive ? 'active' : ''}>
              Monitoring
            </NavLink>
          </li> */}
        </ul>
        <div className='logout'><i className="bi bi-box-arrow-right"></i> Logout</div>
      </div>
    </div>
  );
}

export default MainNavBar;
