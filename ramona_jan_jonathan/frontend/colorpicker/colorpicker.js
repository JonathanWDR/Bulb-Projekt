const colorWheel = document.getElementById('colorWheel');
const colorPreview = document.getElementById('colorPreview');

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


        let isDragging = false;
        let currentColor = '#ffffff';
        
        function updateColorFromPosition(event) {
            const rect = colorWheel.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const posX = event.clientX - rect.left - centerX;
            const posY = event.clientY - rect.top - centerY;
            
            const radius = Math.min(rect.width, rect.height) / 2;
            const distance = Math.sqrt(posX * posX + posY * posY);
            const normalizedDistance = Math.min(distance / radius, 1);
            

            let angle = Math.atan2(posY, posX) * (180 / Math.PI);
            angle = (angle + 360) % 360;
            

            const hue = (angle + 90) % 360;
            

            const saturation = Math.round(normalizedDistance * 100);
            const lightness = 100 - normalizedDistance * 50;
            
            const hslColor = `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`;
            const hexColor = hslToHex(hue, saturation, lightness);

            currentColor = hexColor;

            if (isDragging) {
                colorPreview.style.left = (event.clientX + 30) + 'px';
                colorPreview.style.top = (event.clientY - 30) + 'px';
                colorPreview.style.backgroundColor = hslColor;
                colorPreview.style.opacity = '1';
            }
            
        }

        // Mouse events for clicking and dragging
        colorWheel.addEventListener('mousedown', function(event) {
            isDragging = true;
            updateColorFromPosition(event);
            event.preventDefault();
        });

        document.addEventListener('mousemove', function(event) {
            if (isDragging) {
                updateColorFromPosition(event);
            }
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                colorPreview.style.opacity = '0';

                pickedColor(currentColor);
            }
        });


        colorWheel.addEventListener('touchstart', function(event) {
            isDragging = true;
            const touch = event.touches[0];
            updateColorFromPosition(touch);
            event.preventDefault();
        });

        document.addEventListener('touchmove', function(event) {
            if (isDragging) {
                const touch = event.touches[0];
                updateColorFromPosition(touch);
                event.preventDefault();
            }
        });

        document.addEventListener('touchend', function() {
            if (isDragging) {
                isDragging = false;
                colorPreview.style.opacity = '0';
                pickedColor(currentColor);
            }
        });
