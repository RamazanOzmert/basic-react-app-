import React ,{useEffect,useState}from 'react'
import axios from 'axios'
import './style.css'

//media
import searchI from '../icons/search.png'
import water from '../icons/water.png'
import air from '../icons/air.png'
import thermostat from '../icons/thermostat.png'
import location from '../icons/location.png'

//Google Charts
import Charts from '../charts/charts'

//constext
import { useChart } from '../../context/ChartContext'

//list of cities of Turkey
import citys from '../dataset/citys'

function Weather() {
  const {setChart,select,setSelect}= useChart()
  const [city,setCity] = useState('İstanbul') 
  const [cityNow,setCityNow]=useState('İstanbul')
  const [myData,setDatas] = useState([]) 
  const [selectedData,setSelectedData] = useState({
    'temp':'',
    'dt_txt':'',
    'wSpeed':'',
    'wDeg':'',
    'wGust':'',
    'feels_like':'',
    'humidity':'',
    'description':'',
    'icon':'',
    }) 
  const [isLoading,setIsLoading] =useState(false) 
  const [cityU,setCityU]=useState([])
  const appId = process.env.REACT_APP_API_KEY //add your openweathermap api key
//
  useEffect(()=>{
    let cnt = false
    if (cityNow !== city){// recurring request checked
      setCityNow(city)    
      cnt =true  
    }
   if(!isLoading || cnt ){//data is only retrieved on first load and city change
      axios(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${appId}&lang=tr&units=metric`)
      .then((res)=>{
        setDatas(res.data['list']);//Got weather data from api.openweathermap.org
        })
      .catch((e)=>console.log(e))
      .finally(()=>(setIsLoading(true))
      )  
    } 
    setChartDataFun()
    selectedDataFun()
    if(!isLoading){
      setSelect(0)
    }
  },[isLoading,city,select,myData]) 
//
  function formatDate(txt) {
    var txtDate = (txt.split(' '))[0];
    let timeStamp = Date.parse(txtDate);
    var date = new Date(timeStamp);
    var months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    var days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
    var year = date.getFullYear();
    var month = months[date.getMonth()];
    var dateVal = date.getDate();
    var day =days[date.getDay()] ;
    var formattedDate = dateVal + ' ' + month + ' ' + year  ; 

    return [formattedDate,day];
  }
//
  function setChartDataFun(){
    let chartDatas  = [['saat', '', { type: 'number', role: 'annotation' }]]
    myData.forEach((item,s) => {
      if (s>10) {
        return false        
      }
      let hour =(item.dt_txt.split(' '))[1]
      hour= hour.split(':')
      hour = hour[0]+':'+hour[1]
      let temp=  Math.round(item.main.temp)
      var datas=[
       hour.toString(),
        temp,
        temp
      ]
      chartDatas.push(datas) 
    });
    setChart(chartDatas)

  }
//
   function selectedDataFun(){
    myData.forEach((data,s) => {
      if(s===select){
        let desc
        let icon
        data.weather.forEach(w => {
          desc = w.description
          icon =w.icon
        });
        let date = formatDate(data.dt_txt)
        setSelectedData({
        'temp':Math.round(data.main.temp),
        'dt_date':date[0],
        'dt_day':date[1],
        'wSpeed':data.wind.speed,
        'wDeg':data.wind.deg,
        'wGust':data.wind.gust,
        'feels_like':Math.round(data.main.feels_like),
        'humidity':data.main.humidity,
        'description':desc,
        'icon':icon, 
        })
      }
    });
  }
// 
  function updateSearch (txt){
        let word = txt.charAt(0).toLocaleUpperCase('TR') + txt.slice(1)
        if (word==='') {setCityU([])}
        else{
            setCityU([])
            let afterU=[]
            citys.forEach(c => {
                let isIn=c.search(word)  //benzeri 1, eşiti 0, yok -1
                if (isIn>-1) {
                    afterU.push(c)
                }
            })
            setCityU(afterU)
        }
  }
//
  return (
<>
 {!isLoading && <div className='Loading'>loading.. </div>}
 {isLoading&&
  <div className='body'>
    <div className='bigArea'>
      <div className='weatherArea'>
        <span className='weatherAreaImage'>
          <div>
            <p className='top'>
              <span id='day'>{selectedData.dt_day}</span>
              <span id='date'>{selectedData.dt_date}</span>
              <span id='locations'> {city}, Tr</span>
              
            </p> 
            
            <div className='bottom'>
              <img id='icon' src={selectedData.icon && `https://openweathermap.org/img/wn/${selectedData.icon}@2x.png`}/>
              <span id='temp'>{selectedData.temp} &#176;C</span>
              <span id='weather'>{(selectedData.description).toUpperCase()}</span>
              <span className='chart' id='chart' name='chart'><Charts/></span>
              
            </div>
          </div>
        </span>
      </div>
      <div className='searchArea'>
        <label className='changeLoc'>
          <input type='checkbox' id='inputCheckbox'/>
          <div className='changeLocBtn'>
            <div className='ClInput'>
              <input type='text' id='inputSearch' onChange={e=>updateSearch(e.target.value)}/> 
              <img src={searchI} alt='search'></img>
            </div>
            <div className='ClText'>
              <img src={location} alt='location'/>
            <span>Change location</span>
            </div>
          </div>
          <div className='slide'>
            {cityU&&
                <ul className="slide-list">
                    {
                    cityU.map(c=><li 
                      type='button' key={c} value={c} onClick={e=>setCity(c)}>{c}
                    </li>
                    )}
                </ul> 
            }
          </div>
        </label>
      </div>

      <div className='othersArea'>
        <div >
        <div className='humidity'><img src={water} alt='humudity'/> nem
         <b>{selectedData.humidity}%</b>
         </div>
        <div className='wind'><img src={air} alt='air'/> rüzgar 
        <b>
        <span>hız: {selectedData.wSpeed}</span>
        <span>deg: {selectedData.wDeg}</span>
        <span>gust: {selectedData.wGust}</span>
        </b>
        </div>
        <div className='felt'><img src={thermostat} alt='thermostat'/> hissedilen
         <b>{selectedData.feels_like}°C</b>
         </div>
      </div>
      </div>
    </div>
  </div>
}
</> 
  )
}

export default Weather

