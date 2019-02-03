import React, { Component } from 'react';

import { Editor } from 'slate-react';
import { Value } from 'slate';

import AutocompleteGhostPlugin from './AutocompleteGhostPlugin';

const getSuggestions = () => [
  'How can I help you today?',
  'Can you give me a moment to look into that?',
  'Let me look into that for you.',
  'Thanks for contacting us!',
  'Thank you for contacting us!',
];

const plugins = [AutocompleteGhostPlugin(getSuggestions)];

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
                    text: 'Hi, ',
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
    return <Editor autoFocus value={this.state.value} onChange={this.onChange} plugins={plugins} />;
  }
}
