import React from "react";
import './cryptolist.css'
import {
    Table,
    Header,
    HeaderRow,
    Body,
    Row,
    HeaderCell,
    Cell,
  } from "@table-library/react-table-library/table";
  import {
    useSort,
    HeaderCellSort,
  } from "@table-library/react-table-library/sort";
import { useTheme } from '@table-library/react-table-library/theme';
import { CRYPTO_TABLE_SORT, DARK_CRYPTO_TABLE_THEME, LIGHT_CRYPTO_TABLE_THEME } from "../utils";

function checkNegativePositiveValue(val){
    if (val.toString().includes("-")){
        return "red"
    }
    return "green"
}

function CryptoListTable({
  data,
  images,
  modeTheme,
}){ 
    const sort = useSort(
        data,
        {},
        CRYPTO_TABLE_SORT
      );
    const theme = useTheme(modeTheme === 'light'? LIGHT_CRYPTO_TABLE_THEME : DARK_CRYPTO_TABLE_THEME);
    return (
        <Table className="crypto-list-table" data={data} theme={theme} sort={sort} layout={{ isDiv: true, fixedHeader: true }}>
            {(tableList) => (
            <>
          <Header>
              <HeaderRow>
                <HeaderCell className="header">Symbol</HeaderCell>
                <HeaderCell className="header">Name</HeaderCell>
                <HeaderCellSort sortKey="Price (IntraDay)" className="header">Price (IntraDay)</HeaderCellSort>
                <HeaderCellSort sortKey="Change" className="header">Change</HeaderCellSort>
                <HeaderCellSort sortKey="%Change" className="header">%Change</HeaderCellSort>
                <HeaderCellSort sortKey="Vol" className="header">Vol</HeaderCellSort>
                <HeaderCellSort sortKey="Daily 3Mths Vol." className="header">Daily 3Mths Vol.</HeaderCellSort>
                <HeaderCellSort sortKey="MarketCap" className="header">MarketCap.</HeaderCellSort>
                <HeaderCell className="header">Exchange</HeaderCell>
              </HeaderRow>
             </Header>
            <Body>
            {tableList.map((item, index) => (
              <Row key={index} item={item}>
                <Cell className="cell">
                  {images? 
                  <div className="crypto-symbols"><img className="crypto-images" alt={item?.symbol} src={item?.longName? images[item?.longName] : images[item?.shortName]} />{item?.symbol}</div>
                :
                 <span>{item.symbol}</span>
                }
                </Cell>
                <Cell className="cell crypto-name">
                  {item?.longName? item.longName : item.shortName}
                </Cell>
                <Cell className="cell">
                  {item?.regularMarketPrice}
                </Cell>
                <Cell className="cell" style={{ color: checkNegativePositiveValue(item?.regularMarketChange) }}>
                  {item?.regularMarketChange}
                </Cell>
                <Cell className="cell" style={{ color: checkNegativePositiveValue(item?.regularMarketChange) }}>
                  {item?.regularMarketChangePercent}
                </Cell>
                <Cell className="cell">
                  {Number(item?.regularMarketVolume).toLocaleString("en-US")}
                </Cell>
                <Cell className="cell">
                  {Number(item?.averageDailyVolume3Month).toLocaleString("en-US")}
                </Cell>
                <Cell className="cell">
                  {item?.marketCap? Number(item?.marketCap).toLocaleString("en-US") : "-"}
                </Cell>
                <Cell className="cell">
                  {item?.exchange}
                </Cell>
              </Row>
             ))}
             </Body>
          </>
        )}
      </Table>  
    )
}

export default CryptoListTable;
