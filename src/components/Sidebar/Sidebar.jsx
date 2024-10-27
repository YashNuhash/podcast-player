import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';

import { ReactComponent as HomeIcon } from '../../assets/home.svg';
import { ReactComponent as SearchIcon } from '../../assets/search.svg';
import { ReactComponent as PodcastIcon } from '../../assets/podcast.svg';
import styles from './Sidebar.module.scss';

export const Sidebar = () => {
  const playingPodcastId = useSelector(state => state.playingPodcast.podcastId);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [token, setToken] = useState('');

  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect, logout, user } = useAuth0();

  const handleTokenSend = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log('Token: ', token); // Just to verify you're getting the token on the frontend

      // Now send the token to your backend for verification
      const response = await axios.post('http://localhost:3001/verify-token', { token });
      
      console.log('Backend response: ', response.data);
    } catch (error) {
      console.error('Error fetching or sending token:', error);
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized: Invalid token');
      } else if (error.response && error.response.data) {
        try {
          const data = JSON.parse(error.response.data);
          console.error('Error response data:', data);
        } catch (e) {
          console.error('Error parsing response data:', error.response.data);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

      useEffect(() => {
    if (isAuthenticated) {
      const sendTokenToBackend = async () => {
        try {
          const token = await getAccessTokenSilently();
          setToken(token);
          await handleTokenSend();

          fetch('http://localhost:3001/auth/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.error('Error:', err));
        } catch (error) {
          console.error('Error:', error);
          if (error.response && error.response.status === 401) {
            console.error('Unauthorized: Invalid token');
          } else if (error.response && error.response.data) {
            try {
              const data = JSON.parse(error.response.data);
              console.error('Error response data:', data);
            } catch (e) {
              console.error('Error parsing response data:', error.response.data);
            }
          } else {
            console.error('Unexpected error:', error);
          }
        }
      };

      sendTokenToBackend();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <aside>
      <span
        tabIndex={0}
        role='button'
        aria-label='Toggle menu'
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className={styles.Toggle}
      >
        <span
          className={`${styles.ToggleIcon} ${isSidebarVisible ? styles.ToggleIconWhenVisible : ''}`}
        />
      </span>

      <section
        className={`${styles.Sidebar} ${isSidebarVisible ? styles.SidebarMobileVisible : ''}`}
      >
        <h1 className={styles.Logo}>
          <Link to='/' className={styles.LogoLink}>
            NexCast
          </Link>
        </h1>

        <nav className={styles.Nav}>
          <h4 className={styles.Title}>PODCAST</h4>
          <ul>
            <li className={styles.ListItem}>
              <NavLink exact to='/' className={styles.Link} activeClassName={styles.ActiveLink}>
                <HomeIcon className={styles.LinkIcon} />
                Home
              </NavLink>
            </li>

            <li className={styles.ListItem}>
              <NavLink to='/discover' className={styles.Link} activeClassName={styles.ActiveLink}>
                <SearchIcon className={styles.LinkIcon} />
                Discover
              </NavLink>
            </li>

            {playingPodcastId && (
              <li className={styles.ListItem}>
                <NavLink
                  to={`/podcast/${playingPodcastId}`}
                  className={styles.Link}
                  activeClassName={playingPodcastId ? styles.ActiveLink : ''}
                >
                  <PodcastIcon className={styles.LinkIcon} />
                  History
                </NavLink>
              </li>
            )}
          </ul>
          {/* Add login/logout button and user info */}
          <div className={styles.AuthSection}>
            {!isAuthenticated ? (
              <button onClick={() => loginWithRedirect()} className={styles.AuthButton}>
                Log in
              </button>
            ) : (
              <div className={styles.UserInfo}>
                <img src={user.picture} alt={user.name} className={styles.UserImage} />
                <span className={styles.UserName}>{user.name}</span>
                <span className={styles.UserEmail}>{user.email}</span>
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className={styles.AuthButton}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </nav>
      </section>
    </aside>
  );
};

export default Sidebar;