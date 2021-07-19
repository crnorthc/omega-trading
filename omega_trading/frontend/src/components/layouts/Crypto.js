import React, { useState } from "react";

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { defineContract, makeBet, getGasQuote, getEtherQuote } from "../../actions/game";

function Crypto(props) {
    const [address, setAddress] = useState(null);
    const [key, setKey] = useState(null);
    const [drop, setDrop] = useState(false);
    const [confirmed, confirm] = useState(false);

    Crypto.propTypes = {
        defineContract: PropTypes.func.isRequired,
        makeBet: PropTypes.func.isRequired,
        getEtherQuote: PropTypes.func.isRequired,
        getGasQuote: PropTypes.func.isRequired,
        etherQuote: PropTypes.number,
        gasQuote: PropTypes.number,
        game: PropTypes.object,
        user: PropTypes.object,
    };

    if (Object.keys(props.game.contract).length !== 0 && props.create) {
        if (props.user.username in props.game.contract.players) {
            window.location.reload();
        }
    } else {
        if (props.game.contract.players[props.user.username].payed) {
            window.location.reload();
        }
    }

    if (props.gasQuote == null) {
        props.getGasQuote();
    }

    if (props.etherQuote == null) {
        props.getEtherQuote();
    }

    const onSubmit = () => {
        if (props.create) {
            props.defineContract(address, props.bet);
        } else {
            props.makeBet(address, key, props.game.room_code);
        }
    };

    const determineDrop = () => {
        if (drop) {
            setDrop(false);
        } else {
            setDrop(true);
        }
    };

    const betInfo = () => {
        if (props.gasQuote == null || props.etherQuote == null) {
            return (
                <div className="crypto-container f ai-c jc-c">
                    <div
                        className="loaderContainer f ai-c jc-c"
                        style={{
                            height: "375px",
                            width: "625px",
                            display: "flex",
                            "align-items": "center",
                            "justify-content": "center",
                        }}
                    >
                        <div class="loader"></div>
                    </div>
                </div>
            );
        } else {
            var total_ether = (props.gasQuote / Object.keys(props.game.players).length + props.bet) / 1000000000;
            return (
                <div className="crypto-container fr ai-c jc-c">
                    <div className="crypto-page fc  ai-c jc-c">
                        <div className="confirmation">
                            <div className="fr jc-c">
                                <div className="f32 bld f ai-c">E-Bet</div>
                            </div>
                            <div className="fr mmt ai-c jc-s">
                                <div className="f16 bld">Bet</div>
                                <div className="fr ai-b">
                                    <div className="f16">{(props.bet / 1000000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                    <div className="f14 bld tml">Gwei</div>
                                </div>
                            </div>
                            <div className="mmy fr ai-c jc-s">
                                <div className="fr ai-c">
                                    <div className="f16 bld">Gas Fee</div>
                                    <button onClick={(e) => determineDrop()} className="info smt bld tml">
                                        ?
                                    </button>
                                </div>
                                <div className="fr ai-b">
                                    <div className="f16">
                                        {(props.gasQuote / 1000000000 / Object.keys(props.game.players).length)
                                            .toFixed(0)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </div>
                                    <div className="f14 bld tml">Gwei</div>
                                </div>
                            </div>
                            {drop ? <div className="helper-info smt lt">Cost of transactions split between players</div> : null}
                            <div className="fr mmy ai-c jc-s">
                                <div className="f16 bld">Total</div>
                                <div className="fr ai-b">
                                    <div className="f16">
                                        {((props.bet + props.gasQuote / Object.keys(props.game.players).length) / 1000000000)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </div>
                                    <div className="f14 bld tml">Gwei</div>
                                </div>
                            </div>
                            <div className="mpt fr bt ai-c jc-s">
                                <div className="fr">
                                    <div className="of">{(total_ether / 1000000000).toFixed(4)}</div>
                                    <div className="bld tml">ETH</div>
                                </div>
                                <div className="fr">
                                    <div className="of">
                                        $
                                        {((total_ether / 1000000000) * props.etherQuote.quote)
                                            .toFixed(2)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </div>
                                    <div className="bld tml">USD</div>
                                </div>
                            </div>
                            <div className="etherQuote fr ai-c jc-c">
                                <div className="smt">ETH:</div>
                                <div className="tml smt">
                                    $
                                    {props.etherQuote["quote"]
                                        .toFixed(2)
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </div>
                                <div className="tt lt tml">as of{props.etherQuote["time"]}</div>
                            </div>
                        </div>
                        <div className="fr jc-c">
                            <button onClick={(e) => confirm(true)} className="editButton mmy">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    };

    if (confirmed) {
        if (props.create) {
            return (
                <div className="crypto-container f ai-c jc-c">
                    <div className="crypto-page fc ai-c jc-c">
                        <h1 className="crypto-title">Reserve Your Bet</h1>
                        <div className="crypto-login  fc ai-c jc-c">
                            <input
                                className="crypto-input mmy"
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Wallet Address"
                                type="text"
                            />
                            <button onClick={onSubmit} className="editButton mmy">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="crypto-container f ai-c jc-c">
                    <div className="crypto-page fc ai-c jc-c">
                        <h1 className="crypto-title">ETH Wallet</h1>
                        <div className="crypto-login  fc ai-c jc-c">
                            <input
                                className="crypto-input mmy"
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Wallet Address"
                                type="text"
                            />
                            <input className="crypto-input mmy" onChange={(e) => setKey(e.target.value)} placeholder="Wallet Key" type="password" />
                            <button onClick={onSubmit} className="editButton mmy">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    } else {
        return betInfo();
    }
}

const mapStateToProps = (state) => ({
    game: state.game.game,
    user: state.user.user,
    gasQuote: state.game.gasQuote,
    etherQuote: state.game.etherQuote,
});

export default connect(mapStateToProps, {
    defineContract,
    makeBet,
    getGasQuote,
    getEtherQuote,
})(Crypto);
