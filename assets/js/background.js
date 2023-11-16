const pastelColors = [
    '#D8A8B8',
    '#B8D8A8',
    '#A4D4B4',
    '#B8B8D8',
    '#A4A4D4',
    '#C5C5A5',
    '#C5A5C5',
    '#A5C5C5',
];

async function changeBackgroundColor() {
    const colorIndex = Math.floor(Math.random() * pastelColors.length);
    const color = pastelColors[colorIndex];
    document.body.style.backgroundColor = color;
}

changeBackgroundColor();
