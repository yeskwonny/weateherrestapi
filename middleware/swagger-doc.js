// this file reads swagger json file and generate webage that human can read
import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger-output.json" assert { type: "json" };
// look for request coming into  /docs' url and generate page
// show it to us
const docsRouter = Router();
//serve webpage for us
docsRouter.use("/docs", swaggerUi.serve);
docsRouter.get("/docs", swaggerUi.setup(swaggerDocument));

export default docsRouter;
