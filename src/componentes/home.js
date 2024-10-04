import React, { useEffect, useState } from "react";
import {Container, Spinner, Table} from 'react-bootstrap';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import {GiPerspectiveDiceSixFacesRandom} from 'react-icons/gi';
import {MdBuildCircle} from 'react-icons/md';
import {BiSelectMultiple} from 'react-icons/bi';
import {GiReactor} from "react-icons/gi";
import { FaGear } from "react-icons/fa6";

function Home() {

return (
<div className="home-background">
  <div className="home-container">
      <Link to="/randomizer" className="home-link">
        <GiPerspectiveDiceSixFacesRandom className="home-icon" />
        <div className="home-text-container">
          <span className="home-text">Randomizer</span>
          <span className="home-subtext">Difficulty, build, heist and profile</span>
        </div>
      </Link>
      <Link to="/builder" className="home-link">
        <MdBuildCircle className="home-icon" />
        <div className="home-text-container">
          <span className="home-text">Build / Edit Profiles</span>
          <span className="home-subtext">Create profiles or edit existing</span>
        </div>
      </Link>
      <Link to="/selectorTags" className="home-link">
        <BiSelectMultiple className="home-icon" />
        <div className="home-text-container">
          <span className="home-text">Search Profiles</span>
          <span className="home-subtext">Search profiles by tags</span>
        </div>
      </Link>
      <Link to="/bigoil" className="home-link">
        <GiReactor className="home-icon" />
        <div className="home-text-container">
          <span className="home-text">Big Oil Calculator</span>
          <span className="home-subtext">Doctor Fantastic!</span>
        </div>
      </Link>
      <Link to="/profilesConfig" className="home-link">
        <FaGear className="home-icon" />
        <div className="home-text-container">
          <span className="home-text">Profiles Configuration</span>
          <span className="home-subtext">Login / Sign up</span>
          <span className="home-subtext">Manage your profiles</span>
        </div>
      </Link>
    </div>
</div>    

);
}  
export default Home;