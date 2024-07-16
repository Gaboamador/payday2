import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Container, Spinner, Table} from 'react-bootstrap';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import {GiPerspectiveDiceSixFacesRandom} from 'react-icons/gi';
import {MdBuildCircle} from 'react-icons/md';
import {BiSelectMultiple} from 'react-icons/bi';
import {GiReactor} from "react-icons/gi";

function Home() {
  // const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  // const [userMetadata, setUserMetadata] = useState(null);

  // useEffect(() => {
  //   const getUserMetadata = async () => {
  //     const domain = "dev-gm7u55v7jisqivq4.us.auth0.com";
  
  //     try {
  //       const accessToken = await getAccessTokenSilently({
  //         authorizationParams: {
  //           audience: `https://${domain}/api/v2/`,
  //           scope: "read:current_user",
  //         },
  //       });
  
  //       const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
  
  //       const metadataResponse = await fetch(userDetailsByIdUrl, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });
  
  //       const { user_metadata } = await metadataResponse.json();
  
  //       setUserMetadata(user_metadata);
  //     } catch (e) {
  //       // console.log(e.message);
  //     }
  //   };
  
  //   getUserMetadata();
  // }, [getAccessTokenSilently, user?.sub]);
  // // console.log(userMetadata, "user metadata");
  // if (isLoading) {
  //   return (
  //   <Container>
  //   <Spinner animation="border" variant="primary" role="status"></Spinner>
  //   <Container>Loading...</Container>
  // </Container>
  // )}
  

return (
<div className="home-background">
  <div className="home-container">
      <Link to="/randomizer" className="home-link">
        <GiPerspectiveDiceSixFacesRandom className="home-icon" />
        <span className="home-text">Randomizer</span>
      </Link>
      <Link to="/builder" className="home-link">
        <MdBuildCircle className="home-icon" />
        <span className="home-text">Builder</span>
      </Link>
      <Link to="/selectorNew" className="home-link">
        <BiSelectMultiple className="home-icon" />
        <span className="home-text">Selector</span>
      </Link>
      <Link to="/bigoil" className="home-link">
        <GiReactor className="home-icon" />
        <span className="home-text">Big Oil Calculator</span>
      </Link>
    </div>
</div>    

);
}  
export default Home;