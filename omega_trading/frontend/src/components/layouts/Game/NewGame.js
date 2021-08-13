/* eslint-disable react/jsx-key */
import React, { useState } from 'react'
import CreateGame from './CreateGame'
import SearchGame from './SearchGame'



function NewGame() {

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
            {type == 'create' ? <CreateGame/> : <SearchGame />}
        </div>
    )
}

export default (NewGame)