import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import propTypes from "prop-types";

interface ErrorType {
  primaryText: string;
  secondaryText: string;
}

interface StoreType {
  theme: string
}

const Error = ({ errorText }: {errorText: ErrorType}) => {
  const theme = useSelector((store: StoreType) => store.theme);

  return (
    <div className="w-full h-fit flex items-center justify-center py-10">
      <div className="flex flex-col items-center justify-center gap-4 text-center p-4">
        <h1
          className={`${
            theme === "light" ? "text-gray-200" : "text-gray-800"
          } ${errorText.primaryText === "404" ? "text-5xl" : "text-4xl"}`}
        >
          {errorText.primaryText}
        </h1>
        <p
          className={`${
            theme === "light" ? "text-gray-400" : "text-gray-500"
          } text-xl mb-8"`}
        >
          {errorText.secondaryText}
        </p>
        <Link to="/">
          <button className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer transition-all text-white font-semibold px-5 pt-2 pb-3 rounded-lg text-md">
            Go to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
};

Error.propTypes = {
  errorText: propTypes.shape({
    primaryText: propTypes.string.isRequired,
    secondaryText: propTypes.string.isRequired,
  }).isRequired,
};

export default Error;
