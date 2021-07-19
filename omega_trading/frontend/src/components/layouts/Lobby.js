import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { startGame, loadGame, loadHistory } from "../../actions/game";
import CreateGame from "./CreateGame";
import Pregame from "./Pregame";
import Betting from "./Betting";
import Game from "./Game";

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";

function Lobby(props) {
    if (props.isAuthenticated) {
        if (props.user === null) {
            props.loadUser();
        }
    } else {
        return <Redirect to="/login" />;
    }

    Lobby.propTypes = {
        startGame: PropTypes.func.isRequired,
        loadHistory: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        game_loaded: PropTypes.bool,
        game_loading: PropTypes.bool,
        no_game: PropTypes.bool,
        history_loaded: PropTypes.bool,
        history_loading: PropTypes.bool,
        history: PropTypes.object,
        game: PropTypes.object,
    };

    useEffect(() => {
        if (!props.game_loaded && !props.game_loading) {
            props.loadGame();
        }
        if (!props.history_loaded && !props.history_loading && props.game_loaded) {
            props.loadHistory();
        }
    });

    if ((!props.game_loading && !props.game_loaded) || props.game_loading) {
        return (
            <div className="pageContainer">
                <div className="loaderContainer f ai-c jc-c">
                    <div className="loader" />
                </div>
            </div>
        );
    } else {
        if (props.no_game) {
            return <CreateGame />;
        } else {
            if (props.game.active) {
                return <Game />;
            } else {
                if (props.game.contract.ready_to_bet) {
                    return <Betting />;
                } else {
                    return <Pregame />;
                }
            }
        }
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    game_loaded: state.game.game_loaded,
    game_loading: state.game.game_loading,
    history_loaded: state.game.history_loaded,
    history_loading: state.game.history_loading,
    no_game: state.game.no_game,
    game: state.game.game,
});

export default connect(mapStateToProps, { startGame, loadGame, loadHistory })(Lobby);
