class Vertices {
    constructor(n) {
        const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.items = [];
        for (let i = 0; i < n; i++) {
            this.items.push([alphabets[i], i * 360 / n]);
        }
    }

    rotate(m) {
        for (let i = 0; i < m; i++) {
            const temp = this.items.pop();
            this.items.unshift(temp);
        }
    }

    reverse() {
        this.items.reverse();
    }
}

// Select HTML elements
const container = document.getElementById('canvas-container');
const rangeInput = document.getElementById('vertexInput');
const rangeValue = document.getElementById('vertexValue');
const rotInput = document.getElementById('rotInput');
const rotValue = document.getElementById('rotValue');
const reflInput = document.getElementById('reflInput');
const reflValue = document.getElementById('reflValue');
const updateButton = document.getElementById('updateButton');

const width = container.offsetWidth;
const height = container.offsetHeight;
let n = 7; // Default number of sides
let radius = width / 8; // Default radius
let rotation = 0; // Rotation
let reflection = 0; // Reflection

let transformedVertices = new Vertices(n);
console.log("define vertices",transformedVertices);

// Update number of sides as user moves the slider
rangeInput.addEventListener('input', () => {
    n = parseInt(rangeInput.value);
    rangeValue.textContent = n;
    transformedVertices = new Vertices(n);
    draw();
});

// Update Button
updateButton.addEventListener('click', () => {
    rotation = parseInt(rotInput.value);
    reflection = parseInt(reflInput.value);
    draw();
});


function setup() {
    const canvas = createCanvas(width, height);
    canvas.parent('canvas-container');
    noLoop();
}

function draw() {
    background(255, 219, 194);
    translate(width / 2, height / 2);
    // Display Text
    drawTransformationText();

    // Draw static arrow
    drawArrow();

    // Draw the initial polygon
    //let vertices = new Vertices(n);
    drawPolygon(transformedVertices, [width / 3, 0]);

    // Apply transformations
    
    //console.log(transformedVertices)
    transformedVertices.rotate(rotation);
    //console.log(transformedVertices)
    if (reflection === 1) {
        transformedVertices.reverse();
    }
    console.log("updated vertices", transformedVertices)
    // Draw the transformed polygon
    drawPolygon(transformedVertices, [-width / 3, 0]);

    translate(-width / 2, -height / 2);
}

// Draw arrow in the center
function drawArrow() {
    stroke(0);
    strokeWeight(2);
    fill(0);
    line(-width / 10, 0, width / 10, 0);
    triangle(width / 10, 0, width / 10 - 10, 5, width / 10 - 10, -5);
}

// Draw a polygon and its points
function drawPolygon(verticesObj, trans) {
    const coords = getCoordinates(n, radius, trans);
    const vertices = verticesObj.items;
    beginShape();
    stroke(255, 106, 0);
    fill(51);
    strokeWeight(2);
    for (let [x, y] of coords) {
        vertex(x, y);
    }
    endShape(CLOSE);

    // Draw points and labels
    for (let i = 0; i < n; i++) {
        const [x, y, labelX, labelY] = coords[i];
        const [label, hue] = vertices[i];

        // Draw points
        colorMode(HSB);
        stroke(hue, 100, 100);
        strokeWeight(10);
        point(x, y);

        // Draw labels
        noStroke();
        fill(0);
        textAlign(CENTER, CENTER);
        text(label, labelX, labelY); 
    }
    colorMode(RGB);

    //Display reflection
    let x1, x2, y1, y2;
    if (n%2 == 1) {
        i = (n-1)/2;
        x1 = coords[i][0];
        y1 = coords[i][1];
        [x2, y2] = midPoint(n-1, 0, coords);
    }
    else {
        [x1, y1] = midPoint(n/2 - 1, n/2, coords );
        [x2, y2] = midPoint(n-1, 0, coords);
    }
    stroke(255, 106, 0);
    strokeWeight(2);
    drawingContext.setLineDash([10, 5]);
    line(x1, y1, x2, y2);
    drawingContext.setLineDash([]);
}
//Find Mid-Point
function midPoint(i, j, points) {
    x = (points[i][0] + points[j][0])/2
    y = (points[i][1] + points[j][1])/2
    return [x, y]
}

// Calculate polygon vertices
function getCoordinates(n, radius, trans) {
    const coords = [];
    for (let i = 0; i < n; i++) {
        const angle = TWO_PI * i / n;
        const x = radius * cos(angle) - trans[0];
        const y = -(radius * sin(angle) - trans[1]);
        const labelX = x + 15 * cos(angle);
        const labelY = y - 15 * sin(angle);
        coords.push([x, y, labelX, labelY]);
    }
    return coords;
}

//Display formula
function drawTransformationText() {
    fill(0);
    strokeWeight(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    const reflectionText = reflection === 1 ? `s` : ``; // Add "s" if reflection is active
    const transformationText = `r^${rotation}${reflectionText ? `s^${reflection}` : ``}`;
    text(transformationText, 0, -height / 8); // Position text above the arrow
}


