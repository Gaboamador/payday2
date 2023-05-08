import React from "react";
import {Container} from 'react-bootstrap';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { FaVoteYea } from 'react-icons/fa';
import {BsFillPersonLinesFill, BsReverseLayoutTextWindowReverse, BsCalendarWeek, BsXCircle, BsAward, BsCalendar2Check, BsFillBarChartLineFill} from 'react-icons/bs';
import Profile from "./profile";
import LoginButton from "./login";
import LogoutButton from "./logout";
import Payday2Randomizer from './randomizer';

function Home() {

  const icons = [
    { icon: FaVoteYea, label: 'Randomizer', to: '/randomizer' },
    { icon: FaVoteYea, label: 'Profile', to: './profile' },
  ];

return (
<div className="contentHome">

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

</div>
);
}  
export default Home;