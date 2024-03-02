import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom'
import './searchbar.css'
import toast, { Toaster } from "react-hot-toast";
  

function SearchBar({ theme }) {
    const inputValue = useRef('');
    const [ quotes, setQuotes ] = useState([])
    const navigate = useNavigate();

    async function getQueryData(url = "") {
        // Default options are marked with *
        const response = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET",
            "Access-Control-Allow-Headers": "*"
          }
        }).then((response) => response.json());
        return response; // parses JSON response into native JavaScript objects
      }

    const getQuote = async (evt) => {
        let dropdown = document.querySelector('.quotes-block');
        const ele = evt.target
        const div = ele.closest("div")
        const symbol = div.querySelector("#symbol").innerHTML
        inputValue.current.value = symbol
        dropdown?.classList?.add("hide")
        navigate(`/search/${symbol}`)
    }   
    
    const getSearchQuery = async (evt) => {
        let dropdownContent = document.querySelector('.dropdown-content');
        let dropdown = document.querySelector('.quotes-block');
        const query = evt.target.value
        if(query !== ""){
            if (dropdown?.classList.contains('hide')){
                dropdown?.classList?.remove("hide")
            }  
            try {
                const resp = await getQueryData(`${process.env.REACT_APP_SEARCH_QUOTE_URL}=${query}`)
                setQuotes(resp.quotes)
            } catch (error) {
                console.log("error: ", error)
                toast.error("Unable to connect to server")
            }
            
        } else {
            setQuotes(null)
            if (!dropdown?.classList.contains('hide')){
                dropdownContent?.classList?.add("hide")
            }
        }

    }

    useEffect(() => {},[quotes])

    return (
        <div className={`search-dropdown-block ${theme}`}>
                <Toaster />
                <form className="nosubmit">
                    <input className={`nosubmit ${theme}`} ref={inputValue} type="search" placeholder="Search..." onInput={getSearchQuery} />
                </form>
                {quotes && quotes.length !== 0 && inputValue.current.value !== ""?
                    <div className={`quotes-block ${theme}`}>
                        <div className={`dropdown-label label-header ${theme}`}>
                            <p><b>SYMBOL</b>&nbsp;&nbsp;&nbsp;&nbsp;<b>COMPANY/NAME</b></p>
                            <p><b>TYPE - EXCHANGE</b>&nbsp;</p>
                        </div>
                        {quotes.map(quote => (
                            <div key={quote.symbol} className={`dropdown-content ${theme}`}>
                                <div className="dropdown-label" onClick={getQuote}>
                                    <p><span id="symbol">{quote.symbol}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{quote.shortname}</span></p>
                                    <span>{quote.quoteType} - {quote.exchange}</span>
                                </div>
                            </div>  
                        ))}
                    </div>
                : 
                null}
        </div>
    );
}

export default SearchBar;