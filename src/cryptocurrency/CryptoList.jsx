import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { DEFAULT_EMPTY_NODES } from '../utils/index.js'
import CryptoListTable from "./CryptoListTable.jsx";

async function getTableQueries(){
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    try {
        const resp = await fetch("https://flask-api-yahoo-app.onrender.com/search/crypto", requestOptions).then((response) => response.json())
        return resp
    } catch (error) {
        toast.error("server lost connection")
    }
}

async function getTableImageQueries(){
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    try {
        const resp = await fetch("https://flask-api-yahoo-app.onrender.com/search/crypto/images", requestOptions).then((response) => response.json())
        return resp
    } catch (error) {
        toast.error("server lost connection")
    }
}

function CryptoList({ theme }){

    const [cryptoList, setCryptoList] = useState(DEFAULT_EMPTY_NODES)
    const [cryptoImgs, setCryptoImgs] = useState(null)

    useEffect(() => {
        const promisedResponse = new Promise((resolve) => {
            getTableQueries().then((res) => {
                const result = res?.quoteResponse?.result
                if (result){
                    resolve(result)
                    setCryptoList({nodes: result})
                }
            })
        })
        toast.promise(promisedResponse,{
            pending: "Fetching crypto quotes",
            success: "Successully fetched",
            error: "error fetching quotes",
        })
    }, [])

    useEffect(() => {
        getTableImageQueries().then((res) => { 
            if (res){
                setCryptoImgs(res)
            }
        })
    }, [])

    useEffect(() => {}, [cryptoList, cryptoImgs])

    return (
        <div className="crypto-table-container">
          <Toaster />
          <h1 className="table-container-title"><b>Cryptocurrency</b></h1>
          {cryptoList && cryptoList?.nodes?.length > 0?
          <CryptoListTable modeTheme={theme} data={cryptoList} images={cryptoImgs} />
          : <h1 className="table-header-results">No results found..</h1>
          }
        </div>
    )
}

export default CryptoList;