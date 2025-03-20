import brand from './../assets/brand.png';
import PopOver from './PopOver';
import { useState } from 'react';

import dotsOutline from '../assets/icons/dots-horizontal-outline.svg';
import dots from '../assets/icons/dots-horizontal.svg';

import Tags from './Tags';
import { useSearch } from '../contexts/SearchContext';
import { categories, colors, isSignedIn, logout } from '../utils';
import { useNavigate } from 'react-router-dom';
import useClickOutside from '../hooks/useClickOutside';
import Checker from './Checker';

const Header = ({profile = null}) => {
    const [showHamburger, setShowHamburger] = useState(false);
    const [showTags, setShowTags] = useState(false);
    const [focused, setFocused] = useState(false);
    const [colorTags, setColorTags] = useState([]);
    const [categoryTags, setCategoryTags] = useState([]);
    const [matchType, setMatchType] = useState('any');

    const { searchTerm, setSearchTerm, setSearchQuery } = useSearch();

    const tagsRef = useClickOutside(() => setShowTags(false));
    const hamburgerRef = useClickOutside(() => setShowHamburger(false));

    const setQuery = () => {
        setSearchQuery({
            categories: [...colorTags, ...categoryTags],
            matchAll: matchType == 'all',
            search: searchTerm,
            ...(profile != null && {uid: profile.uid})
        });
        setShowTags(false);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") setQuery();
    };

    const navigate = useNavigate();

    return (
        <header className='navbar'>
            {/* Section 1: Branding/title */}
            <section id='brand-panel'>
                <img id='logo' src={brand} />
                <p id='title'>PixelVault</p>
            </section>

            {/* Section 2: Search bar */}
            <section id='search' className='pop-over-wrapper' ref={tagsRef}>
                <input 
                    id='field' 
                    type='text' 
                    name='search' 
                    placeholder={` ${(profile && profile.uid)? profile.uid + ':': ''} search..`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowTags(true)}
                />
                <div id='tags'>
                    <PopOver position='left right' show={showTags}>
                        <p className='label'>Colors</p>
                        <Tags list={colors} setTags={setColorTags}/>
                        <hr></hr>
                        <p className='label'>Categories</p>
                        <Tags list={categories} setTags={setCategoryTags}/>
                        <hr></hr>
                        <div className='flex'>
                            <span className='ms-auto my-auto'>{'match: '}</span>
                            <Checker 
                                list={['any', 'all']} 
                                onChange={setMatchType}
                                className='my-m'
                            />
                            <button className='btn-primary' onClick={setQuery}>Search</button>
                        </div>
                    </PopOver>
                </div>
            </section>

            {/* Section 3: Side panel */}
            <section id='clip-panel' className='pop-over-wrapper'>
                <button 
                id='upload--topping' 
                className='btn-primary'
                onClick={() => window.location = '/upload'}
                >
                    Contribute
                </button>
                <div id='hamburger' ref={hamburgerRef}>
                    <button 
                        className='btn-round' 
                        id='toggle' 
                        onMouseOver={() => setFocused(true)} 
                        onMouseLeave={() => setFocused(false)} 
                        onClick={() => setShowHamburger(!showHamburger)}
                    >
                        <img src={focused ? dots : dotsOutline} className='icon'/>
                    </button>
                    <PopOver position='right' show={showHamburger}>
                        <div className='flex-column'>
                            {
                                !isSignedIn ? (
                                    <p 
                                        className="link w-full" 
                                        onClick={() => navigate("/auth")}
                                    >
                                        Sign Up
                                    </p>
                                ) : window.location.pathname == '/profile' ? (
                                    <p 
                                        className="link w-full" 
                                        onClick={() => navigate("/auth", { state: {profile} })}
                                        disabled={!profile}
                                    >
                                        Edit Profile
                                    </p>
                                ) : (
                                    <p 
                                        className="link w-full" 
                                        onClick={() => navigate("/profile")}
                                    >
                                        My Profile
                                    </p>
                                )
                            }
                            {/* List of options */}
                            <p 
                                id='' 
                                className='w-full link'
                                onClick={() => window.location = '/explore'}
                            >
                                Explore
                            </p>
                            <p 
                                id='upload--filling' 
                                className='w-full link'
                                onClick={() => window.location = '/upload'}
                            >
                                Contribute
                            </p>
                            { isSignedIn &&
                                <div>
                                    <hr/>
                                    <p 
                                        id='' 
                                        className='w-full link'
                                        onClick={logout}
                                    >
                                        Logout
                                    </p>
                                </div>
                            }
                        </div>
                    </PopOver>
                </div>
            </section>
        </header>
    );
}

export default Header;
