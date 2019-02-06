import React, { Component } from 'react';
import { TextEditor } from './components';
import './App.css';

class App extends Component {
  state = {
    minMatchingChar: 3,
    phrases: [
      'How can I help you today?',
      'Can you give me a moment to look into that?',
      'Let me look into that for you.',
      'Thanks for contacting us!',
      'Thank you for contacting us!',
    ],
  };

  handleMinMatchingCharChange = newValue => {
    this.setState({ minMatchingChar: newValue.target.value });
  };

  handlePhraseChanges = newValue => {
    let phrases = newValue.target.value;
    phrases = phrases ? phrases.split('\n') : [];
    this.setState({ phrases });
  };

  render() {
    return (
      <div className="App">
        <div className="form">
          <div>
            <label>
              Min matching characters:
              <input type="text" value={this.state.minMatchingChar} onChange={this.handleMinMatchingCharChange} />
            </label>
          </div>
          <div>
            <label>
              Phrase suggestions:
              <textarea type="text" value={this.state.phrases.join('\n')} onChange={this.handlePhraseChanges} />
            </label>
          </div>
        </div>
        <div className="editor">
          <TextEditor minMatchingChar={this.state.minMatchingChar} phrases={this.state.phrases} />
        </div>
      </div>
    );
  }
}

export default App;
