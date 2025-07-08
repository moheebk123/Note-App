import { loader } from "../../../assets";

function Loader() {
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-gray-100/10 w-screen h-screen">
      <img src={loader} className="w-20" alt="Loading" />
    </div>
  );
}

export default Loader;
