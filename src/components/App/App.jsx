import "./App.css";
import React, { useState, useEffect } from "react";
import GuessRow from "../GuessRow/GuessRow";

const milisIntervals = [400, 800, 1200, 1600, 2000, 2400];

const RoundConfig = (answer, audio, milisIntervals) => ({
  answer,
  audio,
  milisIntervals
});

const RowState = (state, last_guess = null) => ({ state, last_guess });

const RoundState = (currentStage, canPlay, currentGuess, currentRowStates, wasEnded) => ({
  currentStage,
  canPlay,
  currentGuess,
  currentRowStates,
  wasEnded
});

const Round = (roundConfig, roundState) => {
  const currentInterval = () => milisIntervals[roundState.currentStage];

  const getUpdatedRowStates = (currentRowStates, indexToUpdate, newState) =>
    currentRowStates.map((item, index) =>
      index === indexToUpdate ? newState : item
    );

  const skip = () => {
    const rows = getUpdatedRowStates(
      roundState.currentRowStates,
      roundState.currentStage,
      RowState("skipped", null)
    );
    const new_rows = getUpdatedRowStates(
      rows,
      roundState.currentStage + 1,
      RowState("available", null)
    );
    return Round(
      roundConfig,
      RoundState(
        roundState.currentStage + 1,
        true,
        roundState.currentGuess,
        new_rows,
        false
      )
    );
  };

  const playSoundForMillis = (millis) => {
    setTimeout(() => {
      roundConfig.audio.pause();
    }, millis);
    roundConfig.audio.currentTime = 0;
    roundConfig.audio.play();
  };

  const play = () => {
    if (
      roundState.canPlay &&
      roundState.currentStage < roundState.currentRowStates.length
    ) {
      playSoundForMillis(currentInterval());
      return Round(
        roundConfig,
        RoundState(
          roundState.currentStage,
          false,
          roundState.currentGuess,
          roundState.currentRowStates,
          false
        )
      );
    }
  };

  const guess = () => {
    if (roundState.currentGuess === roundConfig.answer) {
      const new_rows = getUpdatedRowStates(
        roundState.currentRowStates,
        roundState.currentStage,
        RowState("right", roundState.currentGuess)
      );
      return Round(
        roundConfig,
        RoundState(roundState.currentStage, false, roundState.currentGuess, new_rows, true)
      );
    }
    const rows = getUpdatedRowStates(
      roundState.currentRowStates,
      roundState.currentStage,
      RowState("wrong", roundState.currentGuess)
    );
    const new_rows = getUpdatedRowStates(
      rows,
      roundState.currentStage + 1,
      RowState("available", roundState.currentGuess)
    );
    return Round(
      roundConfig,
      RoundState(roundState.currentStage + 1, true, roundState.currentGuess, new_rows, false)
    );
  };

  const updateGuess = (guess) => {
    roundState.currentGuess = guess;
  };

  return {
    play,
    skip,
    guess,
    currentRowStates: roundState.currentRowStates,
    currentGuess: roundState.currentGuess,
    updateGuess,
    wasEnded: roundState.wasEnded
  };
};

async function getRandomRoundConfig() {
  const songs = await (await fetch("./songs/songs.json")).json();
  const random_songs = songs[Math.floor(Math.random() * songs.length)];
  return RoundConfig(random_songs, new Audio(`./songs/${random_songs}.m4a`), milisIntervals);
}

function App() {
  const [round, setRound] = useState(null);

  useEffect(() => {
    async function newRound() {
      const roundConfig = await getRandomRoundConfig();
      setRound(
        Round(
          roundConfig,
          RoundState(
            0,
            true,
            "",
            [
              RowState("available"),
              RowState("locked"),
              RowState("locked"),
              RowState("locked"),
              RowState("locked"),
              RowState("locked")
            ],
            false
          )
        )
      );
    }
    newRound();
  }, []);

  if (!round) return <div>Loading...</div>;

  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
      ></link>
      <header className="App-header">
        <div className="background-overlay"></div>
        <div className="app-content">
          <div className="app-header-row">
            <div className="app-header-left">
              <button className="icon-button">
                <i className="fa fa-question-circle icon"></i>
              </button>
              <button className="icon-button">
                <i className="fa fa-cubes icon"></i>
              </button>
            </div>
            <div className="app-header-center">
              <h1>Peertle</h1>
              <h5>The Peer Tasi Heardle</h5>
            </div>
            <div className="app-header-right">
              <button className="icon-button">
                <i className="fa fa-bar-chart icon"></i>
              </button>
              <button className="icon-button">
                <i className="fa fa-cog icon"></i>
              </button>
            </div>
          </div>
          <hr className="header-separator" />
          <div className="game-container">
            <div className="game-panel">
              <i className="fa fa-play-circle play-icon" onClick={round.play}></i>
              <button
                className="skip-button"
                disabled={round.wasEnded}
                onClick={() => setRound(round.skip)}
              >
                Skip
              </button>
              {round.currentRowStates.map((state, index) => (
                <GuessRow
                  setRound={setRound}
                  round={round}
                  status={state.state}
                  last_guess={state.last_guess}
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
