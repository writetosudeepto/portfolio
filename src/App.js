import React from 'react'
import { About , Footer , Header, Skills, Testimonial, Work } from './container'
import { Navbar } from './components'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import useTheme from './hooks/useTheme'
import './App.scss'

const App = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="app">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
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