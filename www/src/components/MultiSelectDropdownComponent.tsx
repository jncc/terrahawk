import dropdown from './dropdown.png';
import './MultiSelectDropdown.css';
import React from 'react'

type Option = {
    id: number
    title: string
}

function toggleOptionsDisplayed () {
    var currentStyle = getComputedStyle(document.documentElement).getPropertyValue('--options-display');
    document.documentElement.style.setProperty('--options-display', currentStyle === 'block' ? 'none' : 'block');
 }

function apply (applyFunction: Function) {
    document.documentElement.style.setProperty('--options-display', 'none');
    applyFunction()
 }

export let MultiSelectDropdown = (props: {options: Array<Option>, selected: Array<number>, toggleOption: Function, applyFunction: Function}) => {

    return (
          <div className="c-multi-select-dropdown">
          <div className="h-9 p-1 w-full border-2 border-gray-300 text-gray-900 rounded-lg custom-ring c-multi-select-dropdown__selected">      
              <div>{props.selected.length} selected</div>   
              <button type="button" className="c-multi-select-dropdown__button" onClick={() => apply ( props.applyFunction)}>Apply</button>
              <img src={dropdown} onClick={() => toggleOptionsDisplayed ()}/>
          </div>
          <ul className="c-multi-select-dropdown__options">
              {props.options.map(option => {
                  const isSelected = props.selected.includes(option.id);
                  return (
                      <li key={option.id} onClick={() => props.toggleOption(option.id)}>
                          <input type="checkbox" checked={isSelected} readOnly></input>
                          <span>{option.title}</span>
                      </li>
                  )
              })}
          </ul>
      </div>
    )
} 