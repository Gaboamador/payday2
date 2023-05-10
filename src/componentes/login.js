import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Button, ButtonToolbar, Row, Col, Container, ListGroup, Table, Form} from 'react-bootstrap';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  
  return (
  <Form style={{maxWidth: "80%", margin: '0 auto'}}>
    <Form.Label>
      LOG IN TO ACCESS
    </Form.Label>
  {/*
  <ButtonToolbar className="well" style={{margin: '0 auto 5px',  display: 'flex', justifyContent: 'center'}}>
  <Button variant="success" onClick={() => loginWithRedirect()}>
    Log In
    </Button>
    </ButtonToolbar>
  */}
    </Form>
)};

export default LoginButton;