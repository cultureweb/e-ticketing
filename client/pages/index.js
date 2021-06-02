import buildClient from "../api/build-client";

const home = ({ currentUser }) => {
  return currentUser ? (
    <h1>you are signed in</h1>
  ) : (
    <h1>you are not signed in</h1>
  );
};

home.getInitialProps = async (context) => {
  console.log("HOME PAGE");
  const client = buildClient(context);

  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default home;
