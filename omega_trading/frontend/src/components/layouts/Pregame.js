import React, { useState } from "react";
import { startGame, getEtherQuote, getGasQuote } from "../../actions/game";
import Crypto from "./Crypto";
import Friends from "./Friends";
import Rules from "./Rules";

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import game from "../../reducers/game";

function Pregame(props) {
    const [message, setMessage] = useState("Start Game");
    const [quantity, setQuantity] = useState(null);
    const [totalQuantity, setTotalQuantity] = useState(null);
    const [crypto, setCrypto] = useState(false);

    Pregame.propTypes = {
        startGame: PropTypes.func.isRequired,
        getEtherQuote: PropTypes.func.isRequired,
        getGasQuote: PropTypes.func.isRequired,
        game: PropTypes.object,
        user: PropTypes.object,
        etherQuote: PropTypes.number,
        gasQuote: PropTypes.number,
    };

    if (props.etherQuote == null) {
        props.getEtherQuote();
    }

    const quote = (amount, ether) => {
        if (ether) {
            return ((amount / 1000000000) * props.etherQuote["quote"])
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return (amount * props.etherQuote["quote"])
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    };

    const setQuan = (e) => {
        if (e.length >= 6) {
            setQuantity(Number(e));
        }
    };

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
                    <button onClick={(e) => (isHost ? setCrypto("create") : setCrypto("bet"))} class="editButton">
                        Submit
                    </button>
                </div>
            </div>
        );
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

    const actionbox = (
        <div className="action-box-contract b">
            <div className="contract-header h63 bb fc ai-c jc-c">
                <h4 className="f jc-c">Smart Contract</h4>
                {props.etherQuote == null ? null : (
                    <div className="etherQuote fr ai-b jc-s">
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
                )}
            </div>

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
                        <div className="of">{quantity == null ? "0" : (quantity / 1000000000).toFixed(4)}</div>
                        <div className="bld tml">ETH</div>
                    </div>
                    <div className="fr">
                        <div className="of">${quantity == null ? "0.00" : quote(quantity, true)}</div>
                        <div className="bld tml">USD</div>
                    </div>
                </div>
                <div className="contract-btn f jc-c">
                    <button onClick={(e) => props.getGasQuote()} class="editButton">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );

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
                            height: "306px",
                            width: "676px",
                            display: "flex",
                            "align-items": "center",
                            "justify-content": "center",
                        }}
                    >
                        <div class="loader"></div>
                    </div>
                ) : props.gasQuote == null ? (
                    Object.keys(props.game.contract).length <= 0 ? (
                        actionbox
                    ) : (
                        players
                    )
                ) : (
                    confirmed(props.game.host.username == props.user.username)
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
                            <button onClick={(e) => props.startGame()} className="editButton">
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
            {crypto == "create" ? (
                <Crypto value={totalQuantity * 1000000000} bet={quantity * 1000000000} create={true} />
            ) : crypto == "bet" ? (
                <Crypto value={props.game.contract.value} create={false} />
            ) : null}
        </div>
    );
}

const mapStateToProps = (state) => ({
    game: state.game.game,
    user: state.user.user,
    etherQuote: state.game.etherQuote,
    gasQuote: state.game.gasQuote,
});

export default connect(mapStateToProps, {
    startGame,
    getEtherQuote,
    getGasQuote,
})(Pregame);
