import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Container, Spinner} from 'react-bootstrap';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import {GiPerspectiveDiceSixFacesRandom} from 'react-icons/gi';
import {ImProfile} from 'react-icons/im';
import LoginButton from './login';
import LogoutButton from './logout';
import Profile from "./profile";

function Home() {
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
  console.log(userMetadata, "user metadata");
  if (isLoading) {
    return (
    <Container>
    <Spinner animation="border" variant="primary" role="status"></Spinner>
    <Container>Loading...</Container>
  </Container>
  )}
  
  const icons = [
    { icon: GiPerspectiveDiceSixFacesRandom, label: 'Randomizer', to: '/randomizer' },
    { icon: ImProfile, label: 'Profile', to: './profile' },
  ];
  

return (
<div className="contentHome">
{isAuthenticated ? (
  <>
<Container className="navigation">
  {icons.map((item, index) => (
    <Link to={item.to} key={index} className='icon'>
      <div className="icon-wrapper">
        <div className="icon">
          <item.icon />
        </div>
      </div>
      <div className="label">{item.label}</div>
    </Link>
  ))}
</Container>  
  </>
) : (
  <Container>
  <LoginButton/>
  </Container>
  )}  

</div>
);
}  
export default Home;