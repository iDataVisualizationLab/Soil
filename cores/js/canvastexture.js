class CanvasTexture {
    createCanvas(data, width, height, colorScale) {
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        data.t.forEach((t, i) => {
            ctx.fillStyle = colorScale(t);
            ctx.fillRect(data.x[i], 49 - data.y[i], 1, 1); //49, not 50 since we go from 0 to 49
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

class HorizontalCanvasTextureHandler {
    constructor(interpolator, element, colorScale) {
        this.elementalIPD = interpolator.getInterpolatedData(element);
        this.colorScale = colorScale;
    }

    getCanvas(yValue) {
        const data = {
            x: this.elementalIPD.x.filter((x, i) => Math.round(this.elementalIPD.y[i]) === yValue), //TODO: may need to do the rounding first when generating data to avoid repeating it here
            y: this.elementalIPD.z.filter((z, i) => Math.round(this.elementalIPD.y[i]) === yValue),
            t: this.elementalIPD.t.filter((t, i) => Math.round(this.elementalIPD.y[i]) === yValue)
        }
        const canvasTexture = new CanvasTexture();
        let canvas = canvasTexture.createCanvas(data, 50, 50, this.colorScale);
        return canvas;
    }

    getTexture(yValue) {
        const canvas = this.getCanvas(yValue);
        const texture = new THREE.CanvasTexture(canvas);
        texture.center.x = 0.5;
        texture.center.y = 0.5;
        return texture;
    }
}
