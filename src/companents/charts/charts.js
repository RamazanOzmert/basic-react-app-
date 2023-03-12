import React from "react"
import { Chart } from "react-google-charts"
import { useChart } from "../../context/ChartContext"

export const options = {
  isStacked: true,
  height: 150,
  pointSize: 5,
  colors: ['#FFB60A'],
  backgroundColor: { fill:'transparent' },
  legend: { position: "top", maxLines: 3 },
  vAxis: { minValue: 0,maxValue:30, gridlines: { count: 0 }, textStyle: { fontSize: .1 } },

  hAxis:{ textStyle: { fontSize: 11,
    bold: true,
    color: 'white',   
    opacity: 0.8  }},

  annotation:{textStyle: { fontSize: 18, bold: true,}},
}


function Charts(){
  const {chart,setSelect}= useChart()
  const chartEvents = [
    {  
      eventName: "select"  ,
      callback: ({ chartWrapper }) => {
        var _chart = chartWrapper.getChart();
        var item=_chart.getSelection();//.addEventListener("click", (ev) => console.log(ev))
        try {
          var rest=item[0]['row'];
          setSelect(rest);
        } catch (error) {
          //It's not important
          console.log('!!!!',error);

        } 
      }  
    }
  ]
    return (
        <Chart
        chartType="AreaChart"
        width="100%"
        data={chart}
        options={options}
        chartEvents={chartEvents}
        
      />
    )
}
export default Charts


