import { DEFAULT_OPTIONS, getTheme } from '@table-library/react-table-library/material-ui';
export const materialTheme = getTheme(DEFAULT_OPTIONS);


export const changeColor = (value) => {
  if (parseFloat(value) < 0){
    return 'down flash-down'
  }
  return 'up flash-up'
}

export const convertDateString = (time) => {
  return new Date(time*1000)
              .toLocaleDateString('en-SG', { month: 'short', day: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: true })
}

export const DEFAULT_EMPTY_NODES = { nodes: [] }
export const DEFAULT_PAYLOAD = [
  {
      "operator": "GT",
      "operands": [
          "percentchange",
          3
      ]
  },
  {
      "operator": "eq",
      "operands": [
          "region",
          "us"
      ]
  },
  {
      "operator": "or",
      "operands": [
          {
              "operator": "BTWN",
              "operands": [
                  "intradaymarketcap",
                  2000000000,
                  10000000000
              ]
          },
          {
              "operator": "GT",
              "operands": [
                  "intradaymarketcap",
                  100000000000
              ]
          },
          {
              "operator": "BTWN",
              "operands": [
                  "intradaymarketcap",
                  10000000000,
                  100000000000
              ]
          }
      ]
  },
  {
      "operator": "gte",
      "operands": [
          "intradayprice",
          5
      ]
  },
  {
      "operator": "gt",
      "operands": [
          "dayvolume",
          15000
      ]
  }
]

export const TOP20GAINERS_SORT = {
    TASK: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
    DEADLINE: (array) => array.sort((a, b) => a.deadline - b.deadline),
    TYPE: (array) => array.sort((a, b) => a.type.localeCompare(b.type)),
    COMPLETE: (array) => array.sort((a, b) => a.isComplete - b.isComplete),
    TASKS: (array) => array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
}

export const TOP20GAINERS_COLUMNS = [
  { label: 'Name', renderCell: (item) => item?.longName? item.longName : item.shortName},
  { label: 'Price (intraday)', renderCell: (item) => "+"+item?.regularMarketPrice?.fmt},
  { label: 'Change', renderCell: (item) => "+"+item?.regularMarketChange?.fmt },
  { label: '%Change', renderCell: (item) => item?.regularMarketChangePercent?.fmt },
  { label: 'Vol', renderCell: (item) => item?.regularMarketVolume?.fmt },
  { label: 'Avg 3mths', renderCell: (item) => item?.averageDailyVolume3Month?.fmt },
  { label: 'MarketCap.', renderCell: (item) => item?.marketCap? item?.marketCap?.fmt : "-" },
  { label: 'Exchange', renderCell: (item) => item?.exchange },
];

export const WATCHLIST_COLUMNS = [
  { label: 'Symbol', renderCell: (item) => item?.Symbol },
  { label: 'Company', renderCell: (item) => item?.Company},
  { label: 'Price (intraday)', renderCell: (item) => "+"+item['Open'],},
  { label: 'Change', renderCell: (item) => "+"+item['Open'] },
  { label: '%Change', renderCell: (item) => item['Open'] },
  { label: 'Vol', renderCell: (item) => item?.Volume },
  { label: 'Avg. Vol', renderCell: (item) => item['Avg. volume']},
  { label: 'MarketCap.', renderCell: (item) => item['Market cap'] },
  { label: 'Instrument', renderCell: (item) => item?.QuoteType },
  { label: 'Exchange', renderCell: (item) => item?.Exchange },
];

export const CRYPTO_TABLE_SORT = {
  sortFns: {
    "Price (intraday)": (array) => array.sort((a, b) => parseFloat(a.regularMarketPrice) - parseFloat(b.regularMarketPrice)),
    Change: (array) => array.sort((a, b) => Number(a.regularMarketChange) - Number(b.regularMarketChange)),
    "%Change": (array) => array.sort((a, b) => Number(a.regularMarketChangePercent) - Number(b.regularMarketChangePercent)),
    Vol: (array) => array.sort((a, b) => Number(a.regularMarketVolume) - Number(b.regularMarketVolume)),
    "Daily 3Mths Vol.": (array) => array.sort((a, b) => Number(a.averageDailyVolume3Month) - Number(b.averageDailyVolume3Month)),
    MarketCap: (array) => array.sort((a, b) => Number(a.marketCap) - Number(b.marketCap)),
  },
}

export function populatePayload(payload, selectTag, inputFirst, inputSecond){
  let type = selectTag.id
  let value = selectTag.value
  switch(type){
      case 'region': 
          payload.region = {
              operator: "eq",
              operands: [type, value]
          }
      
      break;
      case 'percentchange': 
          if(inputSecond){
              payload.pricePercentage = {
                  operator: value,
                  operands: [type, Number(inputFirst.value), Number(inputSecond.value)]
              };
          } else {
              payload.pricePercentage = {
                  operator: value,
                  operands: [type, Number(inputFirst.value)]
              };
          }
      
      break;
      case 'intradaypricechange': 
          if(inputSecond){
              payload.price = {
                  operator: value,
                  operands: [type, Number(inputFirst.value), Number(inputSecond.value)]
              };
          } else {
              payload.price = {
                  operator: value,
                  operands: [type, Number(inputFirst.value)]
              };
          }
      
      break;
      case 'dayvolume':
          if(inputSecond){
              payload.volume = {
                  operator: value,
                  operands: [type, Number(inputFirst.value), Number(inputSecond.value)]
              };
          } else {
              payload.volume = {
                  operator: value,
                  operands: [type, Number(inputFirst.value)]
              };
          }
      
      break;
      default:
          break;
  }
}

export const TABLE_THEME_CONFIG = {
  BaseCell: `
    &:nth-of-type(3), &:nth-of-type(4) {
      color: green;
      font-weight: bold;
    }
    &.th:nth-of-type(3), &.th:nth-of-type(4) {
        color: black;
    }
  `,
  Row: `
    &:hover {
        background-color: #e8e8e8
    }
  `,
  HeaderRow: `
    background-color: #eaf5fd
    color: black !important
  `,
}

export function filteredMessage(_payload){
  let message = [];

  _payload.forEach(obj => {
    let _msg = []
    _msg.push(operandName(obj?.operands[0]))
      if (typeof obj?.operands[1] !== 'object' && obj?.operands.length > 2){
        _msg.push(operatorString(obj.operator))
        _msg.push(`${obj?.operands[1]} and ${obj?.operands[2]};`)
      }  else if (typeof obj?.operands[1] !== 'object') {
        _msg.push(operatorString(obj.operator))
        _msg.push(valueMapping(`${obj?.operands[1]}`)+";")
      }
      if(_msg.length > 1){
        message.push(_msg)
      }
  })
  return message
}

function operatorString(_operator){
  let name = _operator.toLowerCase()
   switch(name){
    case 'btwn': return "Between "
    case 'lt': return "Less Than "
    case 'gt': return "Greater Than "
    case 'gte': return "Greater Than "
    default: return ""
   }
}

function operandName(_operand){
  if (typeof _operand === 'string') {
    let name = _operand.toLowerCase()
   switch(name){
    case 'percentchange': return " % Change: "
    case 'region': return " Region: "
    case 'intradayprice': return " Price (IntraDay): "
    case 'dayvolume': return " Volume: "
    default: return ""
   }
  }
  return ""
}

function mappingCountries(_country){
  switch(_country){
    case 'us': return "United States"
    case 'sg': return "Singapore"
    default: return ""
  }
}

function valueMapping(_data){
  var regex = /^[a-zA-Z]+$/g
  if(regex.test(_data)){
    return mappingCountries(_data)
  }
  return _data
}

export const LIGHT_TABLE_THEME = {
  BaseCell: `
  &:nth-of-type(3), &:nth-of-type(4) {
    color: green;
    font-weight: bold;
  }
  &.th:nth-of-type(3), &.th:nth-of-type(4) {
      color: black;
  }
`,
Row: `
  &:hover {
      background-color: #e8e8e8;
  }
`
}

export const DARK_TABLE_THEME = {
  BaseCell: `
  & {
      background-color: #333;
      color: #fff;
  }
  &:nth-of-type(3), &:nth-of-type(4) {
    color: green;
    font-weight: bold;
  }
  &.th:nth-of-type(3), &.th:nth-of-type(4) {
      color: #fff;
  }
`,
Row: `
  & {
      background-color: #333;
      color: #fff;
  }
  &:hover {
      background-color: #e8e8e8;
  }
`
}

export const LIGHT_CRYPTO_TABLE_THEME = {
  BaseCell: `
  &:nth-of-type(3), &:nth-of-type(4), &:nth-of-type(5) {
    font-weight: bold;
  }
  &.th:nth-of-type(3), &.th:nth-of-type(4), &:nth-of-type(4) {
      color: black;
  }
`,
Row: `
  &:hover {
      background-color: #e8e8e8;
  }
`
}

export const LIGHT_WATCHLIST_TABLE_THEME = {
  Row: `
    &:hover {
        background-color: #e8e8e8;
    }
  `
  }
  
  export const DARK_WATCHLIST_TABLE_THEME = {
    BaseCell: `
    & {
        background-color: #333;
        color: #fff;
  `,
  Row: `
    & {
        background-color: #333;
        color: #fff;
    }
    &:hover {
        background-color: #e8e8e8;
    }
  `
  }

export const DARK_CRYPTO_TABLE_THEME = {
  BaseCell: `
  & {
      background-color: #333;
      color: #fff;
  }
  &:nth-of-type(3), &:nth-of-type(4), &:nth-of-type(5) {
    font-weight: bold;
  }
  &.th:nth-of-type(3), &.th:nth-of-type(4), &:nth-of-type(5) {
      color: #fff;
  }
`,
Row: `
  & {
      background-color: #333;
      color: #fff;
  }
  &:hover {
      background-color: #e8e8e8;
  }
`
}
