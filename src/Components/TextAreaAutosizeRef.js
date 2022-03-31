import React, { useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";

const TextAreaAutosizeRef = React.forwardRef(
  ({ handleChange, currentPost, doTextAreaFocus }, ref) => {
    useEffect(() => {
      // REF IS BUGGED
      const currentRef = ref ? ref.current : null;
      console.log("done")
      if (currentRef) {
        if (doTextAreaFocus) {
          currentRef.focus();
        } else if (!doTextAreaFocus) {
          currentRef.blur();
        }
      }
      return () => {
        currentRef.blur();
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
