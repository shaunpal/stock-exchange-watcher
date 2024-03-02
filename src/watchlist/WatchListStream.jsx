import React, { useState, useEffect } from "react";
import './watchlist.css'
import WatchListChartDark from "./WatchListChartDark"
import WatchListChartLight from "./WatchListChartLight"



function WatchListStream({
    quote,
    mode,
}){
    const quoteData = quote?.timestamps?.map((e, i) => [parseInt(`${e}000`), quote?.adjclose[i]]);
    const Chart = mode === 'dark'? WatchListChartDark : WatchListChartLight
    // eslint-disable-next-line
    const [ data, setData ] = useState(quoteData)
    
    const options = {
        title: {
        text: `${quote.Symbol} Stock Price`
        },
        series: [
        {
            name: quote?.Symbol,
            data,
            tooltip: {
            valueDecimals: 2
            } 
        }
        ]
    }

    useEffect(() => {}, [mode])

    return (
        <>
        {quoteData?
            <Chart options={options} />
            :
            <div>No data..</div>
        }
        </>
    );
}

export default WatchListStream;