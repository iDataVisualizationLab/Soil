function generatePointCloudGeometry(contourData, d3c) {
    //If doesn't input d3c, means using the individual scale for each element
    let colorScale = null;
    let inputD3c = d3c;
    if (!d3c) {
        inputD3c = null;
        let csD = [];
        let csR = [];
        contourData.colorScale.forEach(csv => {
            csD.push(csv[0]);
            csR.push(csv[1]);
        });
        colorScale = d3.scaleLinear()
            .domain(csD)
            .range(csR)
            .interpolate(d3.interpolateRgb);
    }

    let geometry = new THREE.BufferGeometry();
    let numPoints = contourData.x.length;
    let positions = new Float32Array(numPoints * 3);
    let colors = new Float32Array(numPoints * 3);
    let xScale = d3.scaleLinear().domain(d3.extent(contourData.x)).range([-0.5, 0.5]);
    let yScale = d3.scaleLinear().domain(d3.extent(contourData.y)).range([-0.5, 0.5]);
    let zScale = d3.scaleLinear().domain(d3.extent(contourData.z)).range([0, 1.0]);
    let maxZ = d3.max(contourData.z);

    for (let k = 0; k < numPoints; k += 3) {
        let u = xScale(contourData.x[k]);
        let v = yScale(contourData.y[k]);
        let x = u;
        let y = v;

        let z = zScale(contourData.z[k]);
        positions[k] = x;
        positions[k + 1] = y;
        positions[k + 2] = z;

        let intensity = contourData.z[k] / maxZ;

        if (!inputD3c) {
            d3c = d3.color(colorScale(z));
            intensity = 1;//Keep intensity
        }

        let color = new THREE.Color(d3c.r / 255.0, d3c.g / 255.0, d3c.b / 255.0);

        colors[k] = color.r * intensity;
        colors[k + 1] = color.g * intensity;
        colors[k + 2] = color.b * intensity;

    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeBoundingBox();
    //Add some more data to expose outside
    geometry.customData = {
        gridData: contourData,
        xScale: xScale,
        yScale: yScale,
        zScale: zScale
    };
    return geometry;
}

function generatePointcloud(xyzData, d3c) {
    let geometry = generatePointCloudGeometry(xyzData, d3c);
    let material = new THREE.PointsMaterial({size: pointSize, vertexColors: THREE.VertexColors});
    return new THREE.Points(geometry, material);
}

function generatePointcloudForElmIdx(elmIndex, d3c) {
    if (!contourDataProducer) {
        contourDataProducer = new ContourDataProducer(data);
    }
    let gridData = contourDataProducer.getGridDataByElmIndex(elmIndex, true, 0.1);

    return generatePointcloud(gridData, d3c);
}