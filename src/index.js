import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/***************************
 * Note
 * When we modified the Square to be a function component, we also changed 
 * onClick={() => this.props.onClick()} to a shorter onClick={props.onClick} 
 * (note the lack of parentheses on both sides). In a class, we used an arrow 
 * function to access the correct this value, but in a function component we don’t 
 * need to worry about this.
 ***************************/
function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

/***************************
 * Note
 * The DOM <button> element’s onClick attribute has a special meaning to React because
 * it is a built-in component. For custom components like Square, the naming is up to 
 * you. We could name the Square’s onClick prop or Board’s handleClick method differently. 
 * In React, however, it is a convention to use on[Event] names for props which represent 
 * events and handle[Event] for the methods which handle the events.
 ***************************/


class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        var rows = [];
        var squares = [];
        for(let r = 0; r < 3; r++) {
            for(let c = 0; c < 3; c++) {
                squares.push(this.renderSquare(r*3 + c));
            }
            rows.push(
                <div key={r} className="board-row">{squares}</div>
            );
            squares = [];
        }        
        return (
            <div> {rows} </div>                
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{ squares: squares }]),            
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const step = this.state.stepNumber;

        // History
        const moves = history.map((currentMove, moveIndex) => {
            const description = moveIndex ? 'Go to move #' + moveIndex : 'Go to game start';
            // console.log("Move index: " + moveIndex);
            // console.log("Current move: " + currentMove);            
            return (                
                <li key = {moveIndex}>
                    { moveIndex > 0 ? calculateMoveLocation(currentMove.squares, history[moveIndex-1].squares) : ""}
                    <button onClick={() => this.jumpTo(moveIndex)}>{description}</button>
                    { step === moveIndex ? " <== selected" : "" }
                </li>                
            );
        })

        // Calculate Winner
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        // JSX
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateMoveLocation(currentSquares, previousSquares) {    
    for(let i=0; i<9; i++) {
        // console.log(currentSquares[i]);
        // console.log(previousSquares[i]);
        if (currentSquares[i] !== previousSquares[i]) {             
            let col = (i % 3) + 1;
            let row = (i - (i%3))/3  + 1;
            return "(col:" + col + ", row:" + row + ")";
        }
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}