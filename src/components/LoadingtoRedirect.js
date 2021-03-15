import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const LoadingtoRedirect = ({ path }) => {
  // Countdown state
  const [count, setCount] = useState(5);

  let history = useHistory();

  useEffect(() => {
    // Every second we decrement the count
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);

    // redirect once count is equal to 0
    count === 0 && history.push(path);

    // Cleanup function
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="container p-5 text-center">
      <p>Redirecting you in {count} seconds...</p>
    </div>
  );
};

export default LoadingtoRedirect;
