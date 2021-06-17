import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // we are on the server

    return axios.create({
      baseURL:
        //"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        "http://www.cultureweb.work/",
      headers: req.headers,
    });
  } else {
    // We are on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
