
/*
 * Misnomer
 * Copyright (C) 2026 SchlorpyDorp
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { exec } from "kernelsu";

const modulePath = "/data/adb/modules/misnomer";
const configPath = `${modulePath}/config/props.conf`;
const tempConfigPath = `${modulePath}/config/props.conf.tmp`;

const fields = {
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

const saveButton = document.getElementById("saveButton");
const restoreButton = document.getElementById("restoreButton");
const rebootButton = document.getElementById("rebootButton");
const statusMessage = document.getElementById("statusMessage");

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

    return `${lines.join("\n")}\n`;
}

async function writeConfigSafely(configText) {
    const encodedConfig = encodeText(configText);

    await run(
        `printf %s ${shellQuote(encodedConfig)} | base64 -d > ${shellQuote(tempConfigPath)} && ` +
        `mv ${shellQuote(tempConfigPath)} ${shellQuote(configPath)}`
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
        const emptyConfig =
            "MODEL=\n" +
            "BRAND=\n" +
            "MANUFACTURER=\n" +
            "DEVICE=\n" +
            "NAME=\n" +
            "PRODUCT=\n";

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