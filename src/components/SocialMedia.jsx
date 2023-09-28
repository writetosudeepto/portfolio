import React from "react";
import { BsTwitter, BsInstagram } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { SiHackerrank, SiTableau } from "react-icons/si";
import { PiGithubLogoBold } from "react-icons/pi";
import { TbBrandLinkedin } from "react-icons/tb";

const SocialMedia = () => {
  const handleIconClick = (url) => {
    window.open(url, "_blank"); // Opens the URL in a new tab
  };
  return (
    <div className="app__social">
      <div
        onClick={() => handleIconClick("https://github.com/writetosudeepto")}
      >
        <PiGithubLogoBold />
      </div>
      <div
        onClick={() =>
          handleIconClick("https://www.linkedin.com/in/writetosudeepto")
        }
      >
        <TbBrandLinkedin />
      </div>
      <div>
        <SiHackerrank
          onClick={() =>
            handleIconClick("https://www.hackerrank.com/writetosudeepto")
          }
        />
      </div>

      <div
        onClick={() =>
          handleIconClick(
            "https://public.tableau.com/app/profile/sudipta.das5968"
          )
        }
      >
        <SiTableau />
      </div>
      <div
        onClick={() => handleIconClick("https://twitter.com/writetosudeepto")}
      >
        <BsTwitter />
      </div>
      <div
        onClick={() =>
          handleIconClick("https://www.facebook.com/thealwaysuncertain")
        }
      >
        <FaFacebookF />
      </div>
      <div
        onClick={() =>
          handleIconClick(
            "https://www.instagram.com/the_principle_of_uncertainty"
          )
        }
      >
        <BsInstagram />
      </div>
    </div>
  );
};

export default SocialMedia;
