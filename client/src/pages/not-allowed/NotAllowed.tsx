import { useEffect } from "react";
import { Error } from "../../components";
import {notAllowedText} from "../../data/auth"

const NotAllowed = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <Error errorText={notAllowedText} />;
};

export default NotAllowed;
