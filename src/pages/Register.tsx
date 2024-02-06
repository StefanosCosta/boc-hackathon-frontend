import { SyntheticEvent, useState } from "react";
import { Redirect } from "react-router-dom";
import { roles } from "../constants";
import "../common.css";

const renderOptions = (options: Array<string>) => {
  return options.map((opt: string) => (
    <option key={opt} value={opt} label={opt} />
  ));
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [role, setRole] = useState(roles[0]);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    });

    setRedirect(true);
  };

  if (redirect) {
    return <Redirect to="/login" />;
  }

  let opt = renderOptions(roles);
  console.log("OPT ", opt);

  return (
    <form className="form-signin" onSubmit={submit}>
      <h1 className="h3 mb-3 fw-normal hcenter">Please Register</h1>

      <label>Name: </label>
      <input
        className="form-control"
        placeholder="Name"
        required
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <label>Email: </label>
        <input
          type="email"
          className="form-control"
          placeholder="Email address"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password: </label>
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <label>Business Type:</label>
      <select
        className="form-control"
        placeholder="Role"
        required
        onChange={(e) => setRole(e.target.value)}
        value={role}
      >
        {opt}
      </select>
      <br />

      <button className="w-100 btn btn-lg btn-primary" type="submit">
        Submit
      </button>
    </form>
  );
};

export default Register;
