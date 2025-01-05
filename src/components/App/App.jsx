import "./App.css";
import React, {useState, useEffect} from "react";
import GuessRow from "../GuessRow/GuessRow";

const milisIntervals = [400, 800, 1200, 1600, 2000, 2400];

const RoundConfig = (answer, audio, milisIntervals) => {
	return {
		answer: answer,
		audio: audio,
		milisIntervals: milisIntervals
	}
}

const RowState = (state, last_guess = null) => {
	return {state: state, last_guess: last_guess};
}

const RoundState = (currentStage, canPlay, currentGuess, currentRowStates, wasEnded) => {
	return {
		currentStage: currentStage,
		canPlay: canPlay,
		currentGuess: currentGuess,
		currentRowStates: currentRowStates,
		wasEnded: wasEnded
	}
}

const Round = (roundConfig, roundState) => {
	const currentInterval = () => {
		return milisIntervals[roundState.currentStage];
	};
	
	const getUpdatedRowStates = (currentRowStates, indexToUpdate, newState) => {
		return currentRowStates.map((item, index) => {return index == indexToUpdate ? newState: item});
	}
	
	const skip = () => {
		let rows = getUpdatedRowStates(roundState.currentRowStates, roundState.currentStage, RowState("skipped", null));
		let new_rows = getUpdatedRowStates(rows, roundState.currentStage + 1, RowState("available", null));
		return Round(
			roundConfig, RoundState(
				roundState.currentStage + 1, true, roundState.currentGuess, new_rows, false
			)
		);
	};
	
	const playSoundForMillis = (millis) => {
		setTimeout(
			() => {
				roundConfig.audio.pause()
			}, millis
		)
		roundConfig.audio.currentTime = 0;
		roundConfig.audio.play()
	};
	
	const play = () => {
		if (roundState.canPlay) {
			playSoundForMillis(currentInterval());
			return Round(
				roundConfig, RoundState(
					roundState.currentStage, false, roundState.currentGuess, roundState.currentRowStates, false
				)
			)
		}
	};
	
	const guess = () => {
		if (roundState.currentGuess == roundConfig.answer) {
			let new_rows = getUpdatedRowStates(roundState.currentRowStates, roundState.currentStage, RowState("right", roundState.currentGuess));
			return Round(
				roundConfig, RoundState(roundState.currentStage, false, roundState.currentGuess, new_rows, roundState.state)
			)
		}
		let rows = getUpdatedRowStates(roundState.currentRowStates, roundState.currentStage, RowState("wrong", roundState.currentGuess));
		let new_rows = getUpdatedRowStates(rows, roundState.currentStage + 1, RowState("available", roundState.currentGuess));
		return Round(
			roundConfig, RoundState(roundState.currentStage + 1, true, roundState.currentGuess, new_rows, false)
		)
	}
	
	const updateGuess = (guess) => {
		roundState.currentGuess = guess;
	}
	
	return {
		play: play,
		skip: skip,
		guess: guess,
		currentRowStates: roundState.currentRowStates,
		currentGuess: roundState.currentGuess,
		updateGuess: updateGuess,
		wasEnded: roundState.wasEnded
	}
}

async function getRandomRoundConfig() {
	let songs = await ((await fetch("http://localhost:3001/api/songs"))).json();
	let random_songs = songs[Math.floor(Math.random() * songs.length)]
	return RoundConfig(random_songs["name"], new Audio("./songs/" + random_songs["file_name"]), milisIntervals);
}

function App() {
	let [round, setRound] = useState(null);
	
	useEffect(() => {
		async function newRound() {
			const roundConfig = await getRandomRoundConfig();
			setRound(Round(
				roundConfig,
				RoundState(0, true, "", [RowState("available"), RowState("locked"), RowState("locked"), RowState("locked"), RowState("locked"), RowState("locked")], false)
			));
		}
		newRound()
	}, []);
	
	
	if (round == null) {
		return <div>Loading...</div>
	}
	
	return (
    <div className="App" style={{}}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
      <header className="App-header">
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: "url('./peer.png') no-repeat center center", opacity: 0.3, filter: "blur (1px) brightness(0.8) sepia(0.5) saturate(150%) hue-rotate(9deg)" }}></div>
        <div style={{ "zIndex": 1, top: 0, position: "relative", width: "100%", height: "100%"}}>
          <div style={{ "fontSize": "20px", position: "absolute", top: 0, left: 0, display: "flex", "justifyContent": "center", width: "100%" }}>
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", "alignItems": "center", "justifyContent": "center", "gap": "100px" }}>
                <div style={{ display: "flex", width: "70px", "justifyContent": "space-between" }}>
                  <button className="icon-button">
                    <i className="fa fa-question-circle" style={{ "fontSize": "30px" }}></i>
                  </button>
                  <button className="icon-button">
                    <i className="fa fa-cubes" style={{ "fontSize": "30px" }}></i>
                  </button>
                </div> 
                <div style={{"flexDirection": "column", display: "flex", "alignItems": "center" }}>
                  <h1 style={{ "fontFamily": "Source Sans Pro, sans-serif", "margin": 0, "fontSize": "20px" }}>Peertle</h1>
                  <h5 style={{ "fontFamily": "Source Sans Pro, sans-serif", "margin": 0 }}>The Peer Tasi Heardle</h5>
                </div>
                <div style={{ display: "flex", width: "78px", "justifyContent": "space-between" }}>
                  <button className="icon-button">
                    <i className="fa fa-bar-chart" style={{ "fontSize": "30px" }}></i>
                  </button>
                  <button className="icon-button">
                    <i className="fa fa-cog" style={{ "fontSize": "30px" }}></i>
                  </button>
                </div>
              </div>
              <hr style={{ "borderColor": "#50b993" }}></hr>
            </div>
          </div>
          <div style={{ "display": "flex", "width": "100%", "justifyContent": "center" }}>
            <div style={{ "gap": "8px", "width": "30%", "display": "flex", "flexDirection": "column", "justifyContent": "center", "alignItems": "center" }}>
              <i onClick={round.play} className="fa fa-circle" style={{ "marginLeft": "15px", "marginTop": "100px", "marginBottom": "30px", "fontSize": "100px", "color": "#464c59" }}>
                <i className="fa fa-play" style={{ "position": "relative", "top": "-20%", "left": "-46%", "fontSize": "40px", "color": "#50b993" }}></i>
              </i>
              <button disabled={round.wasEnded} onClick={(event) => { setRound(round.skip) }} style={{ "width": "20%", "height": "30px", "backgroundColor": "#464c59", "border": "none", "border-radius": "8px" }}>
                Skip
              </button>
              {round.currentRowStates.map((state, index) => {
                return <GuessRow setRound={setRound} round={round} status={state.state} last_guess={state.last_guess} key={index}></GuessRow>
              })}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App;
