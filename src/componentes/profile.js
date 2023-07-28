import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./login";
import {Container, Spinner} from 'react-bootstrap';

const Profile = () => {
    
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
        // console.log(e.message);
      }
    };
  
    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);
  // console.log(userMetadata, "user metadata");
  // console.log(user, "user");

  if (isLoading) {
    return (
      <Container>
      <Spinner animation="border" variant="primary" role="status"></Spinner>
      <Container>Loading...</Container>
    </Container>
    )
  }

  return (
  
      <div>
        {isAuthenticated ? (
        <>
        <Container>
        <img src={user.picture} alt={user.name} />
        <h3>Nickname: {user.nickname}</h3>
        <p>Email: {user.email}</p>
        <h3>User Metadata</h3>
        {userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          "No user metadata defined"
        )}
        </Container>
      </>
    ) : (
      <Container>
  <LoginButton/>
  </Container>
  )}
  </div>
)};

export default Profile;