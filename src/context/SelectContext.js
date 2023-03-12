import { createContext, useContext, useState } from "react";

const SelectContext = createContext()

export const SelectProvider = ({children})=>{
    const [select,setSelect] = useState(0)
    
    const values = {select,setSelect}
    return<SelectContext.Provider value={values}>
        {children}
    </SelectContext.Provider>
}

export const useSelect =()=>useContext(SelectContext)