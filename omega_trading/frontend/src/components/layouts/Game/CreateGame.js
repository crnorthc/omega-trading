/* eslint-disable react/jsx-key */
import React, { useState } from 'react'
import NewNewRules from './NewNewRules'
import SearchGame from './SearchGame'



function CreateGame() {

    const [type, setType] = useState('create')

    const style = {
        'background-color': 'rgb(202, 202, 202)'
    }

    return (
        <div className="smx hmt b">
            <div className='bb fr ai-c'>
                <button style={type == 'create' ? style : null} onClick={() => setType('create')} className='create-game st br ai-c'>Create a Game</button>
                <button style={type == 'join' ? style : null} onClick={() => setType('join')} className='join-game st ai-c'>Join a Game</button>
            </div>
            {type == 'create' ? <NewNewRules/> : <SearchGame />}
        </div>
    )
}

export default (CreateGame)