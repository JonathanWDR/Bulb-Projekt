const colorWheel = document.getElementById('colorWheel');

        function hslToHex(h, s, l) {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, '0');
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        }

        colorWheel.addEventListener('click', function(event) {
            const rect = colorWheel.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Get click position relative to center
            const clickX = event.clientX - rect.left - centerX;
            const clickY = event.clientY - rect.top - centerY;
            
            // Calculate distance from center (0 to 1)
            const radius = Math.min(rect.width, rect.height) / 2;
            const distance = Math.sqrt(clickX * clickX + clickY * clickY);
            const normalizedDistance = Math.min(distance / radius, 1);
            
            // Calculate angle (0 to 360 degrees)
            let angle = Math.atan2(clickY, clickX) * (180 / Math.PI);
            angle = (angle + 360) % 360; // Normalize to 0-360
            
            // Calculate hue (0-360) - adjust for color wheel starting position
            const hue = (angle + 90) % 360;
            
            // Calculate saturation based on distance from center (0-100%)
            const saturation = Math.round(normalizedDistance * 100);
            
            // Fixed lightness for this color wheel
            const lightness = 50;
            
            // Create color values
            const hexColor = hslToHex(hue, saturation, lightness);
            

            pickedColor(hexColor);
        });