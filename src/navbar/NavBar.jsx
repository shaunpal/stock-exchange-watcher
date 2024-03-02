
import React from "react";
import './navbar.css'
import { BsClipboard2DataFill } from "react-icons/bs";
import { TiStopwatch } from "react-icons/ti";
import { FaBitcoin } from "react-icons/fa6";

import Nav from 'react-bootstrap/Nav';

function NavBar({theme}){
    return (
        <Nav className={`nav-bar-container ${theme}`} variant="underline" defaultActiveKey="/home">
        <Nav.Item>
            <Nav.Link href="/home"><span className={`link-${theme}`}><BsClipboard2DataFill size={25} className={`icon-board`} />Top 20 Gainers</span></Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="/crypto"><span className={`link-${theme}`}><FaBitcoin size={25} className={`icon-crypto`}/> Cryptocurrency</span></Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="/watchlist"><span className={`link-${theme}`}><TiStopwatch size={25} className={`icon-watch`} /> Watchlist</span></Nav.Link>
        </Nav.Item>
        </Nav>
    )
}

export default NavBar;