import React from 'react';
import logo from '../assets/project_logo.png';
import blobLeft from '../assets/blob1.png';
import blobRight from '../assets/blob2.png';

const LandingPage = () => {
  return (
    <div className="relative w-screen h-screen flex justify-center items-center bg-white overflow-hidden">
      <img 
        src={blobLeft} 
        alt="Blob Left" 
        className="absolute z-10 w-1/3 h-auto object-cover left-0 top-0" // Repositioned to top-left
      />
      <div className="relative z-20 flex flex-col items-center">
        <img 
          src={logo} 
          alt="PeopleConnect" 
          className="max-w-[600px] mb-4" // Adjusted size to match the image
        />
      </div>
      <img 
        src={blobRight} 
        alt="Blob Right" 
        className="absolute z-10 w-1/3 h-auto object-cover right-0 bottom-0" // Repositioned to bottom-right
      />
    </div>
  );
};

export default LandingPage;