import React, { useState } from 'react'
import { startGame, getEtherQuote, defineContract } from '../../actions/game'
import Crypto from './Crypto'
import Friends from './Friends'
import Rules from './Rules'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

function Pregame(props) {
    const [message, setMessage] = useState('Start Game')
    const [quantity, setQuantity] = useState(null)
    const [totalQuantity, setTotalQuantity] = useState(null)
    const [crypto, setCrypto] = useState(false)
    const [drop, setDrop] = useState(false)

    Pregame.propTypes = {
        startGame: PropTypes.func.isRequired,
        getEtherQuote: PropTypes.func.isRequired,
        defineContract: PropTypes.func.isRequired,
        game: PropTypes.object,
        user: PropTypes.object,
        etherQuote: PropTypes.number,
        gasQuote: PropTypes.number,
    }

    if (props.etherQuote == null) {
        props.getEtherQuote()
    }

    const determineDrop = () => {
        if (drop) {
            setDrop(false)
        } else {
            setDrop(true)
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

    const setQuan = (e) => {
        if (e.length >= 6) {
            setQuantity(Number(e))
        }
    }

    const actionbox = (isHost) => {
        const hostView = (
            <div className="smx">
                <div className="contract-input bb fr ai-c jc-s">
                    <div className="f16 bld">Bet</div>
                    <div className="fr ai-c jc-s">
                        <input
                            className="amountInput-contract f14"
                            onChange={(e) => setQuan(e.target.value)}
                            placeholder="0"
                            type="number"
                            min="5000"
                        />
                        <div className="f14 bld tml">Gwei</div>
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
                    <button onClick={(e) => setCrypto(true)} className="editButton">
                        Confirm
                    </button>
                </div>
            </div>
        )

        const playerView = <div className="smx f ai-c jc-c f16 lt">Ask the host to create an E-Bet</div>

        const betMade = () => {
            return (
                <div className="smx">
                    <div className="contract-input fr ai-c jc-s">
                        <div className="f16 bld">Bet</div>
                        <div className="fr f14 ai-c jc-s">
                            <div>{(props.game.contract.bet / 10 ** 9).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                            <div className="bld tml">Gwei</div>
                        </div>
                    </div>
                    <div className="contract-input fr ai-c jc-s">
                        <div className="fr ai-c">
                            <div className="f16 bld">Gas Fee</div>
                            <button onClick={(e) => determineDrop()} className="info smt bld tml">
                                ?
                            </button>
                        </div>
                        <div className="fr ai-b">
                            <div className="f16">
                                {(props.game.contract.fee / 10 ** 9 / Object.keys(props.game.players).length)
                                    .toFixed(0)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </div>
                            <div className="f14 bld tml">Gwei</div>
                        </div>
                    </div>
                    <div className="contract-input bb fr ai-c jc-s">
                        <div className="f16 bld">Total</div>
                        <div className="fr ai-b">
                            <div className="f16">
                                {((props.game.contract.bet + props.game.contract.fee / Object.keys(props.game.players).length) / 1000000000)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </div>
                            <div className="f14 bld tml">Gwei</div>
                        </div>
                    </div>
                    <div className="fr ai-c jc-s mmy smx mt">
                        <div className="fr">
                            <div className="of">{((props.game.contract.bet + props.game.contract.fee) / 10 ** 18).toFixed(4)}</div>
                            <div className="bld tml">ETH</div>
                        </div>
                        <div className="fr">
                            <div className="of">${quote((props.game.contract.bet + props.game.contract.fee) / 10 ** 18, true)}</div>
                            <div className="bld tml">USD</div>
                        </div>
                    </div>
                    {drop ? <div className="helper-info smt lt">Cost of transactions split between players</div> : null}
                </div>
            )
        }

        return (
            <div className="action-box-contract b">
                <div className="contract-header h63 bb fc ai-c jc-c">
                    <h4 className="f jc-c">Smart Contract</h4>
                    {props.etherQuote == null ? null : (
                        <div className="etherQuote fr ai-b jc-s">
                            <div className="smt">ETH:</div>
                            <div className="tml smt">
                                $
                                {props.etherQuote['quote']
                                    .toFixed(2)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </div>
                            <div className="tt lt tml">as of{props.etherQuote['time']}</div>
                        </div>
                    )}
                </div>
                {Object.keys(props.game.contract).length > 0 ? betMade() : isHost ? hostView : playerView}
            </div>
        )
    }

    return (
        <div className="pageContainer">
            <div className="fr">
                <div className="startup-pregame b">
                    <div className="fr bb ai-c jc-s">
                        <div className="pregame-title fr ai-c">
                            <h2>Game</h2>
                            <h3 className="room-code">#{props.game.room_code}</h3>
                        </div>
                        <div className="pregame-title fr ai-c">
                            <h2>Host</h2>
                            <h3 className="host">@{props.game.host.username}</h3>
                        </div>
                    </div>
                    <Rules edit={true} />
                </div>
                {props.etherQuote == null ? (
                    <div
                        className="loaderContainer f ai-c jc-c"
                        style={{
                            height: '306px',
                            width: '676px',
                            display: 'flex',
                            'align-items': 'center',
                            'justify-content': 'center',
                        }}
                    >
                        <div className="loader"></div>
                    </div>
                ) : (
                    actionbox(props.game.host.username == props.user.username)
                )}
            </div>

            <div className="mmy b">
                <div>
                    <Friends friendsOnly={true} />
                </div>
                <div className="startgame-section fc ai-c jc-c">
                    {Object.keys(props.game.players).length == 1 ? (
                        <div className="work fc ai-c jc-c">
                            <button className="editButtonHidden">Start</button>
                            <div className="noAction">There needs to be atleast two players to start a game</div>
                        </div>
                    ) : props.game.host.username == props.user.username ? (
                        <div className="work fc ai-c jc-c">
                            <button onClick={(e) => props.startGame(Object.keys(props.game.contract).length == 0)} className="editButton">
                                Start
                            </button>
                            <div className="noAction">{message}</div>
                        </div>
                    ) : (
                        <div className="work fc ai-c jc-c">
                            <button className="editButtonHidden">Start</button>
                            <div className="noAction">Wait for the host to start the game</div>
                        </div>
                    )}
                </div>
            </div>
            {crypto ? <Crypto value={totalQuantity * 1000000000} bet={quantity * 1000000000} create={true} /> : null}
        </div>
    )
}

const mapStateToProps = (state) => ({
    game: state.game.game,
    user: state.user.user,
    etherQuote: state.game.etherQuote,
    gasQuote: state.game.gasQuote,
})

export default connect(mapStateToProps, {
    startGame,
    getEtherQuote,
    defineContract,
})(Pregame)
