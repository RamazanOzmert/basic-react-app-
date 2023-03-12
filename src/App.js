import './App.css';
import {ChartProvider} from './context/ChartContext'
import Weather from './companents/weather'
import React from 'react';
function App() {
  return (
    <div className="App">
          <ChartProvider>
                <Weather/>
          </ChartProvider>
    </div>
  );
}

export default App;
