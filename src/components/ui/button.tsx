type ButtonProps = {
  text: string;
  onClick: () => void;
};

const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative bg-[#3daa25] text-white px-6 py-3 font-semibold rounded-md overflow-hidden transition-all duration-300 hover:bg-[#34901f] hover:shadow-lg group"
    >
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
      <span className="relative z-10">{text}</span>
    </button>
  );
};

export default Button;
