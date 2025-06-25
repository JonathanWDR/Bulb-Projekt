
const img = document.getElementById("bulb-img");
const bulbWrapper = document.getElementById("bulb-fill-wrapper");
let bulbFillPath = null; // this will hold the actual <path> inside the SVG

const colorCircles = document.querySelectorAll('.color-circle');
const brightnessSlider = document.getElementById("brightness");

let isLampOn = false; // global lamp state
let brightness = brightnessSlider.value; // default from slider
let colorHex = "#ffdd22"; // default color

fetch('./assets/black.svg')
  .then(res => res.text())
  .then(svgText => {
    bulbWrapper.innerHTML = svgText;

    bulbFillPath = bulbWrapper.querySelector('#bulb-fill');

    bulbWrapper.querySelector('svg').style.width = "100%";
    bulbWrapper.querySelector('svg').style.height = "100%";

    update(false);
  });


fetch('/getState', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getState' })
    })
    .then(res => res.json())
    .then(data => console.log("getState request sent:", data))
    .catch(err => console.error("Error sending getState request:", err));


function toggleLampState(on) {
    if (on === undefined) {
        isLampOn = !isLampOn;
    } else if (on !== isLampOn) {
        isLampOn = on;
    } else {
        return;
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

function pickedColor(color) {
    console.log("Picked color:", color);
    colorHex = color;
    update();
}

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

const hexToRgb = (hex) => {
           const cleanHex = hex.replace('#', '');
           const bigint = parseInt(cleanHex, 16);
           const r = (bigint >> 16) & 255;
           const g = (bigint >> 8) & 255;
           const b = bigint & 255;
           return { r, g, b };
       };

function update(sendToBackend = true) {

    if(sendToBackend){sendState(isLampOn, brightness, colorHex);}
    

    if (isLampOn) {
        img.classList.add("glow-on");

        const rgb = hexToRgb(colorHex);
        
        const normalizedBrightness = brightness / 100;
        const curvedBrightness = Math.pow(normalizedBrightness, 1/3);
       
        const minValue = 28; // #1c1c1c = 28 in decimal
        const adjustedR = Math.round(minValue + (rgb.r - minValue) * curvedBrightness);
        const adjustedG = Math.round(minValue + (rgb.g - minValue) * curvedBrightness);
        const adjustedB = Math.round(minValue + (rgb.b - minValue) * curvedBrightness);
       
        bulbFillPath.style.fill = `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
        
    } else {
        img.classList.remove("glow-on");

        bulbFillPath.style.fill = "#1c1c1c"
    }

    // Update brightness (alpha)
    const alpha = (brightness / 100).toFixed(2);
    console.log("Brightness (alpha):", alpha);
    img.style.setProperty('--glow-alpha', alpha);

    // Update color (RGB)
    // Convert hex color to rgb
    
    const rgb = hexToRgb(colorHex);
    img.style.setProperty('--glow-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);


    console.log("Updated state:", {
        poweredOn: isLampOn,
        brightness,
        color: colorHex
    });
}

const socket = new WebSocket('ws://localhost:8081');

socket.onmessage = (event) => {
  const backendLampState = JSON.parse(event.data);
  console.log('Lamp state received from backend:', backendLampState);
  isLampOn = backendLampState.poweredOn;
  brightness = backendLampState.brightness;
  colorHex = backendLampState.color;
  update(false);
};