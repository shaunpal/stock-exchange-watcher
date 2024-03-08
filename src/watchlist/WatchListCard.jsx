import React from "react";
import { TbTriangleFilled } from "react-icons/tb";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { changeColor } from "../utils/index.js";
import './watchlist.css'
import WatchListStream from "./WatchListStream";

function WatchListCard({
    quote,
    mode
}) {
    const isNumber = typeof parseFloat(quote.Change) === 'number'
    return (
        <div className="watch-list-card-container">
            <div className="card-info">
                <span><b>{quote.Company}</b> ({quote.Symbol}) - {quote.Exchange}</span>
                {isNumber ? 
                <div className={`${changeColor(quote.Change)}`}><span><span>{ parseFloat(quote.Change) > 0? <TbTriangleFilled size={14} color="green" /> : <TbTriangleInvertedFilled size={14} color="red" />} {quote.Open}</span></span>&nbsp;&nbsp;<span>{ parseFloat(quote.Change) < 0? quote.Change : '+'+quote.Change}</span></div>
                :
                <div><b>{quote.Open}</b></div>
                }
            </div>
            <WatchListStream key={quote.Symbol} quote={quote} mode={mode} />
        </div> 
    );
}

export default WatchListCard;