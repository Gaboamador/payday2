import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Button, ButtonToolbar, Row, Col, Container, ListGroup, Table, Form} from 'react-bootstrap';
import '../App.css';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  
  return (
  <>
        <div className="login-box" style={{ maxWidth: "80%", margin: '0 auto' }}>
          <div className="form">
            <Form className="button" variant="outline-light" type="submit" style={{cursor: "default"}}>
              LOG IN TO ACCESS
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </Form>
          </div>
        </div>

    </>
    )};

export default LoginButton;