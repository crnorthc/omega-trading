/* eslint-disable react/prop-types */
import React from 'react'
import onClickOutside from 'react-onclickoutside'



function Dropdown(props) {
    Dropdown.handleClickOutside = () => props.dropChange()
    return (
        <div>
            {props.button}
            {props.drop ? 
                props.menu
                : <div style={{'display': 'None'}}>{props.menu}</div>}
        </div>
    )  
}

const clickOutsideConfig = {
    handleClickOutside: () => Dropdown.handleClickOutside
}

export default onClickOutside(Dropdown, clickOutsideConfig)