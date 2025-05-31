export const presetColors = {
    red: {
        hue: 0,
        saturation: 100,
        color_temp: 0
    },
    orange: {
        hue: 30,
        saturation: 100,
        color_temp: 0
    },
    amber: {
        hue: 45,
        saturation: 100,
        color_temp: 0
    },
    yellow: {
        hue: 60,
        saturation: 100,
        color_temp: 0
    },
    lime: {
        hue: 75,
        saturation: 100,
        color_temp: 0
    },
    green: {
        hue: 120,
        saturation: 100,
        color_temp: 0
    },
    turquoise: {
        hue: 160,
        saturation: 100,
        color_temp: 0
    },
    cyan: {
        hue: 180,
        saturation: 100,
        color_temp: 0
    },
    skyblue: {
        hue: 200,
        saturation: 100,
        color_temp: 0
    },
    blue: {
        hue: 240,
        saturation: 100,
        color_temp: 0
    },
    indigo: {
        hue: 275,
        saturation: 100,
        color_temp: 0
    },
    violet: {
        hue: 290,
        saturation: 100,
        color_temp: 0
    },
    magenta: {
        hue: 300,
        saturation: 100,
        color_temp: 0
    },
    pink: {
        hue: 340,
        saturation: 100,
        color_temp: 0
    },

    white: {
        color_temp: 4500
    },
    daylightwhite: {
        color_temp: 5500
    },
    warmwhite: {
        color_temp: 2700
    },
    coolwhite: {
        color_temp: 6500
    },
    softwhite: {
        color_temp: 3000
    },
    neutralwhite: {
        color_temp: 4000
    },
    ultraWarmWhite: {
        color_temp: 2200
    },
    ultraCoolWhite: {
        color_temp: 7000
    }
}


export const hexToHsl = (hex: string) => {
    if (hex.toLowerCase() === '#000000') return console.error('Cannot set light to black');
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) {
        throw new Error("result is empty")
    }

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r /= 255, g /= 255, b /= 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (!h) {
        throw new Error("h is not a humber")
    }

    if(max == min){
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);

    return {
        hue: h,
        saturation: s,
        brightness: l
    };
}

export const temperature = (temp: string) => {
    let t = parseInt(temp.slice(0,-1));

    if(t<2500||t>6500) return console.error('Colour temperature should be between 2500K and 6500K.');

    return{
        color_temp: t
    };
}

export const getColour = (colour: string) => {
    colour = colour.toLowerCase();
    if (colour.startsWith('#')) return hexToHsl(colour);
    if (colour.endsWith('k')) return temperature(colour);
    if (Object.keys(presetColors).includes(colour)) return presetColors[colour as keyof typeof presetColors];
    throw new Error('Invalid Colour');
}