import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Route to filter an image from a public URL
  app.get("/filteredimage", async (req, res) => {
    const { image_url } = req.query;

    // Validate the image_url query
    if (!image_url) {
      return res.status(400).send("image_url is required");
    }

    try {
      // Call filterImageFromURL(image_url) to filter the image
      const filteredpath = await filterImageFromURL(image_url as string);

      // Send the resulting file in the response
      res.sendFile(filteredpath, () => {
        // Deletes any files on the server on finish of the response
        deleteLocalFiles([filteredpath]);
      });
    } catch (error) {
      console.error(error);
      return res.status(422).send("Unable to process image at provided url");
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
