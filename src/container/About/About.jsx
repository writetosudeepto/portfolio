import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./About.scss";
import { images } from "../../constants";
import { urlFor, client } from "../../client";
import { AppWrap, MotionWrap } from "../../wrapper";
import { useStore } from "../../store";

const About = () => {
  const [abouts, setAbouts] = useState([]);
  const { count, increment, decrement } = useStore.getState();

  useEffect(() => {
    const query = '*[_type=="abouts"]';
    console.log("zustand data value before: ", count);
    client
      .fetch(query)
      .then((data) => setAbouts(data))
      .then(increment())
      .then(
        console.log(
          "zustand data value after increment: ",
          useStore.getState().count
        )
      )
      .then(decrement())
      .then(increment())
      .then(
        console.log(
          "zustand data value after decrement and increment: ",
          useStore.getState().count
        )
      );
  }, []);
  return (
    <>
      <h2 className="head-text">
        Make <span>Data Driven</span>
        <br />
        <span>Decisions</span>
      </h2>

      <div className="app__profiles">
        {abouts.map((about, index) => (
          <motion.div
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, type: "tween" }}
            className="app__profile-item"
            key={about.title + index}
          >
            <img src={urlFor(about.imgUrl)} alt={about.title} />
            <h2 className="bold-text" style={{ marginTop: 20 }}>
              {about.title}
            </h2>
            <p className="p-text" style={{ marginTop: 10 }}>
              {about.description}
            </p>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default AppWrap(
  MotionWrap(About, "app__about"),
  "about",
  "app__whitebg"
);
