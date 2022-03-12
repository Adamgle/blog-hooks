import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

const TextAreaAutosizeRef = React.forwardRef(
  ({ handleChange, post, doTextAreaFocus, setDoTextAreaFocus }, ref) => {
    const [textAreaClick, setTextAreaClick] = useState(false);
    useEffect(() => {
      const currentRef = ref.current;
      if (textAreaClick) {
        setDoTextAreaFocus(true);
        return;
      } else {
        if (doTextAreaFocus) {
          currentRef.focus();
        } else if (!doTextAreaFocus) {
          currentRef.blur();
        }
        return () => {
          currentRef.blur();
        };
      }
    });

    const handleTextAreaClick = () => {
      setTextAreaClick(true);
    };

    const handleBlur = () => {
      setTextAreaClick(false);
      ref.current.blur();
    };

    return (
      <TextareaAutosize
        ref={ref}
        className="comment-textarea"
        onChange={(e) => handleChange(e)}
        onClick={handleTextAreaClick}
        onBlur={handleBlur}
        value={post.comments.textField}
        placeholder="Write a comment..."
      />
    );
  }
);

export default TextAreaAutosizeRef;
