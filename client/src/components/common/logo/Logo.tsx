import { Link } from "react-router-dom";
import { logo } from "../../../assets";

const Logo = ({ showLogoText = true } : {showLogoText: boolean}) => {
  return (
    <Link to="/">
      <div className="flex items-center justify-center gap-3">
        <img className="w-16" src={logo} alt="HD" />
        {showLogoText ? <h1 className="font-semibold text-3xl">HD</h1> : <></>}
      </div>
    </Link>
  );
};

export default Logo;
