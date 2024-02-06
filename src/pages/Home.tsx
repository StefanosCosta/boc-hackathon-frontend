import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  has_access: string;
}

interface AccessRequest {
  request_id: string;
  auditor_id: string;
  email: string;
  accepted: string;
  subscription_id: string;
}

const Home = (props: { name: string; role: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [acRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const acceptURL =
    "https://sandbox-apis.bankofcyprus.com/df-boc-org-sb/sb/psd2/oauth2/authorize?response_type=code&redirect_uri=http://localhost&scope=UserOAuth2Security&client_id=bd230620-1aa5-4509-858c-81e902d5c7e4&subscriptionid=";
  const history = useHistory();

  useEffect(() => {
    async function getBusinessUsers() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/businessCustomers",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error(error);
      }
    }

    async function getAccessRequests() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/accessRequests",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAccessRequests(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (props.role === "Auditor") {
      getBusinessUsers();
    }
    if (props.role === "Business") {
      getAccessRequests();
    }
  }, [props.role]);

  async function submit(id: string) {

    let body = JSON.stringify({ id: id });

    await fetch("http://localhost:8000/api/requestAccess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body,
    });
  }

  async function accept(id: string) {
    console.log(id);
    let body = JSON.stringify({ id: id });

    await fetch("http://localhost:8000/api/provideAccess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body,
    });
  }

  return (
    <div className="table-view">
      <strong style={{ fontSize: "30px", fontStyle: 'italic' }}>{props?.name ? "Welcome " + props.name : "Loading..."}</strong>
      <br />
      <br />
      <div className="container w-100" style={{ paddingTop: "15px" }}>
        <table className="table table-dark w-100">
          <thead>
            {props.role === "Auditor" && (
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                {<th scope="col"></th>}
              </tr>
            )}
            {props.role === "Business" && (
              <tr>
                <th scope="col">ID</th>
                <th scope="col">AuditorID</th>
                <th scope="col">Auditor Email</th>
                {acRequests?.length > 0 && <th scope="col"></th>}
              </tr>
            )}
          </thead>
          <tbody>
            {props.role === "Auditor" &&
              users?.map((userObject) => (
                <tr key={userObject?.id}>
                  <td>{userObject?.id}</td>
                  <td>{userObject?.email}</td>
                  <td>{userObject?.role}</td>
                  <td>
                    <form>
                      {!userObject?.has_access ? (
                        <button
                          type="submit"
                          value={userObject?.id}
                          className="btn btn-primary"
                          onClick={() => submit(userObject?.id)}
                        >
                          Request Access
                        </button>
                      ) : (
                        <button
                          type="submit"
                          value={userObject?.id}
                          className="btn btn-primary"
                          onClick={() => {
                            history.push(`/view-accounts/${userObject?.id}`);
                          }}
                        >
                          View Accounts
                        </button>
                      )}
                    </form>
                  </td>
                </tr>
              ))}

            {props.role === "Business" &&
              acRequests?.map((accessRequest) => (
                <tr key={accessRequest?.request_id}>
                  <td>{accessRequest?.request_id}</td>
                  <td>{accessRequest?.auditor_id}</td>
                  <td>{accessRequest?.email}</td>

                  <td>
                    {!accessRequest?.accepted ? (
                      <form>
                        <a
                          href={acceptURL + accessRequest?.subscription_id}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          onClick={() => accept(accessRequest?.request_id)}
                        >
                          Accept
                        </a>
                      </form>
                    ) : (
                      <button className="btn btn-secondary">Accepted</button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
