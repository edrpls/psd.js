/*
   A general purpose parser for Photoshop files. PSDs are broken up in to 4 logical sections:
   the header, resources, the layer mask (including layers), and the preview image. We parse
   each of these sections in order.

   ## NodeJS Examples

 ** Parsing asynchronously **
 ``` javascript
 PSD.open('path/to/file.psd')
 .then(psd => console.log(psd.tree().export());
 ```

 ** Parsing synchronously **
 ``` javascript
 psd = PSD.fromFile('path/to/file.psd');
 psd.parse();
 console.log(psd.tree().export());
 ```
 */


const Files = require('./psd/files');
const LazyExecute = require('./psd/lazy_execute');
const Header = require('./psd/header');
const Resources = require('./psd/resources');
const LayerMask = require('./psd/layer_mask');
const Image = require('./psd/image');

class PSD {

    // Creates a new PSD object. Typically you will use a helper method to instantiate
    // the PSD object. However, if you already have the PSD data stored as a Uint8Array,
    // you can instantiate the PSD object directly.
    constructor = (data) => {
        this.file = new Files(data);
        this.parsed = false;
        this.header = null;
        Object.defineProperty(this, 'layers', { get: () => this.layerMask.layers });
        //RSVP.on 'error', (reason) -> console.error(reason)
    }

    Node = {
        Root: require('./psd/nodes/root')
    }

    fromURL = (url) => new Promise((resolve, reject) => {
        xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
          data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
          psd = new PSD(data);
          psd.parse();
          resolve(psd);
        }
        xhr.send();
      })

    fromEvent = (evt) => new Promise((resolve, reject) => {
        file = evt.dataTransfer.files[0];
        reader = new FileReader();
        reader.onload = (e) => {
            psd = new PSD(new Uint8Array(e.target.result));
            psd.parse();
            resolve(psd);
        }
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    }

    fromDroppedFile = (file) => new Promise (resolve, reject) => {
        reader = new FileReader();
        reader.onload = (e) => {
            psd = new PSD(new Uint8Array(e.target.result));
            psd.parse();
            resolve(psd);
        }
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    }

    // Parses the PSD. You must call this method before attempting to
    // access PSD data. It will not re-parse the PSD if it has already
    // been parsed.
    parse = () => {
        if (this.parsed) return;

        this.parseHeader();
        this.parseResources();
        this.parseLayerMask();
        this.parseImage();
        this.parsed = true;
    }

    // The next 4 methods are responsible for parsing the 4 main sections of the PSD.
    // These are private, and you should never call them from your own code.
    parseHeader = () => {
        this.header = new Header(this.file);
        this.header.parse();
    }

    parseResources = () => {
        const resources = new Resources(this.file);
        this.resources = new LazyExecute(resources, this.file)
            .now('skip')
            .later('parse')
            .get();
    }

    parseLayerMask = () => {
        const layerMask = new LayerMask(this.file, this.header);
        this.layerMask = new LazyExecute(layerMask, this.file)
            .now('skip')
            .later('parse')
            .get();
    }

    parseImage = () => {
        const image = new Image(this.file, this.header);
        this.image = new LazyExecute(image, this.file)
            .later('parse')
            .ignore('width', 'height')
            .get();
    }

    // Returns a tree representation of the PSD document, which is the
    // preferred way of accessing most of the PSD's data.
    tree = () => new PSD.Node.Root(this)
}

module.exports = PSD;
