import React, { useState } from "react";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { BsSun, BsMoon } from "react-icons/bs";
import { motion } from "framer-motion";
import { images } from "../../constants";
import useTheme from "../../hooks/useTheme";
import "./Navbar.scss";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <img src={images.logo} alt="logo" />
      </div>
      <ul className="app__navbar-links">
        {["home", "about", "work", "skills", "contact"].map((item) => (
          <li className="app__flex p-text" key={`link-${item}`}>
            <div />
            <a href={`#${item}`}>{item}</a>
          </li>
        ))}
      </ul>

      <div className="app__navbar-right">
        <div className="app__navbar-actions">
          <button 
            className="theme-toggle-navbar" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <BsMoon /> : <BsSun />}
          </button>
        </div>

        <div className="app__navbar-menu">
        <HiMenuAlt4 onClick={() => setToggle(true)} />

        {toggle && (
          // <motion.div
          //   whileInView={{ x: [300, 0] }}
          //   transition={{ duration: 0.85, ease: "easeOut" }}
          // >

          // </motion.div> //

          <div>
            <HiX onClick={() => setToggle(false)} />
            <ul>
              {["home", "about", "work", "skills", "contact"].map((item) => (
                <li key={item}>
                  <a href={`#${item}`} onClick={() => setToggle(false)}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
