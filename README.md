# E-ticketing

E-Commerce app using Microservices built with Node, React, Docker and Kubernetes

## Technologies

- React and Next JS
- Mongo database
- Node and Express
- Docker containers
- Kubernetes cluster

## Automated deployment process

### Skaffold

Skaffold is an open source continuous integration tool created by Google. It handles the workflow for building, pushing and deploying your application, allowing you to focus on what matters most: writing code.

### ingress-nginx

ingress-nginx is an Ingress controller for Kubernetes using NGINX as a reverse proxy and load balancer. Learn more about Ingress on the main Kubernetes [documentation site](https://kubernetes.github.io/ingress-nginx/).

**NOTE: For developpent mode add this code below to the end of host file**

```
127.0.0.1	eticketing.dev
```

- Windows (edit as admin)

```
C:\Windows\System32\drivers\hosts
```

- MacOs/Linux

```
/etc/hosts
```

## Dev environment through Google Cloud instead of local

Start building on Google Cloud Platform (GCP) with a [Free Trial](https://cloud.google.com/free) that includes $300 in credits. GCP lets you build, deploy, and scale applications, websites, and services on the same infrastructure as Google.

### Create a new project

Create a new project in Google Cloud called **_"eticketing-dev"_** by example and jump into it

Then go to **Kubernetes Engine API > Clusters**

## Google Cloud Sdk

install [Google Cloud Sdk](https://cloud.google.com/sdk/docs/quickstarts) wich is a set of tools to manage resources and applications hosted on Google Cloud.

## Update pods

if any point in time you feel as thougt you made a change, that it's not being reflected inside the browser, go through those steps below

- List all Pods

```
kubectl get pods
```

- Delete the pod using kubectl

The pod is recreating automatically even after the deletion of the pod manually. Replace **_client-depl-1c565545fkl-9kjgcd_** by your own pod.

```
kubectl delete pods client-depl-1c565545fkl-9kjgcd
```
