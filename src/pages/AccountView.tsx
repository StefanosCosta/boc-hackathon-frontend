import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Account {
  accountNumber: string;
  accountType: string;
  currency: string;
  balance: string;
  interestRate: string;
  maturityDate: string;
  balanceDate: string;
}

export const numberWithCommas = (x: string) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const AccountView = (props: { name: string; role: string }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const { id } = useParams<{ id?: string }>();

  useEffect(() => {
    async function getBusinessAccounts() {
      try {
        let url = "http://localhost:8000/api/balances/" + id;
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (props.role === "Auditor") {
      getBusinessAccounts();
    }
  }, [props.role, id]);

  return (
    <div className="table-view">
      <strong style={{ fontSize: "30px", fontStyle: 'italic' }}>{props?.name ? "Welcome " + props.name : "Loading..."}</strong>
      <br />
      <br />
      <div className="w-100" style={{ paddingTop: "15px" }}>
        <table className="table table-dark w-200">
          <thead>
            {props.role === "Auditor" && (
              <tr
                style={{
                  whiteSpace: "nowrap",
                  overflow: "auto",
                  fontStyle: "italic",
                }}
              >
                <th scope="col">Account #</th>
                <th scope="col">Type</th>
                <th scope="col">Currency</th>
                <th scope="col">Balance</th>
                <th scope="col">Interest Rate</th>
                <th scope="col">Maturity Date</th>
                <th scope="col">Balance Date</th>
                <th></th>
                <th></th>
              </tr>
            )}
          </thead>
          <tbody>
            {props.role === "Auditor" &&
              accounts.map((account) => (
                <tr key={account.accountNumber}>
                  <td>{account.accountNumber}</td>
                  <td>{account.accountType}</td>
                  <td>{account.currency}</td>
                  <td>{numberWithCommas(account.balance)}</td>
                  <td>{account.interestRate}</td>
                  <td>{account.maturityDate}</td>
                  <td>{account.balanceDate}</td>
                  <td>
                    <button className="btn btn-primary">Download Report</button>
                  </td>
                  <td>
                    <button className="btn btn-primary">Export CSV</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountView;
