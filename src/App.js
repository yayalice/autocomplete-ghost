import React, { Component } from 'react';
import { TextEditor, Checkbox } from './components';
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
    shouldAutocompleteOnTab: true,
    shouldAutocompleteOnEnter: true,
  };

  handleMinMatchingCharChange = newValue => {
    this.setState({ minMatchingChar: newValue.target.value });
  };

  handleChangeShouldAutocompleteOnTab = newValue => {
    this.setState({ shouldAutocompleteOnTab: newValue.target.checked });
  };

  handleChangeShouldAutocompleteOnEnter = newValue => {
    this.setState({ shouldAutocompleteOnEnter: newValue.target.checked });
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
            <label key="shouldAutocompleteOnTab">
              Autocomplete on Tab
              <Checkbox
                name="shouldAutocompleteOnTab"
                checked={this.state.shouldAutocompleteOnTab}
                onChange={this.handleChangeShouldAutocompleteOnTab}
              />
            </label>
          </div>
          <div>
            <label key="shouldAutocompleteOnEnter">
              Autocomplete on Enter
              <Checkbox
                name="shouldAutocompleteOnEnter"
                checked={this.state.shouldAutocompleteOnEnter}
                onChange={this.handleChangeShouldAutocompleteOnEnter}
              />
            </label>
          </div>
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
          <TextEditor
            minMatchingChar={this.state.minMatchingChar}
            phrases={this.state.phrases}
            shouldAutocompleteOnTab={this.state.shouldAutocompleteOnTab}
            shouldAutocompleteOnEnter={this.state.shouldAutocompleteOnEnter}
          />
        </div>
      </div>
    );
  }
}

export default App;
