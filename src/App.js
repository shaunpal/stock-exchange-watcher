import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './searchbar/Searchbar';
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { SiExpertsexchange } from "react-icons/si";
import { BiMenu } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import NavBar from './navbar/NavBar'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import TopGains from './topgains/TopGains';
import WatchList from './watchlist/WatchList';
import CryptoList from './cryptocurrency/CryptoList';
import ErrorPage from './errors/ErrorPage';
import Overview from './overview/Overview'
import SideBar from './sidebar/SideBar';

function App() {

  const [theme, setTheme] = useState('light');
  const [isSideBarOpen, setSideBarOpen] = useState(false)
  
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  useEffect(() => {
    document.body.className = theme;
  }, [theme])
  return (
    <>
      <Router>
      <div className='app-container'>
        <SideBar isOpen={isSideBarOpen} theme={theme} />
        <div className='app-header'>
          <div className='logo'><SiExpertsexchange size={55} /><p className='logo-text'>change</p></div>
          <div className='menu-nav'>{!isSideBarOpen? <BiMenu onClick={() => setSideBarOpen(true)} size={55} /> : <RxCross1 size={40} onClick={() => setSideBarOpen(false)}/> }</div>
          <div className='app-mid-container'>
            <SearchBar className="search-bar" theme={theme} />
            <NavBar className="nav-bar" theme={theme} />
          </div>
          <div onClick={toggleTheme} className='mode-btn'>{theme === 'light'? <div className={`btn-mode ${theme}`}><CiLight size={25} />Light</div> : <div className={`btn-mode ${theme}`}><MdDarkMode size={25} />Dark</div>}</div>
        </div>
        <div className='app-content'>
          <Routes>
            <Route path='/' element={<Navigate to="/home" />} />
            <Route path='/home' element={<TopGains theme={theme} />} />
            <Route path="/crypto" element={<CryptoList theme={theme} />} />
            <Route path="/watchlist" element={<WatchList theme={theme} />} />
            <Route path="/search/:symbol" element={<Overview theme={theme} />} />
            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </div>
      </div>
      </Router>
    </>
  );
}

export default App;
