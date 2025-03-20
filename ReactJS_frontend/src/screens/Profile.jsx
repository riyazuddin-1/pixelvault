import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import Navbar from '../components/Navbar';
import Gallery from '../components/Gallery';
import Loading from '../components/Loading';
import { isSignedIn, showMessage, credentials } from "../utils";
import { useEffect, useState } from "react";

import userIcon from '../assets/icons/user-icon.svg';
import config from '../config.json';
import { useSearch } from "../contexts/SearchContext";

const MyGallery = ({setProfileId, request}) => {
    useEffect(() => {
        if(!isSignedIn) {
            setProfileId(null);
        } else {
            setProfileId(credentials.uid);
        }
    }, [setProfileId]);

    if(!isSignedIn) {
        return <>Not found</>;
    }

    return <Gallery request={{ access: "editor", request }} />;
};

const FilteredGallery = ({setProfileId, request}) => {
    const {uid} = useParams();
    useEffect(() => {
        if(uid) {
            setProfileId(uid);
        }
    }, [uid, setProfileId]);

    if(!uid) return <>Not found</>;

    return <Gallery request={{ uid: uid, request }} />;
};

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});
    const [profileId, setProfileId] = useState('');

    const {searchQuery} = useSearch();

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch(config.backend_server + '/auth/profile', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ uid: profileId })
                });
                if(response.ok) {
                    setProfile(await response.json());
                    setLoading(false);
                } else {
                    showMessage(await response.text(), "warning");
                    setProfile(undefined);
                    setLoading(false);
                }
            } catch(e) {
                setLoading(false);
                showMessage("Network error", "warning");
            }
        }
        if(profileId !== '') fetchProfile();
        else setLoading(false);
    }, [profileId]);

    if(loading) return <Loading/>;

    if(profileId === null) return (
        <div>
            <h1>404 - Unauthorized</h1>
            <p>Please <span className="highlight" onClick={() => navigate("/auth")}>log in</span> to access this page.</p>
        </div>
    );

    if(profile === undefined) return (
        <div>
            <h1>404! User not found</h1>
            <p><span className="highlight" onClick={() => navigate("/explore")}>Explore</span> other content</p>
        </div>
    );

    return ( 
        <div id='profile'>
            <Navbar profile={profile}/>
            <div className='prime-layout content-layout'>
                <div className="panel-left">
                    <div className="profile-section">
                        <img className="profile-picture" src={profile.picture ?? userIcon}/>
                        <div>
                            <p className="center highlight">@{profile.uid}</p>
                            <p className="center">{profile.fullname}</p>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="about-section">
                        <label>About Me</label>
                        <p>{profile.about}</p>
                    </div>
                </div>
                <div className='content'>
                    <div>
                    <Routes>
                        <Route
                            path=""
                            element={
                                <MyGallery setProfileId={setProfileId} request={searchQuery}/>
                            }
                        />
                        <Route 
                            path='/:uid'
                            element = {
                                <FilteredGallery setProfileId={setProfileId} request={searchQuery} />
                            }
                        />
                    </Routes>
                    </div>
                </div>
                <div className='panel-right'>
                    <p>active since {profile.created_at}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;

// For usecase:
/**
 *     // const [profile, setProfile] = useState({
    //     uid: "rx100",
    //     fullname: "kakashi hatake",
    //     about: "I prodigy shinobi, currently a jonin cum ex-hokage of konoha.",
    //     email: "kakashi@hokage.konoha",
    //     picture: null,
    // })
 */