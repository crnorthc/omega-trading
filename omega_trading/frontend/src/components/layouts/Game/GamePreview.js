/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import queryString from 'query-string'
import Loader from '../Tools/Loader'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { gameInfo } from '../../../actions/game'


/**************
 * props.preview = {
 *      room_code: The games room code (str),
 *      start_amount: the amount each player will start with (int),
 *      bet: the amount of fake money each player will bet (int),
 *      duration: {
 *          days: days the game will last (int),
 *          hours: hours the game will last (int),
 *          mins: minutes the game will last (int)
 *      },
 *      players: {                                      
 *          host: {                                     # Host is included in the other players
 *              username: host's username (str),        
 *              first_name: host's firstname (str),     
 *              last_name: host's lastname (str)
 *          },
 *          *username*: {
 *              first_name: user's firstname (str),     # *username* is the username of the given player
 *              last_name: user's lastname (str)
 *          },
 *          *username*: {
 *              first_name: user's firstname (str),
 *              last_name: user's lastname (str)
 *          }
 *          ...,    
 *      }
 * }
**************/

// Check out PreGame.js for basic game layout

function GamePreview(props) {
    const [code, setCode] = useState(null)
  
    GamePreview.propTypes = {
        gameInfo: PropTypes.func.isRequired,
        preview: PropTypes.object
    }

    if (code == null) {
        const values = queryString.parse(props.location.search)
        const keys = Object.keys(values)
        if (keys.length != 0) {
            setCode(values.code)
        }
    }

    if (code !== null && props.preview == null) {
        props.gameInfo(code)
    }

    if (props.preview == null) {
        return <Loader page={true} />
    }
    else {
        return (
            <div className="pageContainer">
                
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    preview: state.gameInfo.preview
})

export default connect(mapStateToProps, { gameInfo })(GamePreview)
