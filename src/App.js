import React from 'react'
import { About , Footer , Header, Skills, Testimonial, Work } from './container'
import { Navbar, DarkModeAudio } from './components'
import SimpleSpace from './components/SimpleSpace/SimpleSpace'
import './App.scss'

const App = () => {
  return (
    <div className="app">
      <DarkModeAudio />
      <SimpleSpace />
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