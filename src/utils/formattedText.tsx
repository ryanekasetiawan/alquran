type FormattedTextProps = {
  text: string;
  nonArabicClassName?: string;
};

const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;

const FormattedText = ({ text, nonArabicClassName }: FormattedTextProps) => {
  return (
    <>
      {text.split(/(\s+)/).map((word, index) => {
        if (arabicRegex.test(word)) {
          return (
            <span key={index} className="arab-font text-xl">
              {word}
            </span>
          );
        }
        return (
          <span key={index} className={nonArabicClassName}>
            {word}
          </span>
        );
      })}
    </>
  );
};

export default FormattedText;
