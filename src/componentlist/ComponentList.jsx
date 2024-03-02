import React, { useEffect, useState } from "react";
import './componentlist.css';
import toast, { Toaster } from "react-hot-toast";
import { Tabs } from 'flowbite-react';
import TopGains from '../topgains/TopGains'
import WatchList from "../watchlist/WatchList";
import { BsClipboard2DataFill } from "react-icons/bs";
import { TiStopwatch } from "react-icons/ti";
import { FaBitcoin } from "react-icons/fa6";
import CryptoList from "../cryptocurrency/CryptoList";


function ComponentList({ theme }){
    const [quotesList, setQuotesList] = useState(null)
    const [subscribedList, setSubscribedList] = useState([])

    const subscribeQuotes = async (data) => {
        let response
        try {
            response = await fetch("http://localhost:4005/subscribe", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(data)
        })
        } catch (err){
            toast.error("Failed to fetch subscribers..")
        }
        
        console.log("Received: ", response)
    }

    useEffect(() => {
        const _quotes = JSON.parse(localStorage.getItem('quotes'));
        if (_quotes) {
            setQuotesList(_quotes);
        }
    }, [])

    useEffect(() => {
        if(quotesList) {
            setSubscribedList(Object.values(quotesList).map(x => x.Symbol))
            // console.log("sending to backend... ", subscribedList)
            
        }
    },[quotesList])

    useEffect(() => {
        if (subscribedList.length > 0){
            subscribeQuotes(subscribedList)
        }
    }, [subscribedList])

    useEffect(() => {
        const server = new EventSource("http://localhost:4008/publish")

        server.onmessage = (msg) => {
            // If the component is mounted, we set the state
            // of the list with the received data
            console.log("inside server-sent:: ", JSON.parse(msg.data))
        };

        server.onerror = () => {
            console.log("Closing connection")
            server.close()
        }

        return () => server.close()
    }, [])
    

    console.log("inside WatchList quotesList", quotesList)
    console.log("inside WatchList subscribedList", subscribedList)
    return (
        <div className="componentlist-container">
            <Toaster />
            <Tabs>
                <Tabs.Item className="tabs gainers-tab" active title="Top 20 Gainers" icon={BsClipboard2DataFill}>
                    <TopGains theme={theme} />
                </Tabs.Item>
                <Tabs.Item className="tabs watchlist-tab" title="Watchlist" icon={TiStopwatch}>
                    <WatchList theme={theme} />
                </Tabs.Item>
                <Tabs.Item className="tabs crypto-tab" color="green" title="Cryptocurrency" icon={FaBitcoin}>
                    <CryptoList theme={theme} />
                </Tabs.Item>
            </Tabs>
        </div>
    );
}

export default ComponentList;