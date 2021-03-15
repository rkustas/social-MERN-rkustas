import React from "react";

// Quicker auth form component to be reused in several pages, get paramaters as props, password has a default value of blank if not used

const AuthForm = ({
  email = "",
  password = "",
  setEmail = (f) => f,
  setPassword,
  handleSubmit,
  showPasswordInput = false,
  hideEmailInput = false,
}) => (
  <form className="my-3" onSubmit={handleSubmit}>
    {!hideEmailInput && (
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          placeholder="Enter email"
        />
      </div>
    )}
    {showPasswordInput && (
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          placeholder="Enter password"
        />
      </div>
    )}
    <button className="btn btn-raised btn-primary btn-block">Submit</button>
  </form>
);

export default AuthForm;
