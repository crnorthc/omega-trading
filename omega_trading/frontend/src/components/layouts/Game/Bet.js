/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, {useState} from 'react'
import { createGame, editGame, joinGame } from '../../../actions/game'
import './Rules.scss'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'



function Bet(props) {
    const [quantity, setQuantity] = useState(null)
    const [crypto, setCrypto] = useState('eth')

    Bet.propTypes = {
    }

    const selected = {
        'background-color': 'rgb(175, 175, 175)'
    }

    const setQuan = (e) => {
        if (e.length >= 6) {
            setQuantity(Number(e))
        }
    }

    const quote = (amount, ether) => {
        if (ether) {
            return (amount * props.etherQuote['quote'])
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        } else {
            return (amount * props.etherQuote['quote'])
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
    }

    return (
        <div className='bet-box'>
            <div className="bet-page">
                <div className='fr bb'>
                    <button style={crypto == 'eth' ? selected : null} onClick={() => setCrypto('eth')} className='crypto-choice st br ai-c'>ETH</button>
                    <button style={crypto == 'btc' ? selected : null} onClick={() => setCrypto('btc')}  className='crypto-choice st ai-c'>BTC</button>
                </div>
                <div className="contract-input bb fr ai-c jc-s">
                    <div className="f16 bld">Bet</div>
                    <div className="fr ai-c jc-s">
                        <input
                            className="amountInput"
                            onChange={(e) => setQuan(e.target.value)}
                            placeholder="$0.00"
                            type="number"
                        />
                    </div>
                </div>
                <div className="fr ai-c jc-s mmy smx mt">
                    <div className="fr">
                        <div className="of">{quantity == null ? '0' : (quantity / 1000000000).toFixed(4)}</div>
                        <div className="bld tml">ETH</div>
                    </div>
                    <div className="fr">
                        <div className="of">${quantity == null ? '0.00' : quote(quantity / 10 ** 9, true)}</div>
                        <div className="bld tml">USD</div>
                    </div>
                </div>
                <div className="contract-btn f jc-c">
                    <button onClick={() => props.show()} className="editButton">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {})(Bet)