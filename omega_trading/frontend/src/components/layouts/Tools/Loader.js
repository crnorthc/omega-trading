/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React from 'react'

function Loader(props) {
    if (props.page) {
        return (
            <div className='pageContainer f fr ai-c jc-c'>
                <div className="loader"></div>
            </div>
        )
    }
    else {
        return (
            <div className="loaderContainer f ai-c jc-c" style={
                {
                    'height': props.height + 'px',
                    'width': props.width + 'px',
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center'
                }
            }>
                <div className="loader"></div>
            </div>
        )
    }    
}

export default (Loader)