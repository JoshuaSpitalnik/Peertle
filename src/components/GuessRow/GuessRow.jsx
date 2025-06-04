import React from 'react';
import './GuessRow.css';

function GuessRow(props) {
    const handleGuessSubmit = (event) => {
        event.preventDefault();
        props.setRound(props.round.guess());
    }

    switch (props.status) {
        case "available":
            return (
                <div className="guess-row available">
                    <form className="guess-form" onSubmit={handleGuessSubmit}>
                        <input
                            className="guess-input"
                            disabled={props.round.wasEnded}
                            placeholder="Enter your guess..."
                            onChange={(event) => props.round.updateGuess(event.target.value)}
                            type="text"
                        />
                    </form>
                </div>
            );
        case "skipped":
            return (
                <div className="guess-row skipped">
                    <div className="guess-text italic">
                        Skipped
                    </div>
                </div>
            );
        case "wrong":
            return (
                <div className="guess-row wrong">
                    <div className="guess-text">
                        {props.last_guess}
                    </div>
                </div>
            );
        case "right":
            return (
                <div className="guess-row right">
                    <div className="guess-text">
                        {props.last_guess}
                    </div>
                </div>
            );
        case "locked":
            return (
                <div className="guess-row locked">
                </div>
            );
    }
}

export default GuessRow;
