import React, { useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";

const TextAreaAutosizeRef = React.forwardRef(
  ({ handleChange, post, doTextAreaFocus, setDoTextAreaFocus }, ref) => {
    useEffect(() => {
      const currentRef = ref.current;
      if (doTextAreaFocus) {
        currentRef.focus();
      } else if (!doTextAreaFocus) {
        currentRef.blur();
      }
      return () => {
        currentRef.blur();
      };
    });

    return (
      <TextareaAutosize
        ref={ref}
        className="comment-textarea"
        onChange={(e) => handleChange(e)}
        onClick={() => setDoTextAreaFocus(true)}
        value={post.comments.textField}
        placeholder="Write a comment..."
      />
    );
  }
);

export default TextAreaAutosizeRef;
