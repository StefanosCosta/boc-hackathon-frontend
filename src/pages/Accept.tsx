import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Accept = (props: { name: string; role: string }) => {
  const { id } = useParams<{ id?: string }>();
  useEffect(() => {
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

    // accept(id);
  }, []);

  return <div>{"You have now accepted auditor with id " + id}</div>;
};

export default Accept;
