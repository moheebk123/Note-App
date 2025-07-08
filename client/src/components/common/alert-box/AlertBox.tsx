import { useSelector } from "react-redux";

interface ShowAlertType {
  show: boolean;
  message: string;
  severity: string;
}

interface StoreType {
  showAlert: ShowAlertType
}

const AlertBox = () => {
  const showAlert = useSelector((store: StoreType) => store.showAlert);

  return (
    showAlert.show && (
      <div className="fixed bottom-5 left-[50%] translate-x-[-50%] z-50">
        <p
          className={`text-center text-slate-200 ${
            showAlert.severity === "success" ? "bg-green-400" : "bg-red-400"
          }`}
        >
          {showAlert.message}
        </p>
      </div>
    )
  );
};

export default AlertBox;
