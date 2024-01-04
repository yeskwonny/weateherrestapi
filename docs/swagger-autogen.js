import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "1.0.0",
    title: "WEATHER REST API",
    description: "JSON REST API for weather readings",
  },
  host: "localhost:8080",
  basePath: "",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  security: [{ AuthenticationKey: [] }],
  components: {
    securitySchemes: {
      AuthenticationKey: {
        type: "apiKey",
        in: "header",
        name: "X-AUTH-KEY",
      },
    },
  },
};

const outputFile = "./docs/swagger-output.json";
const endpointFiles = ["./server.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointFiles, doc);
