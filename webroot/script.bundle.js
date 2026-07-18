(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // node_modules/kernelsu/index.js
  function getUniqueCallbackName(prefix) {
    return `${prefix}_callback_${Date.now()}_${callbackCounter++}`;
  }
  function exec(command, options) {
    if (typeof options === "undefined") {
      options = {};
    }
    return new Promise((resolve, reject) => {
      const callbackFuncName = getUniqueCallbackName("exec");
      window[callbackFuncName] = (errno, stdout, stderr) => {
        resolve({ errno, stdout, stderr });
        cleanup(callbackFuncName);
      };
      function cleanup(successName) {
        delete window[successName];
      }
      try {
        ksu.exec(command, JSON.stringify(options), callbackFuncName);
      } catch (error) {
        reject(error);
        cleanup(callbackFuncName);
      }
    });
  }
  function Stdio() {
    this.listeners = {};
  }
  function ChildProcess() {
    this.listeners = {};
    this.stdin = new Stdio();
    this.stdout = new Stdio();
    this.stderr = new Stdio();
  }
  var callbackCounter;
  var init_kernelsu = __esm({
    "node_modules/kernelsu/index.js"() {
      callbackCounter = 0;
      Stdio.prototype.on = function(event, listener) {
        if (!this.listeners[event]) {
          this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
      };
      Stdio.prototype.emit = function(event, ...args) {
        if (this.listeners[event]) {
          this.listeners[event].forEach((listener) => listener(...args));
        }
      };
      ChildProcess.prototype.on = function(event, listener) {
        if (!this.listeners[event]) {
          this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
      };
      ChildProcess.prototype.emit = function(event, ...args) {
        if (this.listeners[event]) {
          this.listeners[event].forEach((listener) => listener(...args));
        }
      };
    }
  });

  // webroot/script.js
  var require_script = __commonJS({
    "webroot/script.js"() {
      init_kernelsu();
      var modulePath = "/data/adb/modules/misnomer";
      var configPath = `${modulePath}/config/props.conf`;
      var tempConfigPath = `${modulePath}/config/props.conf.tmp`;
      var fields = {
        model: {
          configKey: "MODEL",
          property: "ro.product.model"
        },
        brand: {
          configKey: "BRAND",
          property: "ro.product.brand"
        },
        manufacturer: {
          configKey: "MANUFACTURER",
          property: "ro.product.manufacturer"
        },
        device: {
          configKey: "DEVICE",
          property: "ro.product.device"
        },
        name: {
          configKey: "NAME",
          property: "ro.product.name"
        },
        product: {
          configKey: "PRODUCT",
          property: "ro.build.product"
        }
      };
      var saveButton = document.getElementById("saveButton");
      var restoreButton = document.getElementById("restoreButton");
      var rebootButton = document.getElementById("rebootButton");
      var statusMessage = document.getElementById("statusMessage");
      function showStatus(message, type = "info") {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
      }
      function shellQuote(value) {
        return `'${value.replace(/'/g, `'\\''`)}'`;
      }
      async function run(command) {
        const result = await exec(command);
        if (result.errno !== 0) {
          throw new Error(
            result.stderr?.trim() || `Command failed: ${command}`
          );
        }
        return result.stdout.trim();
      }
      function encodeText(text) {
        return btoa(
          unescape(
            encodeURIComponent(text)
          )
        );
      }
      function buildConfigText() {
        const lines = [];
        for (const [fieldId, details] of Object.entries(fields)) {
          const input = document.getElementById(fieldId);
          const value = input.value.trim();
          if (value.includes("\n") || value.includes("\r")) {
            throw new Error(
              `${fieldId} contains an invalid line break.`
            );
          }
          lines.push(`${details.configKey}=${value}`);
        }
        return `${lines.join("\n")}
`;
      }
      async function writeConfigSafely(configText) {
        const encodedConfig = encodeText(configText);
        await run(
          `printf %s ${shellQuote(encodedConfig)} | base64 -d > ${shellQuote(tempConfigPath)} && mv ${shellQuote(tempConfigPath)} ${shellQuote(configPath)}`
        );
      }
      async function loadCurrentValues() {
        showStatus("Loading current device values...", "info");
        try {
          for (const [fieldId, details] of Object.entries(fields)) {
            const input = document.getElementById(fieldId);
            input.value = await run(`getprop ${details.property}`);
          }
          showStatus("Current device values loaded.", "success");
        } catch (error) {
          console.error(error);
          showStatus(
            error.message || "Could not load the current device values.",
            "error"
          );
        }
      }
      async function saveChanges() {
        saveButton.disabled = true;
        restoreButton.disabled = true;
        showStatus("Saving changes...", "info");
        try {
          const configText = buildConfigText();
          await writeConfigSafely(configText);
          showStatus(
            "Changes saved. Reboot to apply them fully.",
            "success"
          );
        } catch (error) {
          console.error(error);
          showStatus(
            error.message || "Could not save changes.",
            "error"
          );
        } finally {
          saveButton.disabled = false;
          restoreButton.disabled = false;
        }
      }
      async function restoreOriginalValues() {
        saveButton.disabled = true;
        restoreButton.disabled = true;
        showStatus("Clearing property overrides...", "info");
        try {
          const emptyConfig = "MODEL=\nBRAND=\nMANUFACTURER=\nDEVICE=\nNAME=\nPRODUCT=\n";
          await writeConfigSafely(emptyConfig);
          showStatus(
            "Overrides cleared. Reboot to restore the ROM values.",
            "success"
          );
        } catch (error) {
          console.error(error);
          showStatus(
            error.message || "Could not clear the overrides.",
            "error"
          );
        } finally {
          saveButton.disabled = false;
          restoreButton.disabled = false;
        }
      }
      async function rebootDevice() {
        rebootButton.disabled = true;
        showStatus("Rebooting device...", "info");
        try {
          await exec("reboot");
        } catch (error) {
          console.error(error);
          showStatus(
            "Could not reboot the device.",
            "error"
          );
          rebootButton.disabled = false;
        }
      }
      saveButton.addEventListener("click", saveChanges);
      restoreButton.addEventListener("click", restoreOriginalValues);
      rebootButton.addEventListener("click", rebootDevice);
      loadCurrentValues();
    }
  });
  require_script();
})();
