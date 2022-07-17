import * as React from "react";

interface ClipboardProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  content: string;
  children: React.ReactNode;
}

const Clipboard: React.FC<ClipboardProps> = ({ children, content, ...props }) => {
  const pbcopy = () => {
    if (content.length > 0)
      navigator.clipboard.writeText(content);
  };

  return (
    <button
      {...props}
      onClick={pbcopy}
    >
      { children }
    </button>
  )
};

export default Clipboard;
