import React from 'react'
import Navbar from './component/Navbar'
import Home from './component/Home'
import Liveauction from './component/Liveauction'
import Cta from './component/Cta'
import Footer from './component/Footer'
import WelcomePopup from './component/Welcome'
import Image from "./component/Image"
import Contact from './component/Contact'
export default function page() {
  return (
    <div 
    style={
             {
                 "background":  "#ffffff"
             }
    }
    >
      <WelcomePopup />
    <Navbar/>
    <Home/>

    <Liveauction/>
        <Image/>
        <Contact/>
    <Cta/>
    <Footer/>
    </div>
  )
}
