#!/system/bin/sh

ui_print " "
ui_print "================================="
ui_print "          Misnomer v1.0.2"
ui_print "================================="
ui_print " "
ui_print "- Installing Misnomer"
ui_print "- Preparing configuration"
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

ui_print "- Installation complete"
ui_print " "