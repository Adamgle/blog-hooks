import React, { useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";

const TextAreaAutosizeRef = React.forwardRef(
  ({ handleChange, currentPost, doTextAreaFocus }, ref) => {
    useEffect(() => {
      const textArea = ref.current;
      if (doTextAreaFocus) {
        textArea.focus();
      } else {
        textArea.blur();
      }
      return () => {
        textArea.blur();
      };
    }, [doTextAreaFocus, ref]);

    return (
      <TextareaAutosize
        ref={ref}
        className="comment-textarea"
        onChange={(e) => handleChange(e)}
        value={currentPost.comments.textField}
        placeholder="Write a comment..."
      />
    );
  }
);

export default TextAreaAutosizeRef;
