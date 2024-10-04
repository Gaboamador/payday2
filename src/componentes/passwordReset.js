import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Adjust the import based on your project structure

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [token, setToken] = useState(null); // For storing the access token
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the access_token from the URL
    const urlParams = new URLSearchParams(window.location.hash);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      setToken(accessToken);
    } else {
      setError("Invalid or missing token.");
    }
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !token) {
      setError("Please provide a valid token and password.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      access_token: token, // Pass the token explicitly
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password reset successfully. You can now log in.");
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {!success && (
        <form onSubmit={handlePasswordReset}>
          <div>
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Set New Password</button>
        </form>
      )}
    </div>
  );
};

export default PasswordReset;
