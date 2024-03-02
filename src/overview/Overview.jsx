import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import './overview.css'
import SearchResult from "../searchresult/SearchResult";
import toast, { Toaster } from "react-hot-toast";
import ReactLoading from 'react-loading';

function Overview({theme}){
    const [ quotes, setQuotes ] = useState([])
    const [ result, setResult ] = useState(null)
    const { symbol } = useParams();

    const timestamp = () => {
        return "As of "+new Date().toString()
    }

    const enrichResponse = (_quotes, _symbol, response) => {
        if (response) {
            const _filtered = _quotes.filter(_quote => _quote.symbol === _symbol)[0]
            response["QuoteType"] = _filtered?.quoteType
            response['Company'] = _filtered?.shortname
            response["Sector"] = _filtered?.sector
            response["Exchange"] = _filtered?.exchDisp
            response["Industry"] = _filtered?.industry
            response["Symbol"] = _filtered?.symbol
        }
    }

    const insertLocalStorage = (_quote) => {
        var quoteslist = JSON.parse(localStorage.getItem('quotes'));
        if(quoteslist && typeof quoteslist === 'object' ){
            const dupli = quoteslist.filter(q => q.Symbol === _quote.Symbol)
            if (dupli?.length > 0){
                toast.error("Quote already in watchlist")
                return
            }
            quoteslist.push(_quote)
            localStorage.setItem('quotes', JSON.stringify(quoteslist));
        } else {
            quoteslist = []
            quoteslist.push(_quote)
            localStorage.setItem('quotes', JSON.stringify(quoteslist));
        }
        toast.success("Quote added to watchlist")
    }

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
    
      useEffect(() => {
        try {
            getQueryData(`${process.env.REACT_APP_SEARCH_QUOTE_URL}=${symbol}`).then((res) => {
                setQuotes(res.quotes)
            })
        } catch (error) {
            toast.error("Unable to connect to server")
        }
    }, [symbol])


    useEffect(() => {
        try {
            if(quotes.length > 0){
                getQueryData(`${process.env.REACT_APP_SEARCH_QUOTE_URL}=${symbol}`).then((res) => {
                    const resp = res
                    setResult(resp)
                    enrichResponse(quotes, symbol, resp)
                })
            }
        } catch (error) {
            toast.error("Unable to connect to server")
        }
    }, [quotes, symbol])

    useEffect(() => {

    }, [quotes, result])

    return(
        <>
        {result != null && result['Company'] && quotes.length > 0? 
            (
            <div className={`overview-container ${theme}`}>
                <Toaster />
                <h1 className="overview-container-title">Overview</h1>
                <div className="result-header">
                    <div className="quote-header">
                        <h1 className="quote-name">{result['Company']}&nbsp;&nbsp;({result['Symbol']})</h1>
                        <span><p className="header-p">({result['Exchange']}).&nbsp;&nbsp;{timestamp()}</p></span>
                    </div>
                    <button className="add-watchlist-btn" onClick={() => insertLocalStorage(result)}><span>Add to Watchlist </span></button>
                </div>
                <SearchResult data={result} />
            </div>
            )
            :
            <div className="loading-div">
                <ReactLoading
                type={"bars"}   
                color={"#CFCFCF"}
                height={100}
                width={100}
                />
                <p><b>loading..</b></p>
            </div> 
            }
        </>
    );
}

export default Overview;