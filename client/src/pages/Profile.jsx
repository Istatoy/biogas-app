// client/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/profile.css';

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Предположим, что API /api/users/me возвращает данные текущего пользователя
    axios.get('/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!profile) return <div className="page-container"><h2>Loading profile...</h2></div>;

  return (
    <div className="page-container profile-container">
      <h2>My Profile</h2>
      <div className="profile-card">
        <div className="profile-avatar">
          <img src="https://via.placeholder.com/150" alt="Profile" />
        </div>
        <div className="profile-info">
          <p><strong>First Name:</strong> {profile.first_name}</p>
          <p><strong>Last Name:</strong> {profile.last_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role_name || 'User'}</p>
          <button>Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
