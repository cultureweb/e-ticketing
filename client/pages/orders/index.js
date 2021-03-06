import React from "react";

const OrderIndex = ({ orders }) => {
  console.log(orders);
  const orderList = orders.map((order) => {
    return (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.ticket.title}</td>
        <td>{order.status}</td>
      </tr>
    );
  });

  return (
    <table className="table">
      <tbody>
        <tr>
          <th>Id</th>
          <th>title</th>
          <th>status</th>
        </tr>
      </tbody>
      <tbody>{orderList}</tbody>
    </table>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrderIndex;
