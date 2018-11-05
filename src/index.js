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
        onClick={ props.onClick }>
        { props.value }
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
    constructor(props){ 
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }

    renderSquare(i) {
        return (
            <Square 
                value={this.state.squares[i]} 
                onClick= { () => this.handleClick(i) }    
            />
        );
    }
  
    render() {
      const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  
      return (
        <div>
          <div className="status">{status}</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
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
  