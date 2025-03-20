import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { 'x-access-token': token }
        });
        setProfile(res.data);
        setFormData({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          email: res.data.email,
          password: ''
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put('http://localhost:3001/api/users/profile', formData, {
        headers: { 'x-access-token': token }
      });
      alert('Профиль обновлен');
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!profile) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Мой профиль</h2>
      {!editing ? (
        <div>
          <p>Имя: {profile.first_name}</p>
          <p>Фамилия: {profile.last_name}</p>
          <p>Email: {profile.email}</p>
          <button onClick={() => setEditing(true)}>Редактировать профиль</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Имя:</label>
            <input name="first_name" value={formData.first_name} onChange={handleChange} />
          </div>
          <div>
            <label>Фамилия:</label>
            <input name="last_name" value={formData.last_name} onChange={handleChange} />
          </div>
          <div>
            <label>Email:</label>
            <input name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label>Пароль:</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
            />
          </div>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={() => setEditing(false)}>Отмена</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
