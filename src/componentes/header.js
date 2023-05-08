import React, { useState, useEffect } from "react";
import '../App.css';
import {Row, Col} from 'react-bootstrap';
import {BsFillHouseFill} from 'react-icons/bs';
import { Link } from 'react-router-dom';

const Header = () => {
    const [sticky, setSticky] = useState(false);
  
    useEffect(() => {
      const header = document.getElementById("header");
      const handleScroll = () => {
        if (window.pageYOffset > header.offsetTop) {
          setSticky(true);
        } else {
          setSticky(false);
        }
      };
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
  
    
    return (
<header id="header" className={`header ${sticky ? "header--sticky" : ""}`}>
  <div>
        <Link to="/">
          <BsFillHouseFill size={32} className="homeIcon"/>
        </Link>
  </div>
</header>

    );
  };
export default Header;