import React, { useEffect, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'

type Option = {
    id: number
    title: string
}

function ensureSelectAllConformity(totalOptions: number, totalSelected: number){
    var selectAll = document.getElementById('selectAllCheckbox') as HTMLInputElement
    if (totalOptions === totalSelected) {
        selectAll.checked = true
    } else {
        selectAll.checked = false
    }
}

export let MultiSelectDropdown = 
    (props: {options: Array<Option>, selected: Array<number>, toggleItemFunction: Function, toggleAllFunction: Function}) => {
    const [isOptionsDisplayed, setOptionsDisplayed] = useState(false)

    function toggleOptionsDisplayed(){
        setOptionsDisplayed(!isOptionsDisplayed)
    }

    useEffect(() => {
        ensureSelectAllConformity(props.options.length, props.selected.length)
    }, [props.selected])
    
    return (
        <div className="relative">
            <div className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring bg-gray-100 flex justify-between"
                onClick={() => toggleOptionsDisplayed ()}>      
                <div>{props.selected.length} selected</div> 
                <button className="right-0 mr-0">
                    <ChevronDownIcon className="h-5 w-5"/>
                </button>
            </div>
            <div className={isOptionsDisplayed ? 'block' : 'hidden'}>
                <ul className="p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring bg-gray-50 overflow-y-scroll c-multi-select-dropdown__options">
                    <li key="0" onClick={() => props.toggleAllFunction((document.getElementById('selectAllCheckbox') as HTMLInputElement).checked)}>
                        <input id="selectAllCheckbox" type="checkbox" readOnly></input>
                        <span className="ml-1">Select All</span>
                    </li>   
                    {props.options.map(option => {
                        const isSelected = props.selected.includes(option.id)
                        return (
                            <li key={option.id} onClick={() => props.toggleItemFunction(option.id)}>
                                <input type="checkbox" checked={isSelected} readOnly></input>
                                <span className="ml-1">{option.title}</span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}
