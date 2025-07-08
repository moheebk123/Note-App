import { useEffect } from "react";
import { Error } from "../../components";
import { notFoundText } from "../../data/auth";

const NotFound = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <Error errorText={notFoundText} />;
};

export default NotFound;
