import { useEffect, useState, useContext } from 'react'
import { supabase } from './supabaseClient'
import Context from "./context";
import {Button, InputGroup, Form  } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Auth() {
    const context= useContext(Context)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLoginWithOtp = async (event) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }

  const [step, setStep] = useState("email");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })
    sessionStorage.setItem('user', context.user)
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      },
    {
      redirectTo: 'https://gaboamador.github.io/payday2/'
    })
    setLoading(false);
    
    if (error) {
      // Handle the error case here, e.g., show a notification or error message
      console.error('Sign up error:', error.message);
    } else {
      // Show alert to user for email verification
      alert('Account created successfully! Please check your email to verify your account.');
      window.location.href = '/';
    }
  };

  const handleContinue = () => {
    setStep("login");
  };

  const handleCreateAccount = () => {
    setStep("signup");
  };


  const handleChangeUser = (e) => {
    const targetInput = e.target.value;
    setEmail(targetInput);
    context.setUser(targetInput); // Update the context value
  };

  const handleChangePass = (e) => {
    const targetInput = e.target.value;
    setPassword(targetInput);
    context.setPass(targetInput); // Update the context value
  };
  
  useEffect(() => {
    
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };


  return (
    <div>
      <div>
        {/* <h1 className="component-title">Access</h1> */}
        {/* <p className="description">Sign in via magic link with your email below</p>
        <form className="form-widget" onSubmit={handleLoginWithOtp}>
            <div>
                <input
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <button className={'button block'} disabled={loading}>
                {loading ? <span>Loading</span> : <span>handleLoginWithOtp</span>}
                </button>
            </div>
        </form> */}
      </div>

      <div>
      {step === "email" && (
        <div>
        <InputGroup className="mb-3">
        <InputGroup.Text>Enter your email</InputGroup.Text>
          <Form.Control
            className="inputField"
            type="email"
            placeholder="email@example.com"
            value={context.user}
            required={true}
            // onChange={(e) => setEmail(e.target.value)}
            onChange={handleChangeUser}
          />
          </InputGroup>
          <div className="userAuthButtons">
            <Button variant="success" className={'button block'} onClick={handleContinue}>
              Continue
            </Button>
            <Button variant="dark" className={'button block'} onClick={handleCreateAccount}>
              Create Account
            </Button>
          </div>
        </div>
      )}

      {step === "login" && (
        // <form className="form-widget" onSubmit={handleLogin}>
        <InputGroup className="signUpContainer mb-3">
            <InputGroup.Text>Enter your password</InputGroup.Text>
          <Form.Control
            className="inputField"
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            value={context.pass}
            required={true}
            // onChange={(e) => setPassword(e.target.value)}
            onChange={handleChangePass}
          />
                     <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon className="eyeIcon" icon={showPassword ? faEyeSlash : faEye} style={{marginLeft:5}}/>
              </span>
          <div className="user-button-container">
            <Button variant='success' className='mt-3' disabled={loading} onClick={handleLogin}>
              {loading ? <span>Loading</span> : <span>Login</span>}
            </Button>
          </div>
        {/* </form> */}
        </InputGroup>
      )}

      {step === "signup" && (
        // <form className="form-widget" onSubmit={handleSignUp}>
        <InputGroup className="signUpContainer mb-3">
          <InputGroup.Text>Create a password</InputGroup.Text>
          <Form.Control
            className="inputField"
            type={showPassword ? "text" : "password"}
            placeholder="password"
            value={context.pass}
            required={true}
            onChange={handleChangePass}
            // onChange={(e) => setPassword(e.target.value)}
          />
                     <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon className="eyeIcon" icon={showPassword ? faEyeSlash : faEye} style={{marginLeft:5}}/>
              </span>
          <div className="user-button-container">
            <Button variant='dark' className='mt-3' disabled={loading} onClick={handleSignUp}>
              {loading ? <span>Loading</span> : <span>Create Account</span>}
            </Button>
          </div>
        {/* </form> */}
        </InputGroup>
      )}
    </div>

    </div>
  )
}