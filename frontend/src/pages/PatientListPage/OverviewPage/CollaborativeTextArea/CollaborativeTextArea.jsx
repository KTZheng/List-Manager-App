import { useState, useRef, useEffect } from "react";
import { TextareaAutosize } from "@mui/material";

export const CollaborativeTextArea = (props) => {
  const sharedStringHelper = props.sharedStringHelper;
  const textareaRef = useRef(null);
  const selectionStartRef = useRef(0);
  const selectionEndRef = useRef(0);

  const [text, setText] = useState(sharedStringHelper.getText());
  // Handle a change event in the textarea
  const handleChange = (ev) => {
    // Get and stash the new textarea state
    if (!textareaRef.current) {
      throw new Error("Handling change without current textarea ref?");
    }
    const textareaElement = textareaRef.current;
    const newText = textareaElement.value;
        const newCaretPosition = textareaElement.selectionStart;
    // Get and stash the old state
    const oldText = text;
    const oldSelectionStart = selectionStartRef.current;
    const oldSelectionEnd = selectionEndRef.current;
    // Update state with the values from the textarea
    storeSelectionInReact();
    setText(newText);
    // Update the SharedString with the values
    const isTextInserted = newCaretPosition - oldSelectionStart > 0;
    if (isTextInserted) {
      const insertedText = newText.substring(oldSelectionStart, newCaretPosition);
      const isTextReplaced = oldSelectionEnd - oldSelectionStart > 0;
      if (!isTextReplaced) {
        sharedStringHelper.insertText(insertedText, oldSelectionStart);
      } else {
        sharedStringHelper.replaceText(insertedText, oldSelectionStart, oldSelectionEnd);
      }
    } else {
      const charactersDeleted = oldText.length - newText.length;
      sharedStringHelper.removeText(newCaretPosition, newCaretPosition + charactersDeleted);
    }
  };
  // Update the UI
  const setTextareaSelection = (newStart, newEnd) => {
    if (!textareaRef.current) {
      throw new Error("Trying to set selection without current textarea ref?");
    }
    const textareaElement = textareaRef.current;
    textareaElement.selectionStart = newStart;
    textareaElement.selectionEnd = newEnd;
  };
  // Store current selection from the textarea element in the useRef
  const storeSelectionInReact = () => {
    if (!textareaRef.current) {
      throw new Error("Trying to remember selection without current textarea ref?");
    }
    const textareaElement = textareaRef.current;
    const textareaSelectionStart = textareaElement.selectionStart;
    const textareaSelectionEnd = textareaElement.selectionEnd;
    selectionStartRef.current = textareaSelectionStart;
    selectionEndRef.current = textareaSelectionEnd;
  };
  // Detect changes in sharedStringHelper and update UI as necessary.
  useEffect(() => {
    const handleTextChanged = (event) => {
      const newText = sharedStringHelper.getText();
      setText(newText);
      if (!event.isLocal) {
        const newSelectionStart = event.transformPosition(selectionStartRef.current);
        const newSelectionEnd = event.transformPosition(selectionEndRef.current);
        setTextareaSelection(newSelectionStart, newSelectionEnd);
        storeSelectionInReact();
      }
    };
    sharedStringHelper.on("textChanged", handleTextChanged);
    return () => {
      sharedStringHelper.off("textChanged", handleTextChanged);
    };
  }, [sharedStringHelper]);
  // Return textarea element
  return (
    <TextareaAutosize 
      ref={textareaRef}
      onBeforeInput={storeSelectionInReact}
      onKeyDown={storeSelectionInReact}
      onClick={storeSelectionInReact}
      onContextMenu={storeSelectionInReact}
      onChange={handleChange}
      value={text} />
  );
}