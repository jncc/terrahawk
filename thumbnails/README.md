
thumbnails
==========

Thumbnails package used locally by both the API and the web app.

From the `api` or `www` directories, add it like so

```
yarn add link:../thumbnails
```

This will create a symlink to the top level `thumbnails` directory from node_modules. If you want changes here to also be hot reloaded, you'll need to make sure the `node_modules/thumbnail-generator` dir is watched.