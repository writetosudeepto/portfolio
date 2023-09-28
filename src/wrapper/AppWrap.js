import React from 'react';
import { NavigationDots, SocialMedia } from '../components';

const AppWrap = (Component, idName, classNames) => function HOC() {
  return (
    <div id={idName} className={`app__container ${classNames}`}>
      
      <div className="app__wrapper ">
        <Component />

        <div className="copyright app__flex">
          <p className="p-text">@2023 SUDIPTA</p>
          <p className="p-text">All rights reserved</p>
        </div>
        <SocialMedia />
      </div>
      <NavigationDots active={idName} />
    </div>
  );
};

export default AppWrap;


