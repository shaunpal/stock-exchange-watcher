import React, { useEffect, useState } from "react"
import './newsticker.css'

function NewsTicker({ mode }) {

    const [newsFlash, setNewsFlash] = useState([])
    const getLatestNews = async () => {
      try {
        const resp = await fetch('http://localhost:8080/latest-news', {
            method: 'GET'
        })
        return resp.json()
      } catch(error) {
        
      }
    }

    useEffect(() => {
        getLatestNews().then((res) => {
            if (res) {
              setNewsFlash(res.stories.map((article) => {
                return {
                  headline: article.headline,
                  url: 'https://www.bloomberg.com'+article.url
                }
              }))
            }
        })
    }, [])
    
    return (
      <div className="news-flash-container">
      {newsFlash?.length > 0 ? 
        <div className={`news-container`}>
        <div className={`title-column ${mode}`}>
          Bloomberg News
        </div>
        <ul>
          <li className="latest-news">Latest News</li>
          {newsFlash.map((article) => (
            <li className="news-stories"><a href={`${article.url}`} target="_blank" rel="noopener noreferrer">{article.headline}</a></li>
          ))}
        </ul>
      </div>
      :
      <></>
      }
      </div>
    );
  }
  
  export default NewsTicker;