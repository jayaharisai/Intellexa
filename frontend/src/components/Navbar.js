import React from 'react'
import logo from "../img/logo.svg"
import "./styles.css"

function Navbar() {
  return (
    <div>
        <div className='navbar'>
            <img 
                className='logo' 
                src={logo} 
                alt='RAGFusion logo'
                >
                </img>
        </div>
    </div>
  )
}

export default Navbar