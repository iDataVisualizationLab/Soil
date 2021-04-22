class CanvasTexture {
    createCanvas(data, width, height, colorScale) {
        const scaler = d3.scaleLinear().domain([0, 50]).range([0, 200]);
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
        this.elementalIPD = interpolator.getInterpolatedData(element);
        this.colorScale = colorScale;
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

}

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
        //We need to break this down to make it faster.
        for (let yValIdx = 0; yValIdx < 50; yValIdx++) {
            let y = yValIdx;
            for (let xValIdx = 0; xValIdx < 50; xValIdx++) {
                let x = Math.round(startX + xValIdx * stepX);
                if (x === 50) x = 49;
                let z = Math.round(startZ + xValIdx * stepZ);
                if (z === 50) z = 49;
                let t = this.elementalIPD.t.find((t, i) => {
                    return (this.elementalIPD.x[i] === x) && (this.elementalIPD.y[i] === y) && (this.elementalIPD.z[i] === z)
                });
                data.x.push(xValIdx);
                data.y.push(yValIdx);
                data.t.push(t);
            }
        }
        return data;
    }

    getTexture(cutAngle) {
        return this.createTexture(this.getData(cutAngle));
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

}
