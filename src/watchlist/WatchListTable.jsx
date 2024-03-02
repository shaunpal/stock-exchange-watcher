import React from "react";
import './watchlist.css'
import {
    Table,
    Header,
    HeaderRow,
    Body,
    Row,
    HeaderCell,
    Cell,
  } from "@table-library/react-table-library/table";
import { useTheme } from '@table-library/react-table-library/theme';
import { LIGHT_WATCHLIST_TABLE_THEME, DARK_WATCHLIST_TABLE_THEME, changeColor } from '../utils/index.js'
import { TbTriangleFilled } from "react-icons/tb";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { LuDot } from "react-icons/lu";

function WatchListTable({
  data,
  modeTheme,
}){
    const defaultTheme = modeTheme === 'light'? LIGHT_WATCHLIST_TABLE_THEME : DARK_WATCHLIST_TABLE_THEME
    const theme = useTheme(defaultTheme);

    return (
        <Table className="watchlist-table" data={data} theme={theme} layout={{ isDiv: true, fixedHeader: true }}>
            {(tableList) => (
            <>
          <Header>
              <HeaderRow>
                <HeaderCell className="header">Symbol</HeaderCell>
                <HeaderCell className="header">Company</HeaderCell>
                <HeaderCell className="header">Price (IntraDay)</HeaderCell>
                <HeaderCell className="header">Change</HeaderCell>
                <HeaderCell className="header">%Change</HeaderCell>
                <HeaderCell className="header">Vol</HeaderCell>
                <HeaderCell className="header">Avg. Vol</HeaderCell>
                <HeaderCell className="header">MarketCap.</HeaderCell>
                <HeaderCell className="header">Instrument</HeaderCell>
                <HeaderCell className="header">Exchange</HeaderCell>
                <HeaderCell className="header">Status</HeaderCell>
              </HeaderRow>
             </Header>
            <Body>
            {tableList.map((item, index) => (
              <Row key={index} item={item}>
                <Cell className="cell">
                  {item?.Symbol}
                </Cell>
                <Cell className="cell company-name">
                  {item?.Company}
                </Cell>
                <Cell className="cell price flash-price"> {/*style={{ backgroundColor: 'white' }} */}
                  <span>{item['Change'] > 0? <TbTriangleFilled size={14} color="green" /> : <TbTriangleInvertedFilled size={14} color="red" />}{item['Open']}</span>
                </Cell>
                <Cell className={`${changeColor(item['Change'])} cell align`}>
                  {item['Change']? item['Change'] : "-"}
                </Cell>
                <Cell className={`${changeColor(item['Change percent'])} cell align`}>
                  {item['Change percent']? item['Change percent'] : "-" }
                </Cell>
                <Cell className="cell">
                  {item?.Volume}
                </Cell>
                <Cell className="cell">
                  {item['Avg. volume']}
                </Cell>
                <Cell className="cell">
                  {item['Market cap']}
                </Cell>
                <Cell className="cell">
                  {item?.QuoteType}
                </Cell>
                <Cell className="cell">
                  {item?.Exchange}
                </Cell>
                <Cell className="cell">
                  {item?.Status? <span className="market-status"><LuDot size={35} color="green" /> OPEN</span> : <span className="market-status"><LuDot size={35} color="red"/>CLOSED</span>}
                </Cell>
              </Row>
             ))}
             </Body>
          </>
        )}
      </Table>  
    )
}

export default WatchListTable;
