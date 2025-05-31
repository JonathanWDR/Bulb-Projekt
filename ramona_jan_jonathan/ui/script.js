const img = document.getElementById("bulb-img");

// Test-Logik: Toggle glow beim Klick
img.addEventListener("click", () => {
    img.classList.toggle("glow-on");
});
