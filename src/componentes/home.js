import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Container} from 'react-bootstrap';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import {GiPerspectiveDiceSixFacesRandom} from 'react-icons/gi';
import {ImProfile} from 'react-icons/im';
import LoginButton from './login';
import LogoutButton from './logout';
import Profile from "./profile";

function Home() {
  const isAuthenticated = useAuth0();
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
<LogoutButton/>
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