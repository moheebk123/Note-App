import { Link } from "react-router-dom";
import { logo } from "../../../assets";
import PropTypes from 'prop-types'

const Logo = ({ showLogoText = true } : {showLogoText: boolean}) => {
  return (
    <Link to="/">
      <div className="flex items-center justify-center gap-3">
        <img className="w-16" src={logo} alt="HD" />
        {showLogoText ? <h1 className="font-semibold">HD</h1> : <></>}
      </div>
    </Link>
  );
};

Logo.propTypes = {
  showLogoText: PropTypes.bool,
};

export default Logo;
