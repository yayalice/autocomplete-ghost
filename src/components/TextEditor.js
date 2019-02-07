import React, { Component } from 'react';

import memoize from 'fast-memoize';
import { Editor } from 'slate-react';
import { Value } from 'slate';

import AutocompleteGhostPlugin from './AutocompleteGhostPlugin';

const getPlugins = (phrases, minMatchingChar, shouldAutocompleteOnTab, shouldAutocompleteOnEnter) => [
  AutocompleteGhostPlugin(phrases, minMatchingChar, shouldAutocompleteOnTab, shouldAutocompleteOnEnter),
];
const getPluginsMemoized = memoize(getPlugins);

export default class TextEditor extends Component {
  state = {
    value: Value.fromJSON({
      document: {
        nodes: [
          {
            object: 'block',
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'Hi! ',
                  },
                ],
              },
            ],
          },
        ],
      },
    }),
  };

  onChange = change => {
    this.setState({ value: change.value });
  };

  render() {
    return (
      <Editor
        autoFocus
        value={this.state.value}
        onChange={this.onChange}
        plugins={getPluginsMemoized(
          this.props.phrases,
          this.props.minMatchingChar,
          this.props.shouldAutocompleteOnTab,
          this.props.shouldAutocompleteOnEnter
        )}
      />
    );
  }
}
