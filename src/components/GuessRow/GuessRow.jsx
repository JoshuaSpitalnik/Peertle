function GuessRow(props) {
	const handleGuessSubmit = (event) => {
		event.preventDefault();
		props.setRound(props.round.guess());
	}
	
	switch (props.status) {
		case "available": {
            return (
                <div style={ {"display": "flex", "width": "90%", "height": "30px", "backgroundColor": "#464c59", "borderRadius": "10px", "justifyContent": "center"} }>
                    <form style={{ "background": "none", "border": "none", "width": "95%", "height": "100%" }} onSubmit={handleGuessSubmit}>
                        <input style={{ "background": "none", "border": "none", color: "white", "width": "95%", "height": "90%" }} disabled={props.round.wasEnded} placeholder="Enter your guess..." onChange={(event) => {props.round.updateGuess(event.target.value)}} type="text"></input>
                    </form>
                </div>
            );
		}
        case "skipped": {
            return (
                <div style={ {"display": "flex", "width": "90%", "height": "30px", "backgroundColor": "#464c59", "borderRadius": "10px", "justifyContent": "center", "alignItems": "center"} }>
                    <div style={{ "textAlign": "left", "fontStyle": "italic", "width": "95%", "color": "grey" }}>
                        Skipped
                    </div>
                </div>
            );
		}
        case "wrong": {
            return (
                <div style={ {"display": "flex", "width": "90%", "height": "30px", "backgroundColor": "#550000", "borderRadius": "10px", "justifyContent": "center", "alignItems": "center"} }>
                    <div style={{ "textAlign": "left", "width": "95%", "color": "grey" }}>
                        {props.last_guess}
                    </div>
                </div>
            );
		}
        case "right": {
            return (
                <div style={ {"display": "flex", "width": "90%", "height": "30px", "backgroundColor": "#005500", "borderRadius": "10px", "justifyContent": "center", "alignItems": "center"} }>
                    <div style={{ "textAlign": "left", "width": "95%", "color": "grey" }}>
                        {props.last_guess}
                    </div>
                </div>
            );
		}
        case "locked": {
            return (
                <div style={ {"display": "flex", "width": "90%", "height": "30px", "backgroundColor": "#464c59", "borderRadius": "10px"} }>
                </div>
            );
		}
	}
}

export default GuessRow;
