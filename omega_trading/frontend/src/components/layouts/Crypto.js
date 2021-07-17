import React, { useState } from "react";

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createContract, makeBet } from "../../actions/game";
import game from "../../reducers/game";

function Crypto(props) {
    const [address, setAddress] = useState(null);
    const [key, setKey] = useState(null);

    Crypto.propTypes = {
        createContract: PropTypes.func.isRequired,
        makeBet: PropTypes.func.isRequired,
        game: PropTypes.object,
        user: PropTypes.object,
    };

    if ("address" in props.game.players[props.user.username]) {
        window.location.reload();
    }

    const onSubmit = () => {
        if (props.create) {
            props.createContract(props.value, address, key, false, props.bet);
        } else {
            props.makeBet(address, key, false, props.game.room_code);
        }
    };

    return (
        <div className="crypto-container f ai-c jc-c">
            <div className="crypto-page fc ai-c jc-c">
                <h1 className="crypto-title">ETH Wallet</h1>
                <div className="crypto-login  fc ai-c jc-c">
                    <input className="crypto-input mmy" onChange={(e) => setAddress(e.target.value)} placeholder="Wallet Address" type="text" />
                    <input className="crypto-input mmy" onChange={(e) => setKey(e.target.value)} placeholder="Wallet Key" type="password" />
                    <button onClick={onSubmit} className="editButton mmy">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    game: state.game.game,
    user: state.user.user,
});

export default connect(mapStateToProps, {
    createContract,
    makeBet,
})(Crypto);
