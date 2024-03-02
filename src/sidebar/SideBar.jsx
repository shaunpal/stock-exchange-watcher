import React from "react";
import './sidebar.css'
import { useNavigate } from 'react-router-dom'
import { SiExpertsexchange } from "react-icons/si";
import { BsClipboard2DataFill } from "react-icons/bs";
import { TiStopwatch } from "react-icons/ti";
import { FaBitcoin } from "react-icons/fa6";

function SideBar({isOpen, theme}){
    const navigate = useNavigate()
    return (
        <div className={isOpen? `sidebar-container ${theme}` : "hide"}>
            <div className="sidebar-div">
                <div className='sidebar-logo'><SiExpertsexchange size={75} /><p className='sidebar-logo-text'>change</p></div>
                <div className="logo-icons-div">
                <div onClick={() => navigate('/home')} className="sidebar-logo-icon"><BsClipboard2DataFill size={25} className={`icon-board`} /> Top 20 Gainers</div>
                <div onClick={() => navigate('/crypto')} className="sidebar-logo-icon"><FaBitcoin size={25} className={`icon-crypto`}/> Cryptocurrency</div>
                <div onClick={() => navigate('/watchlist')} className="sidebar-logo-icon"><TiStopwatch size={25} className={`icon-watch`} /> Watchlist</div>
                </div>
            </div>
            
        </div>
    );
}

export default SideBar;