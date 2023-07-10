import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import '../App.css';
import {Row, Col, Dropdown, Button, Form} from 'react-bootstrap';
import {ImHome} from 'react-icons/im';
import {FiLogIn} from 'react-icons/fi';
import {AiOutlineLogin} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import LogoutButton from "./logout";
import Profile from "./profile";

const Header = () => {
    const [sticky, setSticky] = useState(false);

    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "dev-gm7u55v7jisqivq4.us.auth0.com";
  
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: "read:current_user",
          },
        });
  
        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
  
        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const { user_metadata } = await metadataResponse.json();
  
        setUserMetadata(user_metadata);
      } catch (e) {
        console.log(e.message);
      }
    };
  
    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);
  
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
  
    const { logout } = useAuth0();
  
    const handleLogout = () => {
      // logout({ logoutParams: { returnTo: window.location.origin } })
      logout({ logoutParams: { returnTo: "https://gaboamador.github.io/payday2" } })
    };

    const { loginWithRedirect } = useAuth0();
    const handleLogin = () => {
      loginWithRedirect()
    };
    
    return (
<header id="header" className={`header ${sticky ? "header--sticky" : ""}`}>
        {/* <Link to="/">
          <ImHome size={32} className="homeIcon"/>
        </Link>
        {isAuthenticated ? (
          <>
          <div className="userPicture">
          <img
          src={user.picture}
          alt={user.name}
          style={{ borderRadius: '50%', width: '32px', height: '32px' }}
          onClick={handleToggleDropdown}
          />
           <Dropdown show={showDropdown} onToggle={handleToggleDropdown}>
              <Dropdown.Toggle className="visually-hidden" variant="primary" id="dropdown-profile" />
              <Dropdown.Menu className="dropdownMenu">
              <Link to="/profile" style={{textDecoration:"none"}}>
                <Dropdown.Item href="#/action-1" className="dropdownItem">Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="dropdownItem">Log out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
    </> ) : (
        <div className="userPicture">
        <div className="login-box2" style={{ maxWidth: "80%", margin: '0 auto' }}>
            <div className="form2">
            <Form className="button2" variant="outline-light" type="submit">
            <AiOutlineLogin
            className="loginIcon2"
            onClick={handleToggleDropdown}/>
            <span className="span2"></span>
            </Form>
          </div>
          </div>
        <Dropdown show={showDropdown} onToggle={handleToggleDropdown}>
              <Dropdown.Toggle className="visually-hidden" variant="primary" id="dropdown-profile" />
              <Dropdown.Menu className="dropdownMenu">
                <Dropdown.Item onClick={handleLogin} className="dropdownItem">Log in</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>      
            </div>
    )} */}
</header>

    );
  };
export default Header;