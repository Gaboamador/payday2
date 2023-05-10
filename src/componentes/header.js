import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import '../App.css';
import {Row, Col, Dropdown, Button} from 'react-bootstrap';
import {ImHome} from 'react-icons/im';
import {FiLogIn} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import LogoutButton from "./logout";

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
      /*logout({ logoutParams: { returnTo: window.location.origin } })*/
      logout({ logoutParams: { returnTo: "https://gaboamador.github.io/payday2" } })
    };

    const { loginWithRedirect } = useAuth0();
    const handleLogin = () => {
      loginWithRedirect()
    };
    
    return (
<header id="header" className={`header ${sticky ? "header--sticky" : ""}`}>
        <Link to="/">
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
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout}>Log out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
    </> ) : (
        <div className="userPicture">
        <FiLogIn
        className="loginIcon"
        onClick={handleToggleDropdown}/>
        <Dropdown show={showDropdown} onToggle={handleToggleDropdown}>
              <Dropdown.Toggle className="visually-hidden" variant="primary" id="dropdown-profile" />
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogin}>Log in</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
    )}
</header>

    );
  };
export default Header;