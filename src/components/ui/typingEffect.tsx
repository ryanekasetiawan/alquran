import { useEffect, useState } from "react";

type TypingEffectProps = {
  text: string;
  speed: number;
};

const TypingEffect = ({ text, speed }: TypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const type = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        setIndex((prevIndex) => prevIndex + 1);
      } else {
        setTimeout(() => {
          setDisplayedText("");
          setIndex(0);
        }, 3000);
      }
    };

    const timeoutId = setTimeout(type, speed);

    return () => clearTimeout(timeoutId);
  }, [index, text, speed]);

  return (
    <div className="text-lg md:text-xl lg:text-2xl text-center font-semibold">
      {displayedText}
      {index < text.length && (
        <span className="animate-pulse text-green-500 bg-green-500">|</span>
      )}
    </div>
  );
};

export default TypingEffect;
