import React, {useEffect, useState} from "react";
import './watchlist.css'
import { DEFAULT_EMPTY_NODES } from '../utils/index.js'
import WatchListTable from "./WatchListTable.jsx";
import toast, { Toaster } from "react-hot-toast";
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import WatchListModule from "./WatchListModule.jsx";

function WatchList({ theme }){

    const [watchList, setWatchList] = useState(DEFAULT_EMPTY_NODES)
    const [quotesList, setQuotesList] = useState(null)
    const [subscribedList, setSubscribedList] = useState([])

    const [view, setView] = React.useState('list')
    const handleChange = (event, nextView) => {
        setView(nextView);
      };

    const subscribeQuotes = async (data) => {
        let promisedResponse = new Promise((resolve) => {
            fetch(`${process.env.REACT_APP_MIDDLEWARE_SUBSCRIBE_URL}`, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(data)
            }).then((response) => {
                if(response.ok){
                    resolve(response.json())
                    toast.success('Successully subscribed')
                }
                
            }).catch((error) => {
                toast.error("unable to subscribe quotes")
                return
            })
        })

        promisedResponse.then((resp) => {
            // setting subscribedList
            setSubscribedList(resp
            .filter(data => data?.is_open)
            .map(data => data?.chart?.result[0]?.meta?.symbol))
            
            let newWatchlist = []
            resp.forEach((data) => {
                const chart = data?.chart
                const result = chart?.result[0]
                const meta = result.meta
        
                let newState = watchList?.nodes.filter(node => node.Symbol === meta?.symbol).map(obj => {
                    return { 
                        ...obj,
                        "Open": meta.regularMarketPrice,
                        "Previous close": meta.previousClose,
                        "Status": data.is_open,
                        "timestamps": result.timestamp,
                        "indicators": result.indicators?.quote[0],
                        "adjclose": result.indicators?.adjclose[0]?.adjclose,
                        "Change": parseFloat(parseFloat(meta.regularMarketPrice)-parseFloat(obj['Previous close'])).toPrecision(8),
                        "Change percent": (((parseFloat(meta.regularMarketPrice)-parseFloat(obj['Previous close']))/parseFloat(obj['Previous close']))*100).toPrecision(8),
                        "regularMarketTime": meta?.regularMarketTime,
                        "isOpen": data?.is_open,
                        
                    }
                })[0];
                newWatchlist.push(newState)
                if (!chart?.is_open) {
                    localStorage.setItem(`${meta.symbol}-chart`, JSON.stringify(data));
                }
            })
            setWatchList({nodes: newWatchlist})
        })
    }

    useEffect(() => {
        const _quotes = JSON.parse(localStorage.getItem('quotes'));
        if (_quotes) {
            setQuotesList(Object.values(_quotes).map(x => { 
                return { 'quote': x.Symbol }
             }));
        }
    }, [])
    

    useEffect(() => {
        if (quotesList?.length > 0){
            subscribeQuotes(quotesList)
        }
    // eslint-disable-next-line
    }, [quotesList])

    useEffect(() => {
        
    },[subscribedList])

    useEffect(() => {
        if (subscribedList?.length > 0) {
            const server = new EventSource(`${process.env.REACT_APP_MIDDLEWARE_PUBLISH_URL}`)
 
            server.onmessage = (msg) => {
                const data = JSON.parse(msg.data)
                const result = data?.quoteResponse?.result[0]
                setWatchList({nodes: watchList?.nodes.map(obj =>
                    obj.Symbol === result?.symbol? 
                        {
                            ...obj,
                            "Open": result?.regularMarketPrice,
                            "Change": parseFloat(result?.regularMarketChange).toPrecision(8),
                            "Change percent": parseFloat(result?.regularMarketChangePercent).toPrecision(8),
                            "regularMarketTime": result?.regularMarketTime,
                            "Volume": result?.regularMarketVolume,
                            "Avg. volume": result?.averageDailyVolume3Month,
                        }
                        : obj
                )})
            };
    
            server.onerror = () => {
                console.log("Closing connection")
                server.close()
            }
    
            return () => server.close()
        }
        
    // eslint-disable-next-line
    }, [subscribedList])

    useEffect(() => {
        try {
            setWatchList({nodes: JSON.parse(localStorage.getItem('quotes'))})
        } catch (error) {
            toast.error("No watchlist found")
        }
        
    },[])
    useEffect(() => {}, [watchList])

    return (
        <div className="watchlist-container">
            <Toaster />
            <h1 className="container-table-title"><b>Stock Watchlist</b></h1>
            {watchList != null && watchList.nodes?
                <>
                <div className="toggle-button-container">
                    <ToggleButtonGroup
                        orientation="horizontal"
                        value={view}
                        exclusive
                        onChange={handleChange}>
                        <ToggleButton value="list" aria-label="list">
                            <ViewListIcon />
                        </ToggleButton>
                        <ToggleButton value="module" aria-label="module">
                            <ViewModuleIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                {view === 'list'?
                  <div className="watchlist-table-container"> 
                    <WatchListTable modeTheme={theme} data={watchList} />
                  </div>
                  :
                  <WatchListModule modeTheme={theme} data={watchList?.nodes} /> 
                }
                </>
                :
                <>
                <h1 className="align">No quotes found..</h1>
                <p className="align">start searching and selecting on search bar</p>
                </>
            }  
        </div>
    )
}

export default WatchList;