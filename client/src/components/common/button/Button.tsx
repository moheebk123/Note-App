const Button = ({
  text,
  classes,
  type = "button",
  onClick,
}: {
  text: string;
  classes?: string;
  type: "submit" | "button";
  onClick?: () => void;
}) => {
  return (
    <button
      className={`bg-blue-500 hover:bg-blue-600 hover:cursor-pointer transition-all text-white font-semibold px-5 pt-2 pb-3 rounded-lg text-lg ${
        classes ? classes : ""
      }`}
      type={type}
      onClick={type === "button" ? onClick : undefined}
    >
      {text}
    </button>
  );
};

export default Button;
