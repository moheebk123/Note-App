import { Link } from "react-router-dom";
import Button from "../button/Button";

interface ErrorType {
  primaryText: string;
  secondaryText: string;
}

const Error = ({ errorText }: { errorText: ErrorType }) => {
  return (
    <div className="w-full h-fit flex items-center justify-center py-10">
      <div className="flex flex-col items-center justify-center gap-4 text-center p-4">
        <h1
          className={`text-gray-600 font-semibold ${
            errorText.primaryText === "404" ? "text-5xl" : "text-4xl"
          }`}
        >
          {errorText.primaryText}
        </h1>
        <p className="text-gray-400 text-xl font-semibold">
          {errorText.secondaryText}
        </p>
        <Link to="/">
          <Button text="Go to Home" type="button" />
        </Link>
      </div>
    </div>
  );
};

export default Error;
