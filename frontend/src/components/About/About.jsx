import React from 'react';
import './About.css';
import GoogleMap from './GoogleMap';

const About = () => {
  return (
    <div className='about'>
      <div className="background">
      <div className="left">
      <h1>About Us</h1>
      <p>Gonuts with Donuts is a srilanka dedicated food outlets for specialize manufacturing of Donuts in Colombo, Srilanka. </p>
      </div>

      <div className="right">
        <GoogleMap/>
      </div>
      </div>
    </div>
  )
}

export default About
