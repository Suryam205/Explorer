import React from 'react'
import HomeProfile from './HomeProfile'
import '../../Styles/Home.css'
import HomeFooter from './HomeFooter'
import HomeData from './HomeData'

const Home = () => {
  return (
    <div className='Home-profile'>
      <HomeProfile/>
      <HomeData/>
      <HomeFooter/>
    </div>
  )
}

export default Home
