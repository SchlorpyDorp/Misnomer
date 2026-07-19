#!/system/bin/sh

ui_print " "
ui_print "====================================="
ui_print "         Misnomer v1.0.3"
ui_print "====================================="
ui_print " "
ui_print "- Initialising installer..."
ui_print "- Checking environment..."
ui_print "- Preparing configuration..."
ui_print "- Creating configuration directory..."
ui_print "- Setting file permissions..."
ui_print "- Installing WebUI assets..."
ui_print "- Registering boot service..."
ui_print "- Calibrating gaslighting engine..."
ui_print "- Teaching Android to lie..."
ui_print " "

mkdir -p "$MODPATH/config"

if [ ! -f "$MODPATH/config/props.conf" ]; then
cat > "$MODPATH/config/props.conf" << 'EOF'
MODEL=
BRAND=
MANUFACTURER=
DEVICE=
NAME=
PRODUCT=
EOF
fi

set_perm "$MODPATH/post-fs-data.sh" 0 0 0755
set_perm_recursive "$MODPATH/webroot" 0 0 0755 0644
set_perm_recursive "$MODPATH/config" 0 0 0755 0644

ui_print "- Installation complete."
ui_print "- Reboot required."
ui_print " "
ui_print "Gaslight Android."
ui_print " "