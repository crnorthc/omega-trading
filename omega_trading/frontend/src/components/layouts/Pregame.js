import React, { useState } from "react";
import { startGame, getQuote } from "../../actions/game";
import Friends from "./Friends";
import Rules from "./Rules";

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";

function Pregame(props) {
    const [message, setMessage] = useState("Start Game");
    const [quantity, setQuantity] = useState(null);

    Pregame.propTypes = {
        startGame: PropTypes.func.isRequired,
        getQuote: PropTypes.func.isRequired,
        game: PropTypes.object,
        user: PropTypes.object,
        etherQuote: PropTypes.number,
    };

    if (props.etherQuote == null) {
        props.getQuote();
    }

    const quote = () => {
        return (quantity * props.etherQuote["quote"])
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const setQuan = (e) => {
        if (e.length >= 6) {
            setQuantity(Number(e) / 1000000000);
        }
    };

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
                        <div className="tt lt tml">
                            as of{props.etherQuote["time"]}
                        </div>
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
                    <div className="fr smx">
                        <div className="of">
                            {quantity == null ? "0" : quantity.toFixed(4)}
                        </div>
                        <div className="bld tml">ETH</div>
                    </div>
                    <div className="fr smx">
                        <div className="of">
                            ${quantity == null ? "0.00" : quote()}
                        </div>
                        <div className="bld tml">USD</div>
                    </div>
                </div>
                <div className="contract-btn f jc-c">
                    <button class="editButton">Confirm</button>
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
                            <h3 className="room-code">
                                #{props.game.room_code}
                            </h3>
                        </div>
                        <div className="pregame-title fr ai-c">
                            <h2>Host</h2>
                            <h3 className="host">
                                @{props.game.host.username}
                            </h3>
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
                ) : (
                    actionbox
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
                            <div className="noAction">
                                There needs to be atleast two players to start a
                                game
                            </div>
                        </div>
                    ) : props.game.host.username == props.user.username ? (
                        <div className="work fc ai-c jc-c">
                            <button
                                onClick={(e) => props.startGame()}
                                className="editButton"
                            >
                                Start
                            </button>
                            <div className="noAction">{message}</div>
                        </div>
                    ) : (
                        <div className="work fc ai-c jc-c">
                            <button className="editButtonHidden">Start</button>
                            <div className="noAction">
                                Wait for the host to start the game
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    game: state.game.game,
    user: state.user.user,
    etherQuote: state.game.etherQuote,
});

export default connect(mapStateToProps, { startGame, getQuote })(Pregame);
