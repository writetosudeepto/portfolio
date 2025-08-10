import React from 'react'
import { About , Footer , Header, Skills, Testimonial, Work } from './container'
import { Navbar, DarkModeAudio } from './components'
import SpaceBackground from './components/SpaceBackground/SpaceBackground'
import './components/SpaceBackground/SpaceBackground.scss'
import './App.scss'

const App = () => {
  return (
    <div className="app">
      <DarkModeAudio />
      <SpaceBackground />
      <Navbar />
      <Header />
      <About />
      <Work />
      <Skills />  
      {/* <Testimonial /> */}
      <Footer />
    </div>
  );
};

export default App