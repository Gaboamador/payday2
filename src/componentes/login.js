import { useState, useEffect,useContext } from 'react';
import { supabase } from '../supabaseClient';
import Context from "../context";

const Auth = () => {
  const context= useContext(Context)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState('')
  
  
  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError(`Signup failed: ${error.message}`);
    } else {
      setUser(data.user);
    }
  };

  const handleMagicLinkLogin = async (email) => {
    if (!email) {
      alert("Please provide a valid email address.");
      return;
    }
  
    try {
      const { data, error } = await supabase.auth.signInWithOtp({ email });
  
      if (error) {
        console.error("Error sending magic link:", error.message);
        alert("Error sending magic link. Please check your email.");
      } else {
        alert("Magic link sent! Please check your inbox.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An unexpected error occurred.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleMagicLinkLogin(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      setError(error.message);
    } else {
      console.log('Logged in user:', user);
      setUser(user); // Store user information in state
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

  // Send the password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/payday2#/passwordReset' // Pass the redirect URL here
  });

    if (error) {
      console.error("Error sending password reset email:", error.message);
      alert("Error sending password reset email. Please check your email.");
    } else {
      alert("Password reset email sent! Please check your inbox.");
    }
  };
  
  

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    getUser();
  }, []);
  
  // context.setEmailPrefix(user?.email.split('@')[0].trim() || '');
  // console.log(context.emailPrefix)
  
    // const emailPrefix = user?.email.split('@')[0].trim() || ''
    // console.log(user.email.split('@')[0].trim())

  
  
  
  

  return (
    <div>
    {user ? (
      <div>
        <p>Welcome, {user.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    ) : (
      <div>
        <h2>Login / Signup</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <button onClick={handleSignup}>Sign Up</button>
        <button onClick={handleForgotPassword}>Forgot Password?</button>
        {error && <p>{error}</p>}
      
        <form onSubmit={handleSubmit}>
        <label>Email Address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Magic Link</button>
      </form>
      </div>
    )}
  </div>
  );
};

export default Auth;
