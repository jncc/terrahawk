import './MultiSelectDropdown.css';
import React, { useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'

type Option = {
    id: number
    title: string
}

function toggleOptionsDisplayed(){
    var currentStyle = getComputedStyle(document.documentElement).getPropertyValue('--options-display');
    document.documentElement.style.setProperty('--options-display', currentStyle === 'block' ? 'none' : 'block');
}

function ensureSelectAllConformity(totalOptions: number, totalSelected: number){
    var selectAll = document.getElementById("selectAllCheckbox") as HTMLInputElement
    if (totalOptions === totalSelected) {
        selectAll.checked = true
    } else {
        selectAll.checked = false
    }
}

export let MultiSelectDropdown = (props: {options: Array<Option>, selected: Array<number>, toggleItemFunction: Function, toggleAllFunction: Function}) => {

    useEffect(() => {
        ensureSelectAllConformity(props.options.length, props.selected.length)
    }, [props.selected])
    
    return (
        <div className="c-multi-select-dropdown">
            <div className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring bg-gray-200 c-multi-select-dropdown__selected">      
                <div>{props.selected.length} selected</div> 
                <button className="right-0 mr-0" onClick={() => toggleOptionsDisplayed ()}>
                    <ChevronDownIcon className="h-4 w-4"/>
                </button>
            </div>
            <ul className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring bg-gray-50 c-multi-select-dropdown__options">
                <li key='0' onClick={() => props.toggleAllFunction((document.getElementById("selectAllCheckbox") as HTMLInputElement).checked)}>
                    <input id="selectAllCheckbox" type="checkbox" readOnly></input>
                    <span className="c-multi-select-dropdown__option">Select All</span>
                </li>   
                {props.options.map(option => {
                    const isSelected = props.selected.includes(option.id);
                    return (
                        <li key={option.id} onClick={() => props.toggleItemFunction(option.id)}>
                            <input type="checkbox" checked={isSelected} readOnly></input>
                            <span className="c-multi-select-dropdown__option">{option.title}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
