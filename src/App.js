import React from 'react'
import { About , Footer , Header, Skills, Testimonial, Work } from './container'
import { Navbar, MeteorEffect } from './components'
import './App.scss'

const App = () => {
  return (
    <div className="app">
      <MeteorEffect intensity="normal" />
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