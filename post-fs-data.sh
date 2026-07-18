#!/system/bin/sh

MODDIR=${0%/*}
CONFIG="$MODDIR/config/props.conf"

# Stop if the configuration file does not exist
[ -f "$CONFIG" ] || exit 0

# Read a value from props.conf
get_value() {
    grep "^$1=" "$CONFIG" | head -n 1 | cut -d= -f2-
}

MODEL="$(get_value MODEL)"
BRAND="$(get_value BRAND)"
MANUFACTURER="$(get_value MANUFACTURER)"
DEVICE="$(get_value DEVICE)"
NAME="$(get_value NAME)"
PRODUCT="$(get_value PRODUCT)"

# Change model
if [ -n "$MODEL" ]; then
    resetprop ro.product.model "$MODEL"
    resetprop ro.product.system.model "$MODEL"
    resetprop ro.product.vendor.model "$MODEL"
    resetprop ro.product.product.model "$MODEL"
    resetprop ro.product.system_ext.model "$MODEL"
    resetprop ro.product.odm.model "$MODEL"
fi

# Change brand
if [ -n "$BRAND" ]; then
    resetprop ro.product.brand "$BRAND"
    resetprop ro.product.system.brand "$BRAND"
    resetprop ro.product.vendor.brand "$BRAND"
    resetprop ro.product.product.brand "$BRAND"
    resetprop ro.product.system_ext.brand "$BRAND"
    resetprop ro.product.odm.brand "$BRAND"
fi

# Change manufacturer
if [ -n "$MANUFACTURER" ]; then
    resetprop ro.product.manufacturer "$MANUFACTURER"
    resetprop ro.product.system.manufacturer "$MANUFACTURER"
    resetprop ro.product.vendor.manufacturer "$MANUFACTURER"
    resetprop ro.product.product.manufacturer "$MANUFACTURER"
    resetprop ro.product.system_ext.manufacturer "$MANUFACTURER"
    resetprop ro.product.odm.manufacturer "$MANUFACTURER"
fi

# Change device
if [ -n "$DEVICE" ]; then
    resetprop ro.product.device "$DEVICE"
    resetprop ro.product.system.device "$DEVICE"
    resetprop ro.product.vendor.device "$DEVICE"
    resetprop ro.product.product.device "$DEVICE"
    resetprop ro.product.system_ext.device "$DEVICE"
    resetprop ro.product.odm.device "$DEVICE"
fi

# Change product name
if [ -n "$NAME" ]; then
    resetprop ro.product.name "$NAME"
    resetprop ro.product.system.name "$NAME"
    resetprop ro.product.vendor.name "$NAME"
    resetprop ro.product.product.name "$NAME"
    resetprop ro.product.system_ext.name "$NAME"
    resetprop ro.product.odm.name "$NAME"
fi

# Change build product
if [ -n "$PRODUCT" ]; then
    resetprop ro.build.product "$PRODUCT"
fi