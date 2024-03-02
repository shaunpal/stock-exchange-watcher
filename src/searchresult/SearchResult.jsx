import React from 'react';
import './searchresult.css'

function SearchResult({ data }){

    return (
        <div className='container'>
            {Object.entries(data).map(([key, value]) => {
                return (
                    <div key={key} className='data-column'>
                        <div className='data-values'><p>{key}</p><p><b>{value}</b></p></div>
                    </div>
                )
            })}
        </div>
    );
}

export default SearchResult;