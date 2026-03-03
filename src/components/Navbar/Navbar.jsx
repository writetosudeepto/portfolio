import { useState, useCallback, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Keep power icon visible until sidebar is fully gone (onExitComplete resets isClosing)
  const showCloseIcon = toggle || isClosing;

  return (
    <nav className={`app__navbar${scrolled ? " scrolled" : ""}`}>
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
          {/* Hamburger ↔ power icon — morphs in place */}
          <motion.button
            className={`app__navbar-menu-toggle${showCloseIcon ? " is-open" : ""}${isClosing ? " is-closing" : ""}`}
            onClick={showCloseIcon ? handleClose : handleOpen}
            aria-label={showCloseIcon ? "Close menu" : "Open menu"}
            disabled={isClosing}
            whileTap={{ scale: 0.88 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {showCloseIcon ? (
                <motion.span
                  key="close-icon"
                  className="menu-toggle-icon"
                  initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <PowerIcon />
                </motion.span>
              ) : (
                <motion.span
                  key="hamburger-icon"
                  className="menu-toggle-icon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.4 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <HiMenuAlt4 />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* onExitComplete resets isClosing AFTER sidebar finishes sliding out */}
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
