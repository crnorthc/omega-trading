/* eslint-disable no-undef */
import React, { useState } from 'react'
import Loader from '../Tools/Loader'
import './Account.scss'
import '../../../custom.scss'
import '../../../variables.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadWallets } from '../../../actions/user'

const coins = ['BTC', 'ETH', 'LTC', 'BNB']

function Wallets(props) {
    const [coin, setCoin] = useState(coins[0])

    Wallets.propTypes = {
        loadWallets: PropTypes.func.isRequired,
        wallets: PropTypes.bool
    }

    const selected = {
        'background-color': '#535564'
    }

    const coinBalance = (coin) => {
        return (
            <div className='mmy fc ai-c jc-s'>
                <div className='fr ai-c jc-s'>
                    <div className='f22 bld text-yel'>Address:</div>
                    <div className='address mml f22 sp'>{props.wallets[coin].address}</div>
                </div>        
                <div className='fr ai-c jc-s'>
                    <div className='f22 bld text-yel'>Balance:</div>
                    <div className='f22 text-yel mml f22 sp'>{props.wallets[coin].balance.toFixed(3) + ' ' + coin}</div>
                </div>        
            </div>
        )
    }


    if (props.wallets === null) {
        props.loadWallets()
        return <Loader page={true}/>
    }    
    else {
        return (
            <div className='wallets'>
                <div className='wallet-box fc ai-c b'>
                    <div className='fr jc-s ai-c bb'>
                        <button style={coin == 'BTC' ? selected : null} className='coin-choice spy fr ai-c jc-c f32 text-yel bld br' onClick={() => setCoin('BTC')}>BTC</button>
                        <button style={coin == 'ETH' ? selected : null} className='coin-choice spy fr ai-c jc-c f32 text-yel bld br' onClick={() => setCoin('ETH')}>ETH</button>
                        <button style={coin == 'LTC' ? selected : null} className='coin-choice spy fr ai-c jc-c f32 text-yel bld br' onClick={() => setCoin('LTC')}>LTC</button>
                        <button style={coin == 'BNB' ? selected : null} className='coin-choice spy fr ai-c jc-c f32 text-yel bld' onClick={() => setCoin('BNB')}>BNB</button>
                    </div>
                    {coinBalance(coin)}                    
                </div>
            </div>
        )   
    }
}

const mapStateToProps = state => ({
    wallets: state.user.wallets
})

export default connect(mapStateToProps, { loadWallets })(Wallets)