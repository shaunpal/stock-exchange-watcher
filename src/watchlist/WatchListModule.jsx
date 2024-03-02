import React from "react";
import './watchlist.css'
import WatchListCard from "./WatchListCard";

function WatchListModule({
  data,
  modeTheme,
}) {
    return (
        <div className="watch-list-module-container">
            {data.map(_quote => (
                <WatchListCard key={_quote.Symbol} quote={_quote} mode={modeTheme} />
            ))}
        </div>
    );
}

export default WatchListModule;