import React from 'react'
import { About , Footer , Header, Skills, Testimonial, Work } from './container'
import { Navbar } from './components'
import { useStore } from './store'
import './App.scss'
import { useState, useEffect } from "react";

const App = () =>
  {
    const { count, increment, decrement } = useStore.getState();
    const [countState, setCount] = useState(count);

    useEffect(()=>{
      console.log("build App Page, useEffect count: ", useStore.getState().count)
    },[countState]);
    
    console.log("build App Page, count: ",countState)

    return (
    <div className="app">
      <Navbar />
      <Header />
      <About />
      <Work />
      <Skills />  
      {/* <Testimonial /> */}
      <Footer />
    </div>
  );
}

export default App