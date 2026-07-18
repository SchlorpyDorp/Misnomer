<p align="center">
  <img src="assets/banner.png" alt="Misnomer - Gaslight Android" width="100%">
</p>

<h1 align="center">Misnomer</h1>

<p align="center">
  <b>Gaslight Android.</b>
</p>

<p align="center">
  Change Android device identity properties through a simple WebUI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-v1.0.2-7c5cff?style=flat-square">
  <img src="https://img.shields.io/badge/KernelSU-Supported-7c5cff?style=flat-square">
  <img src="https://img.shields.io/badge/Magisk-KsuWebUI-orange?style=flat-square">
</p>

---

## About

**Misnomer** is a lightweight root module that allows you to change the identity properties reported by Android.

Instead of manually editing system properties, Misnomer provides a simple WebUI where values can be changed, saved and applied on reboot.

Misnomer currently supports changing:

- Model
- Brand
- Manufacturer
- Device
- Name
- Product

Changes are applied systemlessly during boot.

---

## Screenshots

<p align="center">
  <img src="assets/webui.png" width="45%">
  &nbsp;&nbsp;
  <img src="assets/module.png" width="45%">
</p>

---

## Features

- Simple WebUI
- Change multiple Android identity properties
- Systemless property modification
- Persistent configuration
- Restore original values
- Reboot directly from the WebUI
- Lightweight module structure
- KernelSU and KernelSU Next support
- Magisk WebUI support through KsuWebUI

---

## Compatibility

### KernelSU / KernelSU Next

Misnomer works natively with KernelSU-compatible managers that support module WebUI.

Install the module ZIP, reboot, then open Misnomer directly from the module manager.

### Magisk

The core Misnomer module structure is compatible with Magisk.

Because the official Magisk app does not provide native KernelSU-style WebUI support, Magisk users should install:

**KsuWebUI**

https://github.com/adivenxnataly/KsuWebUI

KsuWebUI adds an **Open with KsuWebUI** option for compatible modules with a WebUI.

Magisk support should currently be considered experimental until broader testing has been completed.

---

## Installation

### KernelSU / KernelSU Next

1. Download the latest Misnomer ZIP from Releases.
2. Open your KernelSU-compatible manager.
3. Install the ZIP as a module.
4. Reboot your device.
5. Open Misnomer from the module's WebUI button.

### Magisk

1. Install KsuWebUI.
2. Download the latest Misnomer ZIP from Releases.
3. Install the ZIP through Magisk.
4. Reboot your device.
5. Open Misnomer using the **Open with KsuWebUI** option.

---

## Usage

Open the Misnomer WebUI and enter the identity properties you want Android to report.

Leave a field blank if you do not want Misnomer to modify that property.

Press **Save changes**, then reboot your device.

The configured values will be applied during boot.

Use **Restore original values** to clear the configured spoofed values and return to the device defaults after rebooting.

---

## How it works

Misnomer stores the configured identity values in:

```text
/data/adb/modules/misnomer/config/props.conf