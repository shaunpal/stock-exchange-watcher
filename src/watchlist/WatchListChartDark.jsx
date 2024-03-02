import React from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official';
import DarkUnica from 'highcharts/themes/dark-unica';


function WatchListChartDark({options}){
    DarkUnica(Highcharts)
    return (
        <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={options}
        />
    );
}

export default WatchListChartDark;