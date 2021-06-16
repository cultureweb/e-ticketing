import React from "react";

const OrderIndex = ({ orders }) => {
  console.log(orders);
  const orderList = orders.map((order) => {
    return (
      <tr>
        <td>{order.id}</td>
        <td>{order.ticket.title}</td>
        <td>{order.status}</td>
      </tr>
    );
  });

  return (
    <table className="table">
      <tr>
        <th>Id</th>
        <th>title</th>
        <th>status</th>
      </tr>
      <tbody>{orderList}</tbody>
    </table>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrderIndex;
