import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function App() {
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    return (
        <div className='container text-center my-5'>
            <br />
            <br />
            <h2>Google Login - React</h2>
            <br />
            <br />
            {profile ? (
                <div className='card'>
                    <div className='card-body'>
                        <img src={profile.picture} alt="user profile" />
                        <br /><br />
                        <h3 className='card-title'>User Logged in</h3>
                        <p className='h4'><b>Name:</b> {profile.name}</p>
                        <p className='h4'><b>Email Address:</b> {profile.email}</p>
                        <br />
                        <br />
                        <button className='logout btn btn-secondary' onClick={logOut}>Log out</button>
                    </div>
                </div>
            ) : (
                <button className='sign btn btn-primary' onClick={login}>Sign in with Google 🚀 </button>
            )}
        </div>
    );
}
export default App;
