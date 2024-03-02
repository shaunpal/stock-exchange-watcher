import React, {useState, useEffect, useCallback} from "react";
import './topgains.css'
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import toast, { Toaster } from "react-hot-toast";
import { DEFAULT_PAYLOAD, TOP20GAINERS_COLUMNS, populatePayload, filteredMessage, LIGHT_TABLE_THEME, DARK_TABLE_THEME } from '../utils/index.js'
import { LuRefreshCcw } from "react-icons/lu";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom'

class GainsPayload {
    price
    pricePercentage
    volume
    region
}

function TopGains({ theme }){
      
    const [isPricePercentageBtwn, setIsPricePercentageBtwn] = useState(false);
    const [isPriceBtwn, setIsPriceBtwn] = useState(false);
    const [isVolumebtwn, setIsVolumeBtwn] = useState(false);
    const [resultsFound, setResultsFound] = useState(0)
    const [trigger, setTrigger] = useState(0)
    const [quotes, setQuotes] = useState(null)
    const [filterMsg, setFilterMsg] = useState([])
    const [isEdit, setIsEdit] = useState(false)

    const navigate = useNavigate()
    const navigateToQuoteOverview = (symbol) => {
        navigate(`/search/${symbol}`)
    }

    const OVERRIDE_TOP20GAINERS_COLUMNS = [
        { label: 'Symbol', renderCell: (item) => <div className="gainers-symbol" onClick={() => navigateToQuoteOverview(item?.symbol)}>{item?.symbol}</div>},
        ...TOP20GAINERS_COLUMNS
      ];

    const refresh = useCallback(() => {
        setTrigger(s => s + 1)
      }, [])

    const tableTheme = useTheme([getTheme(),theme === "light"? LIGHT_TABLE_THEME : DARK_TABLE_THEME]);
    const hideForm = () => {
        let submitform = document.querySelector(".submit-form")
        let editform = document.querySelector(".form-edit-toggle")
        submitform.classList.add("hide-form")
        editform.classList.remove("hide-form")
        setIsEdit(false)
    }

    const showForm = () => {
        let submitform = document.querySelector(".submit-form")
        let editform = document.querySelector(".form-edit-toggle")
        submitform.classList.remove("hide-form")
        editform.classList.add("hide-form")
        setIsEdit(true)
    }

    const onChangeOperator = (event) => {
      let id = event.target.id
      let value = event.target.value
        switch(id){
            case 'percentchange': 
                if (value === "btwn"){
                    setIsPricePercentageBtwn(true) 
                } else {
                    setIsPricePercentageBtwn(false) 
                }

            break;
            case 'intradaypricechange': 
                if (value === "btwn") {
                    setIsPriceBtwn(true);
                } else {
                    setIsPriceBtwn(false) 
                }
            
            break;
            case 'dayvolume':
                if (value === "btwn") {
                    setIsVolumeBtwn(true);
                } else {
                    setIsVolumeBtwn(false) 
                }
            
                break;
            default:
                break;
        }
    }

    const onChangeInput = (event) => {
        let input = event.target
        input.classList.remove('error-field')
    }

    function getTableQueries(_payload){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(_payload)
        };
        return new Promise((resolve, reject) => {
            fetch(`${process.env.REACT_APP_TOP_GAINS_URL}`, requestOptions)
                .then((response) => response.json())
                .then((res) => resolve(res))
                .catch(error => {
                reject(error)
            })
        })
    }

    const formSubmit = async (event) => {
        event.preventDefault()
        let inputs = event.target.querySelectorAll(".form-inputs input")
        for (let input of inputs){
            if(!input?.value){
                input.classList.add("error-field")
                toast.error("Field cannot be empty")
                return
            }
        }
        let gainsPayload = new GainsPayload();
        let formInputs = event.target.querySelectorAll(".form-inputs")
        for (let formInput of formInputs){
            let select = formInput.querySelector("select")
            let input_num1 = formInput.querySelector("#num-1")
            let input_num2 = formInput.querySelector("#num-2")
            populatePayload(gainsPayload, select, input_num1, input_num2)
        }
        let payload = [gainsPayload.price, gainsPayload.pricePercentage, gainsPayload.volume, gainsPayload.region]
        
        const promisedResponse = new Promise((resolve) => {
            getTableQueries(payload).then((resp) => {
                const result = resp?.finance?.result[0]?.quotes
                if(result){
                    resolve(result)
                    setResultsFound(result.length)
                    setQuotes({nodes: result})
                }
            })
        })
        toast.promise(promisedResponse,{
            pending: "Fetching queried quotes",
            success: "Successully fetched",
            error: "error fetching quotes",
        })
    }   

    useEffect(() => {
        const promisedResponse = new Promise((resolve) => {
            getTableQueries(DEFAULT_PAYLOAD).then((resp) => {
                const result = resp?.finance?.result[0]?.quotes
                if(result){
                    resolve(result)
                    setResultsFound(result.length)
                    setQuotes({nodes: result})
                    setFilterMsg(filteredMessage(DEFAULT_PAYLOAD))
                }
            });
        })
        toast.promise(promisedResponse, {
            pending: "Fetching gainers quotes",
            success: "Successully fetched",
            error: "error fetching quotes",
        })
        
    }, [trigger])

    useEffect(() => {}, [resultsFound, quotes, filterMsg])

    return (
        <div className="topgains-container">
            <h1 className="topgains-title"><b>Stock Gainers</b></h1>
            <Toaster />
            <div className={`forms-container ${theme}`}>
                <h3 className="apply-filter">{!isEdit? <IoIosArrowForward onClick={showForm} /> : <IoIosArrowDown onClick={hideForm} />} &nbsp;<b>Apply filters</b></h3>
                <form className="submit-form hide-form" onSubmit={formSubmit}>
                    <h2 id="forms-container-header"><b>Filter By:</b><span id="container-note">Note: currencies in USD</span></h2>
                    <div className="form-inputs">
                        <div className={`price-percentage-range ${theme}`}>
                            <label className="label" htmlFor="price-percentage-range">% change of price</label>
                            <select defaultValue={'gt'} className={theme} name="price-percentage-range" id="percentchange" onChange={onChangeOperator}>
                                <option className={theme} value={'gt'}>Greater Than</option>
                                <option className={theme} value={'eq'}>Equals</option>
                                <option className={theme} value={'lt'}>Less Than</option>
                                <option className={theme} value={'btwn'}>Between</option>
                            </select>
                        </div>
                        <input className={`${theme} ${isPricePercentageBtwn? 'is-between': 'non-between'}`} onChange={onChangeInput} id="num-1" min={1} type="number" step=".01"/>
                        {isPricePercentageBtwn ?  <input className={`${theme} ${isPricePercentageBtwn? 'is-between': ''}`} id="num-2" onChange={onChangeInput} min={1} type="number" step=".01" /> : null}
                    </div>
                    <div className={`form-inputs ${theme}`}>
                        <div className="price-percentage">
                            <label className="label" htmlFor="price-percentage">Price (intraday)</label>
                            <select defaultValue={'gt'} className={theme} name="price-percentage" id="intradaypricechange" onChange={onChangeOperator}>
                                <option value={'gt'}>Greater Than</option>
                                <option value={'eq'}>Equals</option>
                                <option value={'lt'}>Less Than</option>
                                <option value={'btwn'}>Between</option>
                            </select>
                        </div>
                        <input className={`${theme} ${isPriceBtwn? 'is-between': 'non-between'}`} onChange={onChangeInput} min={1} id="num-1" type="number" step=".01" />
                        {isPriceBtwn ? <input className={`${theme} ${isPriceBtwn? 'is-between': 'non-between'}`} id="num-2" onChange={onChangeInput} min={1} type="number" step=".01" /> : null}
                    </div>
                    <div className="form-inputs">
                        <div className="volume">
                            <label className="label" htmlFor="volume">Volume</label>
                            <select defaultValue={'gt'} className={theme} name="volume" id="dayvolume" onChange={onChangeOperator}>
                                <option value={'gt'}>Greater Than</option>
                                <option value={'eq'}>Equals</option>
                                <option value={'lt'}>Less Than</option>
                                <option value={'btwn'}>Between</option>
                            </select>
                        </div>
                        <input className={`${theme} ${isVolumebtwn? 'is-between': 'non-between'}`} onChange={onChangeInput} min={1} id="num-1" type="number" step=".01" />
                        {isVolumebtwn ? <input className={`${theme} ${isVolumebtwn? 'is-between': 'non-between'}`} id="num-2" onChange={onChangeInput} min={1} type="number" step=".01" /> : null}
                    </div>
                    <div className="form-inputs">
                        <div className="region">
                            <p>Region</p>
                        </div>
                        <div>
                        <select className={theme} defaultValue={'us'} name="region" id="region">
                            <option value={'us'}>United States</option>
                            <option value={'sg'}>Singapore</option>
                        </select>
                        </div>
                    </div>
                    <input type="submit" value={"Find Stocks"} className="form-submit-btn" />
                </form>
                <div className="form-edit-toggle">
                    <p className="filter-text">{filterMsg.map(msg => (
                        <span key={msg}>{msg[0]} <b>{msg[1]} {msg[2]}</b></span>
                    ))}</p>
                </div>
            </div>
            <div className="table-panel"><p><b>Matching results:</b> {resultsFound}</p><div className={`refresh-btn ${theme}`} onClick={refresh}><LuRefreshCcw /></div></div>
            {quotes && quotes?.nodes?.length > 0? 
                <div className="table-container">
                    <span className="tooltiptext">Click any symbol for more info</span>
                    <CompactTable className="top-gains-table" columns={OVERRIDE_TOP20GAINERS_COLUMNS} data={quotes} theme={tableTheme} layout={{ isDiv: true, fixedHeader: true }} />
                </div>
            :
            <>
               <h1 className="table-header-results">No results found..</h1>
            </>
            } 
        </div>
    )
}

export default TopGains;