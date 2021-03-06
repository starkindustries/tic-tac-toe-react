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
    const className = props.isWinner ? "square winner" : "square";
    return (
        <button
            className={ className }
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
        let isWinner = false;
        if (this.props.winningLine) {
            for(var j=0; j<3; j++) {
                if(this.props.winningLine[j] === i) {
                    isWinner = true;
                }
            }
        }

        return (
            <Square
                key={i}
                isWinner={isWinner}
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
            ascending: true,
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

    handleToggleAscending() {
        this.setState({
            ascending: !this.state.ascending,
        });        
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winningLine = calculateWinner(current.squares);        
        const winner = winningLine ? current.squares[winningLine[0]] : null;
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
        
        let movesList;
        if (!this.state.ascending) {
            let movesDescending = [];
            for(var i=0; i<moves.length; i++) {
                movesDescending.unshift(moves[i]);
            }
            movesList = (
                <ol reversed> {movesDescending} </ol>
            );
        } else {
            movesList = (
                <ol> {moves} </ol>
            );
        }   

        // Calculate Winner
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (this.state.stepNumber === 9) {
            status = "Draw";
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        // JSX
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningLine = {winningLine}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">                    
                    <div>{status}</div>
                    <br />
                    <button onClick={() => this.handleToggleAscending()}>{ this.state.ascending ? "Ascending" : "Descending" }</button>                    
                    {movesList}
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
            return lines[i];
        }
    }
    return null;
}