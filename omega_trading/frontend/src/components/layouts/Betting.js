import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Friends from "./Friends";

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import profilePic from "../../static/profilePic.png";
import { loadUser, saveHistory } from "../../actions/user.js";

function Betting(props) {
    const [username, setUsername] = useState(null);

    if (!props.isAuthenticated) {
        return <Redirect to="/login"></Redirect>;
    }

    Betting.propTypes = {
        game: PropTypes.object,
        user: PropTypes.object,
        loadUser: PropTypes.func.isRequired,
        saveHistory: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
    };

    const getPlayers = () => {
        var players = [];

        for (const player in props.game.contract.players) {
            players.push(
                <div className="smx mmy fr ai-c jc-s">
                    <div className="f16 bld">{player}</div>
                    {props.game.contract.players[player] ? (
                        <button className="editButtonHidden">Complete</button>
                    ) : player == props.user.username ? (
                        <button onClick={(e) => props.getGasQuote()} className="editButton">
                            Make Bet
                        </button>
                    ) : (
                        <button className="editButtonHidden">Pending</button>
                    )}
                </div>
            );
        }

        return players;
    };

    const players = (
        <div className="action-box-contract b">
            <div className="contract-header h63 bb fc ai-c jc-c">
                <h4 className="f jc-c">Smart Contract</h4>
            </div>
            <div className="smx fc jc-s">{getPlayers()}</div>
        </div>
    );

    const confirmed = (isHost) => {
        var total_quantity = 0;
        var current_quantity = quantity;
        var gas = 350000;

        if (isHost) {
            total_quantity = quantity + 350000 * props.gasQuote;
        } else {
            current_quantity = props.game.contract.bet / 1000000000;
            gas = 30000;
            total_quantity = current_quantity + 30000 * props.gasQuote;
        }

        if (totalQuantity == null) {
            setTotalQuantity(total_quantity);
        }

        return (
            <div className="action-box-contract b">
                <div className="contract-header h63 bb fc ai-c jc-c">
                    <h4 className="f jc-c">Smart Contract</h4>
                    <div className="etherQuote fr ai-b jc-s">
                        <div className="smt">Gas Price:</div>
                        <div className="tml smt">
                            {props.gasQuote
                                .toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </div>
                        <div className="smt bld tml">Gwei</div>
                    </div>
                </div>
                <div className="mmy mmx fr ai-c jc-s">
                    <div className="f16 bld">Bet</div>
                    <div className="fr ai-c jc-s">
                        <div className="fr">
                            <div className="f14">{current_quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                            <div className="f14 bld tml">Gwei</div>
                        </div>
                    </div>
                </div>
                <div className="mmy mmx fr ai-c jc-s">
                    <div className="f16 bld">Gas Fee</div>
                    <div className="fr ai-c jc-s">
                        <div className="fr">
                            <div className="f14">{(gas * props.gasQuote).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                            <div className="f14 bld tml">Gwei</div>
                        </div>
                    </div>
                </div>
                <div className="mpb mmt mmx bb fr ai-c jc-s">
                    <div className="f16 bld">Total</div>
                    <div className="fr ai-c jc-s">
                        <div className="fr">
                            <div className="f14">{(gas * props.gasQuote + current_quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                            <div className="f14 bld tml">Gwei</div>
                        </div>
                    </div>
                </div>
                <div className="fr ai-c jc-s mmt mmx mt">
                    <div className="fr">
                        <div className="of">{(total_quantity / 1000000000).toFixed(4)}</div>
                        <div className="bld tml">ETH</div>
                    </div>
                    <div className="fr">
                        <div className="of">${quote(total_quantity / 1000000000, false)}</div>
                        <div className="bld tml">USD</div>
                    </div>
                </div>
                <div className="etherQuote smmt fr ai-c jc-c">
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
                <div className="contract-btn-complete f jc-c">
                    {isHost ? (
                        <button onClick={(e) => setCrypto(true)} class="editButton">
                            Submit
                        </button>
                    ) : null}
                </div>
            </div>
        );
    };

    return (
        <div className="pageContainer">
            <div className="bets b fc"></div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    game: state.game.game,
    user: state.user.user,
});

export default connect(mapStateToProps, { saveHistory, loadUser })(Betting);
