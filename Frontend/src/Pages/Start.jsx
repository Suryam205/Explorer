import React from 'react'
import StartPageImg from '../StartPage.png';
import '../Styles/Start.css'
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div className="fullscreen-container">
      <img src={StartPageImg} alt="Start Page" className="start-page-image" />
    
              <Link to="/signin" className="start-link">Get Started</Link>

 
    </div>
  )
}

export default Start
