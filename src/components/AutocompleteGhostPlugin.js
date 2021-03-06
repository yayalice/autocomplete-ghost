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

function AutocompleteGhostPlugin(
  suggestedPhrases,
  minMatchingChar,
  shouldAutocompleteOnTab,
  shouldAutocompleteOnEnter
) {
  function onKeyDown(event, editor, next) {
    const ghostNodes = editor.getGhostNodes();

    // if the user types 'Tab' or 'Enter' and ghost text is displayed, un-ghost the text
    if (
      ((event.key === 'Tab' && shouldAutocompleteOnTab) || (event.key === 'Enter' && shouldAutocompleteOnEnter)) &&
      ghostNodes.size
    ) {
      const selectionOffset = editor.value.selection.start.offset;

      let didAutocomplete = false;
      ghostNodes.forEach(g => {
        const ghostOffset = editor.value.focusBlock.getOffset(g.key);
        editor.removeNodeByKey(g.key);

        // make sure we are still at the start of the ghost text
        if (ghostOffset === selectionOffset) {
          editor.insertText(g.text);

          event.preventDefault();
          event.stopPropagation();
          didAutocomplete = true;
        }
      });
      if (didAutocomplete) {
        // must return false to prevent <Enter> from inserting new line
        // https://github.com/ianstormtaylor/slate/issues/1345
        return false;
      }
    }

    // TODO: move cursor to start when ghost text is clicked
    // TODO: handle backspace
    // TODO: finish sentences in the middle
    const text = editor.value.texts.get(0).text + event.key;

    // TODO: don't do this when user presses non-character key
    console.log('remove ghost text because someting was typed');
    editor.removeGhostNodes();

    const suggestedText = getSuggestedText(text, suggestedPhrases);
    if (!suggestedText) return next();

    return editor.insertGhostNode(suggestedText);
  }

  function onSelect(event, editor, next) {
    // if anything is selected, remove the ghost node
    if (!editor.value.selection.isCollapsed) {
      editor.removeGhostNodes();
    }

    // if editor is not focused, remove the ghost node
    if (!editor.value.focusBlock) {
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
    let sentences = text.split(/[.!?]/);
    let sentenceText = sentences[sentences.length - 1].trimLeft();

    if (sentenceText.length < minMatchingChar) return '';

    for (var i = 0; i < suggestions.length; i++) {
      const suggestion = suggestions[i];
      if (suggestion.toLowerCase().startsWith(sentenceText.toLowerCase())) {
        return suggestion.substring(sentenceText.length);
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
