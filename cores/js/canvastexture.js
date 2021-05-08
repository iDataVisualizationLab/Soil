//<editor-fold desc="Canvas and Texture Handler, low level classes, can be ignored">
class CanvasTexture {
    createCanvas(data, width, height, colorScale) {
        const scaler = d3.scaleLinear().domain([0, 50]).range([0, 400]);
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = scaler(width);
        ctx.canvas.height = scaler(height);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 0.05;
        const cellSize = scaler(1);
        const startY = scaler(49);
        data.t.forEach((t, i) => {
            ctx.fillStyle = colorScale(t);
            const x = scaler(data.x[i]);
            const y = startY - scaler(data.y[i]);
            ctx.fillRect(x, y, cellSize, cellSize); //49, not 50 since we go from 0 to 49
            ctx.strokeRect(x, y, cellSize, cellSize);
        });
        return ctx.canvas;
    }

    createTexture(data, width, height, colorScale) {
        const canvas = this.createCanvas(data, width, height, colorScale);
        const texture = new THREE.CanvasTexture(canvas);
        texture.center.x = 0.5;
        texture.center.y = 0.5;
        return texture;
    }
}

class TextureHandler {
    constructor(interpolator, element, colorScale) {
        if (interpolator && element && colorScale) {
            this.elementalIPD = interpolator.getInterpolatedData(element);
            this.colorScale = colorScale;
        }
    }

    createCanvas(data) {
        const canvasTexture = new CanvasTexture();
        let canvas = canvasTexture.createCanvas(data, 50, 50, this.colorScale);
        return canvas;
    }

    createTexture(data) {
        const canvas = this.createCanvas(data);
        const texture = new THREE.CanvasTexture(canvas);
        texture.center.x = 0.5;
        texture.center.y = 0.5;
        return texture;
    }

    addLocations2Canvas(canvas, locationMapping) {
        const ctx = canvas.getContext('2d');
        const step = 50 / 5;
        const halfStep = step / 2;
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 0.2;
        ctx.font = '20px serif';

        const scaler = d3.scaleLinear().domain([0, 50]).range([0, canvas.width]);

        const locations = Object.keys(locationMapping);
        locations.forEach(loc => {
            const pos = locationMapping[loc];
            const x = scaler(pos[0] * step + halfStep);
            const y = scaler(50 - (pos[1] * (step) + halfStep));
            ctx.fillText(loc, x, y);
            ctx.strokeText(loc, x, y);
        });
    }

    createTextureWithLocations(data, locationMapping) {
        const canvas = this.createCanvas(data);
        this.addLocations2Canvas(canvas, locationMapping);
        const texture = new THREE.CanvasTexture(canvas);
        texture.center.x = 0.5;
        texture.center.y = 0.5;
        return texture;
    }

    createTextureWithDepths(data) {
        const canvas = this.createCanvas(data);
        const ctx = canvas.getContext('2d');
        const scaler = d3.scaleLinear().domain([0, 10]).range([0, canvas.height]);
        for (let i = 1; i < 10; i++) {
            const y = scaler(i);
            //The line
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 0.2;
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
            //The text
            const text = `${i * 10} cm`;
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'black';
            ctx.lineWidth = 0.2;
            ctx.font = '15px serif';
            ctx.textAlign = 'right';
            ctx.fillText(text, canvas.width, y);
            ctx.strokeText(text, canvas.width, y);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.center.x = 0.5;
        texture.center.y = 0.5;
        return texture;
    }

    createLocationTexture(locationMapping, size) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //Add a circle
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
        ctx.stroke();
        this.addLocations2Canvas(canvas, locationMapping);
        const texture = new THREE.CanvasTexture(canvas);
        texture.center.x = 0.5;
        texture.center.y = 0.5;
        return texture;
    }
}

//</editor-fold>
class VerticalCanvasTextureHandler extends TextureHandler {
    constructor(interpolator, element, colorScale) {
        super(interpolator, element, colorScale);
    }

    getData(cutAngle) {
        cutAngle = -cutAngle; //
        const sina = Math.sin(cutAngle);
        const cosa = Math.cos(cutAngle);
        const startX = 25 - 25 * cosa;
        const startZ = 25 - 25 * sina;
        const endX = 25 + 25 * cosa;
        const endZ = 25 + 25 * sina;
        const stepX = (endX - startX) / 50;
        const stepZ = (endZ - startZ) / 50;
        const data = {
            x: [],
            y: [],
            t: []
        }
        //Divide this work into parts and use web worker here.
        //1. for each of the y interpolated step (1-50)
        for (let yValIdx = 0; yValIdx < 50; yValIdx++) {
            let y = yValIdx;
            //2. for each of the x interpolated step (1-50)
            for (let xValIdx = 0; xValIdx < 50; xValIdx++) {
                let x = Math.round(startX + xValIdx * stepX);
                if (x === 50) x = 49;
                let z = Math.round(startZ + xValIdx * stepZ);
                if (z === 50) z = 49;
                // This is another approach to skip index assuming that z goes first, then x goes, then y goes
                // e.g. zIdx: 0 0 0 - 0 0 0 - 0 0 0 - 1 1 1 - 1 1 1 - 1 1 1 - 2 2 2 - 2 2 2 - 2 2 2
                //            0 0 0 - 1 1 1 - 2 2 2 - 0 0 0 - 1 1 1 - 2 2 2 - 0 0 0 - 1 1 1 - 2 2 2
                //            0 1 2 - 0 1 2 - 0 1 2 - 0 1 2 - 0 1 2 - 0 1 2 - 0 1 2 - 0 1 2 - 0 1 2
                // 1. find the starting index for z
                let startZIdx = this.elementalIPD.z.indexOf(z);
                //z index remains the same for every 50*50 range z will not be less or more than 50*50 values
                // 2. find y starting from zIndex in the next 50*50 elements
                let startXIdx = this.elementalIPD.x.indexOf(x, startZIdx);
                // 3. find x starting from this in the next 50
                let theIdx = this.elementalIPD.y.indexOf(y, startXIdx);
                //now the values
                let t = this.elementalIPD.t[theIdx];
                data.x.push(xValIdx);
                data.y.push(yValIdx);
                data.t.push(t);
            }
        }
        return data;
    }

    getTexture(cutAngle) {
        // return this.createTexture(this.getData(cutAngle));
        return this.createTextureWithDepths(this.getData(cutAngle));
    }

    getCanvas(cutAngle) {
        return this.createCanvas(this.getData(cutAngle));
    }
}

class HorizontalCanvasTextureHandler extends TextureHandler {
    constructor(interpolator, element, colorScale) {
        super(interpolator, element, colorScale);
    }

    getData(yValue) {
        const data = {
            x: this.elementalIPD.x.filter((x, i) => Math.round(this.elementalIPD.y[i]) === yValue), //TODO: may need to do the rounding first when generating data to avoid repeating it here
            y: this.elementalIPD.z.filter((z, i) => Math.round(this.elementalIPD.y[i]) === yValue),
            t: this.elementalIPD.t.filter((t, i) => Math.round(this.elementalIPD.y[i]) === yValue)
        }
        return data;
    }

    getTexture(yValue) {
        return this.createTexture(this.getData(yValue));
    }

    getTextureWithLocation(yValue, locationMapping) {
        return this.createTextureWithLocations(this.getData(yValue), locationMapping);
    }

}

