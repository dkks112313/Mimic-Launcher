const memorySlider = document.getElementById("memory");
const memoryValue = document.getElementById("memory-value");
const memoryInput = document.getElementById("memory-input");
const languageSelect = document.getElementById("language-select");

memoryValue.textContent = `${memorySlider.value} GB`;
memoryInput.value = memorySlider.value;

memoryInput.addEventListener("input", () => {
    const value = parseInt(memoryInput.value);
    if (value >= 1 && value <= 16) {
        memorySlider.value = value;
        memoryValue.textContent = `${value} GB`;
    }
});

memorySlider.addEventListener("input", () => {
    const value = memorySlider.value;
    memoryValue.textContent = `${value} GB`;
    memoryInput.value = value;
});