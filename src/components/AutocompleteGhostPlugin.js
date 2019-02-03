import React from 'react';

import GhostText from './GhostText';

// TODO: handle remove ghost text on blur

function getGhostNodes(editor) {
  return editor.value.document.getInlinesByType('ghost');
}

function insertGhostNode(editor, suggestedText) {
  const originalSelection = editor.value.selection;

  return editor
    .insertInline({
      type: 'ghost',
      nodes: [
        {
          object: 'text',
          key: 'ghost',
          leaves: [
            {
              object: 'leaf',
              text: suggestedText,
              marks: [],
            },
          ],
        },
      ],
    })
    .select(originalSelection); // move cursor back
}

function removeGhostNodes(editor) {
  const ghostNodes = getGhostNodes(editor);
  ghostNodes.forEach(g => {
    console.log('removing ghost text: ' + g.text);
    return editor.removeNodeByKey(g.key);
  });
}

function AutocompleteGhostPlugin(getSuggestions) {
  function onKeyDown(event, editor, next) {
    const ghostNodes = editor.getGhostNodes();

    // if the user types 'Tab' and ghost text is displayed, un-ghost the text
    if (event.key === 'Tab' && ghostNodes.size) {
      const selectionOffset = editor.value.selection.start.offset;

      ghostNodes.forEach(g => {
        const ghostOffset = editor.value.focusBlock.getOffset(g.key);
        editor.removeNodeByKey(g.key);

        // make sure we are still at the start of the ghost text
        if (ghostOffset === selectionOffset) {
          event.preventDefault();
          editor.insertText(g.text);

          return;
        }
      });
    }

    // TODO: move cursor to start when ghost text is clicked
    // TODO: handle backspace
    // TODO: finish sentences in the middle
    const text = editor.value.texts.get(0).text + event.key;

    // TODO: don't do this when user presses non-character key
    console.log('remove ghost text because someting was typed');
    editor.removeGhostNodes();

    if (text.length < 3) return next();
    const suggestedText = getSuggestedText(text, getSuggestions());
    if (!suggestedText) return next();

    return editor.insertGhostNode(suggestedText);
  }

  function onSelect(event, editor, next) {
    // if anything is selected, remove the ghost node
    if (!editor.value.selection.isCollapsed) {
      editor.removeGhostNodes();
    }

    // if selection changes so cursor is no longer at the start of the ghost node,
    // remove the ghost node
    const selectionOffset = editor.value.selection.start.offset;
    const ghostNodes = editor.getGhostNodes();
    const ghostOffset = ghostNodes.size ? editor.value.focusBlock.getOffset(ghostNodes.get(0).key) : -1;
    if (ghostOffset !== selectionOffset) {
      editor.removeGhostNodes();
    }

    // TODO: handle bug where selection doesn't update when first changed from mouse click
    // console.log('selection offset: ' + editor.value.selection.start.offset);

    next();
  }

  function renderNode(props, editor, next) {
    switch (props.node.type) {
      case 'ghost':
        return <GhostText {...props} />;
      default:
        return next();
    }
  }

  /* Helpers */

  function getSuggestedText(text, suggestions) {
    for (var i = 0; i < suggestions.length; i++) {
      const suggestion = suggestions[i];
      if (suggestion.startsWith(text)) {
        return suggestion.substring(text.length);
      }
    }
    return '';
  }

  return {
    commands: { insertGhostNode, removeGhostNodes },
    queries: { getGhostNodes },
    onKeyDown,
    onSelect,
    renderNode,
  };
}

export default AutocompleteGhostPlugin;
