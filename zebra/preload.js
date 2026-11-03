const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  app: "zebra-ready"
});