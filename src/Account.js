import { useState, useEffect, useContext } from 'react'
import { supabase } from './supabaseClient'
import Context from "./context";
import { Button, Dropdown, ButtonGroup, Container, Form, InputGroup, Card, Badge} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export default function Account({ session }) {
    const context= useContext(Context)
    const [user, setUser] = useState('')

  useEffect(() => {
    // const getUser = async () => {
    //   const { data: { session } } = await supabase.auth.getSession();
    //   setUser(session?.user || null);
    //   context.setLogin(true)
    //   sessionStorage.setItem('user', context.user)
    //   sessionStorage.setItem('login', true)
    //   console.log(context.user, "user despues de logueo")
    //   console.log(context.login, "estado de logueo")
    // };
    const getUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          context.setLogin(true);
          sessionStorage.setItem('user', session.user.email);
          sessionStorage.setItem('login', true);
        } else {
          context.setLogin(false);
          sessionStorage.setItem('login', false);
        }
      };
    getUser();
  }, []);

const [password, setPassword] = useState('')
const [showPasswordForm, setShowPasswordForm] = useState(false);

const updateUser = async (event) => {
    event.preventDefault();

  // Display a confirmation dialog to the user
  const confirmUpdate = window.confirm("Change password. Confirm?");
  
  // If the user cancels, exit the function early
  if (!confirmUpdate) {
    return;
  }

  // Proceed with updating the password if the user confirms
    let { data, error } = await supabase.auth.updateUser({
      email: user.email,
      password: password,
    });
    if (error) {
      console.error("Error updating password:", error.message);
    } else {
      alert("Password updated successfully!");
    }
    setPassword(""); // Clear the password input after update
  };

  const handleSignOut = () => {
     // Display a confirmation dialog to the user
  const confirmSignOut = window.confirm("Do you really want to sign out?");
  
  // If the user cancels, exit the function early
  if (!confirmSignOut) {
    return;
  }
    
    supabase.auth.signOut();
    context.setUser('');
  };

  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm); // Toggle the visibility of the form
  };

  const handleChangePass = (e) => {
    const targetInput = e.target.value;
    setPassword(targetInput);
    context.setPass(targetInput); // Update the context value
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };


return (
<div>

    <div className="userData">
    
    {/* <div className="userName">
    {user.email}
    </div> */}
    <h4>
      {/* <Badge bg="success" className="userName">{user.email}</Badge> */}
      <Badge bg="success" className="userName">{context.user}</Badge>
      </h4>

    <Dropdown as={ButtonGroup}>
    <Button variant="secondary" onClick={handleSignOut}>
        Sign Out
    </Button>
    <Dropdown.Toggle split variant="danger" id="dropdown-split-basic" />
    <Dropdown.Menu>
        <Dropdown.Item as="button" onClick={togglePasswordForm}>
        Change Password
        </Dropdown.Item>
    </Dropdown.Menu>
    </Dropdown>
</div>

<div>
      {showPasswordForm && (
        // <form className="form-widget" onSubmit={updateUser}>
          <InputGroup className="signUpContainer mt-3 mb-3">
          <InputGroup.Text>New password</InputGroup.Text>
            <Form.Control
              className="inputField"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={context.pass}
              required={true}
            onChange={handleChangePass}
            />
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon className="eyeIcon" icon={showPassword ? faEyeSlash : faEye} style={{marginLeft:5}}/>
              </span>
          <div className="user-button-container">
            <Button variant='danger' className='mt-3' onClick={updateUser}>
              <span>Change Password</span>
            </Button>
          </div>
        {/* </form> */}
        </InputGroup>
      )}
</div>



</div>
  )
}