/* eslint-disable react/jsx-key */
import React, { useState } from 'react'
import CreateGame from './CreateGame'
import SearchGame from './SearchGame'
import CodeJoin from './CodeJoin'
import './Game.scss'



function NewGame() {

    const [type, setType] = useState('join')

    const style = {
        'border-bottom': '#fff 1px solid'
    }

    return (
        <div>
            <div className='new-game-nav fr jc-c ai-c'>
                <div className='game-nav-choices fr ai-c jc-s'>
                    <button style={type == 'create' ? style : null} onClick={() => setType('create')} className='game-nav-choice ai-c'>
                        <div className='tpy spx'>Create</div>
                    </button>
                    <button style={type == 'join' ? style : null} onClick={() => setType('join')} className='game-nav-choice ai-c'>
                        <div className='tpy spx'>Search</div>
                    </button>
                    <button style={type == 'code' ? style : null} onClick={() => setType('code')} className='game-nav-choice ai-c'>
                        <div className='tpy spx'>Code</div>
                    </button>
                </div>            
            </div>
            {type == 'join' ? <SearchGame /> :
                <div className="smx hmt">            
                    {type == 'create' ? <CreateGame/> : <CodeJoin />}
                </div>            
            }
            
        </div>
    )
}

export default (NewGame)