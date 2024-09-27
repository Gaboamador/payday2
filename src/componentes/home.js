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
        <span className="home-text">Randomizer</span>
      </Link>
      <Link to="/builder" className="home-link">
        <MdBuildCircle className="home-icon" />
        <span className="home-text">Profile Builder</span>
      </Link>
      <Link to="/selectorTags" className="home-link">
        <BiSelectMultiple className="home-icon" />
        <span className="home-text">Search by tags</span>
      </Link>
      <Link to="/bigoil" className="home-link">
        <GiReactor className="home-icon" />
        <span className="home-text">Big Oil Calculator</span>
      </Link>
      <Link to="/profilesConfig" className="home-link">
        <FaGear className="home-icon" />
        <span className="home-text">Profiles Configuration</span>
      </Link>
    </div>
</div>    

);
}  
export default Home;