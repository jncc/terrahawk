import reactRefresh from "@vitejs/plugin-react-refresh";
//import ssr from "vite-plugin-ssr/plugin";
import { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [reactRefresh()], //ssr(),
  // server: {
    //fs: { strict: true } // this will become default in future versions of vite, so can remove soon
  // }

  // watch the thumbnails package
  server: {
    watch: {
      ignored: ['!**/node_modules/thumbnail-generator/**']
    }
  },
  optimizeDeps: {
    exclude: ['thumbnail-generator']
  }
};

export default config;
