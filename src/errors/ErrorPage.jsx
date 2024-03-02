import React from "react";
import { PiSmileySad } from "react-icons/pi";
import './errorpage.css'

function ErrorPage(){

    return(
        <div className="error-container">
            <PiSmileySad size={90} />
            <h1 className="error-header">404</h1>
            <p className="error-text">Page not found..</p>
        </div>
    );
}

export default ErrorPage;