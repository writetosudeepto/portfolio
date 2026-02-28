import { useState, useCallback } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { BsSun, BsMoon } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { images } from "../../constants";
import useTheme from "../../hooks/useTheme";
import "./Navbar.scss";

const navItems = ["home", "about", "work", "skills", "contact"];
const SHUTTER_COUNT = 7;
const SHUTTER_STRIP_DELAY = 48;   // ms between each strip
const SHUTTER_STRIP_DURATION = 220; // ms per strip animation

const PowerIcon = () => (
  <svg
    className="close-power-icon"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    <line x1="12" y1="2" x2="12" y2="12" />
  </svg>
);

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleOpen = () => {
    setIsClosing(false);
    setToggle(true);
  };

  // Trigger shutter animation, then unmount sidebar
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    const shutterFillTime =
      (SHUTTER_COUNT - 1) * SHUTTER_STRIP_DELAY + SHUTTER_STRIP_DURATION + 30;
    setTimeout(() => setToggle(false), shutterFillTime);
  }, [isClosing]);

  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <img src={images.logo} alt="logo" />
      </div>
      <ul className="app__navbar-links">
        {navItems.map((item) => (
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
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <BsMoon /> : <BsSun />}
          </button>
        </div>

        <div className="app__navbar-menu">
          <HiMenuAlt4 onClick={handleOpen} />

          {/* onExitComplete resets isClosing AFTER sidebar finishes sliding out,
              so shutter strips remain visible throughout the exit animation */}
          <AnimatePresence onExitComplete={() => setIsClosing(false)}>
            {toggle && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="app__navbar-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={handleClose}
                />

                {/* Sidebar panel */}
                <motion.div
                  className="app__navbar-sidebar"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{
                    x: "100%",
                    transition: { type: "tween", duration: 0.32, ease: [0.4, 0, 1, 1] },
                  }}
                  transition={{
                    type: "tween",
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 400 }}
                  dragElastic={{ left: 0, right: 0.2 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 80 || info.velocity.x > 400) {
                      handleClose();
                    }
                  }}
                >
                  {/* Venetian-blind shutter strips — appear on close, travel left→right */}
                  {isClosing && (
                    <div className="app__navbar-shutter">
                      {Array.from({ length: SHUTTER_COUNT }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="shutter-strip"
                          style={{
                            top: `${(i / SHUTTER_COUNT) * 100}%`,
                            height: `${100 / SHUTTER_COUNT}%`,
                          }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            delay: i * (SHUTTER_STRIP_DELAY / 1000),
                            duration: SHUTTER_STRIP_DURATION / 1000,
                            ease: [0.4, 0, 0.6, 1],
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Drag handle – tap or drag to close */}
                  <div
                    className="app__navbar-sidebar-handle"
                    onClick={handleClose}
                    title="tap to close"
                  />

                  <div className="app__navbar-sidebar-header">
                    <motion.button
                      className="app__navbar-close"
                      onClick={handleClose}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.93 }}
                      disabled={isClosing}
                    >
                      <PowerIcon />
                      <span className={isClosing ? "close-label closing" : "close-label"}>
                        {isClosing ? "SHUTTING DOWN..." : "SHUTDOWN"}
                      </span>
                    </motion.button>
                  </div>

                  <ul>
                    {navItems.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{
                          delay: 0.12 + i * 0.07,
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                      >
                        <a href={`#${item}`} onClick={handleClose}>
                          <span className="nav-item-index">0{i + 1}</span>
                          {item}
                        </a>
                      </motion.li>
                    ))}
                  </ul>

                  <p className="app__navbar-drag-hint">⟵ drag to dismiss</p>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
