import React, { useState, useEffect } from "react";
import '../App.css';
import {Row, Col, Dropdown, Button, Form} from 'react-bootstrap';
import {ImHome} from 'react-icons/im';
import {FiLogIn} from 'react-icons/fi';
import {AiOutlineLogin} from 'react-icons/ai';
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
  
    const [showDropdown, setShowDropdown] = useState(false);

    const handleToggleDropdown = () => {
      setShowDropdown((prevState) => !prevState);
    };
  
  
    
    return (
      
<header id="header" className={`header ${sticky ? "header--sticky" : ""}`}>
<div className="d-flex justify-content-between align-items-center w-100 header-padding">
  <Link to="/">
    <ImHome size={32} className="homeIcon"/>
  </Link>

  <div className={`d-flex align-items-center`}>
    <span>
      <img src={("https://www.paydaythegame.com/wp-content/themes/pd2tg/img/crimenet/logo-pd2.png")} alt={""} width="90%" height="40px" />
    </span>
  </div>

  <div className={`ml-auto `}>
  </div>

</div>
</header>

    );
  };
export default Header;