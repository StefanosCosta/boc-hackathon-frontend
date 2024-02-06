import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Nav from "./components/Nav";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import AccountView from "./pages/AccountView";
import Accept from "./pages/Accept";

function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });
      if (response?.name) {
        setName(response.name);
      } else {
        setName("");
      }
      if (response?.role) {
        setRole(response.role);
      } else {
        setRole("");
      }
    })();
  });

  console.log("NAME ", name);

  return (
    <div className="App">
      <BrowserRouter>
        <Nav name={name} setName={setName} />

        <main >
          <Route
            path="/"
            exact
            component={() => <Home name={name} role={role} />}
          />
          <Route path="/accept/:id" exact component={Accept} />
          <Route path="/login" component={() => <Login setName={setName} />} />
          <Route path="/register" component={Register} />
          <Route
            path="/view-accounts/:id"
            component={() => <AccountView name={name} role={role} />}
          />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
