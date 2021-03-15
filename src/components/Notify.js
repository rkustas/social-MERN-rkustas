import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Loading from "./Loading";

const Notify = () => {
  const { state, dispatch } = useContext(AuthContext);
  const { notify } = state;

  return <>{notify.loading && <Loading />}</>;
};

export default Notify;
