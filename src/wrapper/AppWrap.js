import React from 'react';
import { NavigationDots, SocialMedia } from '../components';
import { images } from "../constants";
const AppWrap = (Component, idName, classNames) => function HOC() {
  return (
    <div id={idName} className={`app__container ${classNames}`}>
      <SocialMedia />
      <div className="app__wrapper app__flex">
        <Component />
        <div className="copyright">
          <div className='app__rights-logo'>
          <img src={images.sd_logo_copyright} alt="sd_logo" />
          </div>
        </div>
      </div>
      <NavigationDots active={idName} />
    </div>
  );
};

export default AppWrap;