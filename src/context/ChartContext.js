import React,{ createContext, useContext, useState } from "react";

const ChartContext = createContext()

export const ChartProvider = ({children})=>{
    const [chart,setChart] = useState([])
    const [select,setSelect] = useState(0)
    
    const values = {chart,setChart, select,setSelect}
    return<ChartContext.Provider value={values}>
        {children}
    </ChartContext.Provider>
}

export const useChart =()=>useContext(ChartContext)