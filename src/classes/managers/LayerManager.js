import * as PIXI from "pixi.js";

class LayerManager {
  constructor(app) {
    this.app = app;
    this.layers = new Map();
  }

  createLayer(layerName, zIndex) {
    const container = new PIXI.Container();
    container.zIndex = zIndex;
    this.app.stage.addChild(container);
    this.layers.set(layerName, container);
    this.sortLayers();
    return container;
  }

  clearLayers() {
    this.layers.forEach((layer) => {
      layer.removeChildren();
    });
  }

  addObjectToLayer(object, layerName) {
    const layer = this.layers.get(layerName);
    if (layer != null) {
      this.layer.addChild(object);
      this.sortLayers();
    }
  }

  getLayer(layerName) {
    //null check
    if (!this.layers.has(layerName)) return null;

    return this.layers.get(layerName);
  }

  sortLayers() {
    // this.layers.sort((a, b) => a.zIndex - b.zIndex);
    // this.layers.forEach((layer, index) => {
    //     if (layer.zIndex !== index) {
    //         layer.zIndex = index;
    //     }
    // });
  }

  renderLayers(stage) {
    this.layers.forEach((layer) => {
      stage.addChild(layer);
    });
  }
}

export default LayerManager;
