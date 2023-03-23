
Terrahawk web app
=================

    yarn
    yarn dev

Install the `TSLint` VS Code plugin.

    yarn deploy:alpha --no-confirm                        # build and deploy from local machine to AWS via Serverless 

Brief overview
--------------

This is a simple, static web application.

- Vite for bundling
- React for UI
- Redux toolkit for state
- Tailwind for CSS
- Serverless Finch for static website hosting on S3

Base mapping
------------

The mapper currently uses the Ordnance Survey "Data Hub" API service for the base mapping. The key should be available in the `Terrahawk` 'project' to anyone in the JNCC 'organisation'.
