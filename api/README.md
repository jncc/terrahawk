
API
===

Application API deployed to AWS Lambda via [Serverless.js](https://www.serverless.com/learn/).

Restore dependencies:

    yarn

Environment variables:

See `.env.yml.example`. You can run locally against a Postgres instance defined in your `.env` file.

Dev locally:

    yarn dev

Deploy to an AWS environment:

    deploy:alpha

Missing shared libraries and size limitations mean that we need to include the canvas dependency as a lambda layer. Prebuilt lambda layers taken from [node-canvas-lambda](https://github.com/jwerre/node-canvas-lambda) for convenience. Instructions to rebuild can be found in that repo.