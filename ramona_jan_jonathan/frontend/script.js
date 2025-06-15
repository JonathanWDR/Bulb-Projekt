
const img = document.getElementById("bulb-img");
const colorCircles = document.querySelectorAll('.color-circle');
const brightnessSlider = document.getElementById("brightness");

let isLampOn = false; // global lamp state
let brightness = brightnessSlider.value; // default from slider
let colorHex = "#aaffff"; // default color


function toggleLampState(on) {
    if (on === undefined) {
        isLampOn = !isLampOn;
    } else if (on !== isLampOn) {
        isLampOn = on;
    } else {
        return; // no change
    }

    update();
}

img.addEventListener("click", () => {
    toggleLampState(!isLampOn);
});

/*Farbregler*/

function rgbToHex(rgb) {
    const [r, g, b] = rgb.split(',').map(n => parseInt(n.trim()));
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

colorCircles.forEach(circle => {
    circle.addEventListener('click', () => {
        const style = window.getComputedStyle(circle);
        const color = style.backgroundColor;
        const rgbMatch = color.match(/\d+/g);
        if (rgbMatch) {
            const rgb = rgbMatch.slice(0, 3).join(', ');
            colorHex = rgbToHex(rgb);

            update();
            
        }
    });
});



// Send only once the slider is released
brightnessSlider.addEventListener('change', () => {
    brightness = brightnessSlider.value;
    update(); // Send the brightness value only here
});


function sendState(poweredOn, brightness, color) {
    const state = {
        poweredOn,
        brightness: parseInt(brightness),
        color
    };
    console.log("Sending state:", state);

    fetch('/led', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
    })
    .then(res => res.json())
    .then(data => console.log("State sent:", data))
    .catch(err => console.error("Error sending state:", err));
}


function update() {

    sendState(isLampOn, brightness, colorHex);

    if (isLampOn) {
        img.classList.add("glow-on");
        img.src = "./assets/off_white.svg";  // <-- Add this line
    } else {
        img.classList.remove("glow-on");
        img.src = "./assets/off_white.svg";      // <-- Add this line
    }

    // Update brightness (alpha)
    const alpha = (brightness / 100).toFixed(2);
    img.style.setProperty('--glow-alpha', alpha);

    // Update color (RGB)
    // Convert hex color to rgb
    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    };

    img.style.setProperty('--glow-rgb', hexToRgb(colorHex));

    console.log("Updated state:", {
        poweredOn: isLampOn,
        brightness,
        color: colorHex
    });
}

