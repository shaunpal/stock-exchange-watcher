import React from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import SandSignika from 'highcharts/themes/sand-signika'


function WatchListChartLight({options}){
    SandSignika(Highcharts)
    return (
        <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={options}
        />
    );
}

export default WatchListChartLight;