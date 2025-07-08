import { loader } from "../../../assets";

function Loader() {
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-gray-500 w-screen h-screen">
      <img src={loader} alt="Loading" />
    </div>
  );
}

export default Loader;
