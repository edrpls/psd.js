const jspack = require('jspack');
const iconv = require('iconv-lite');
const Color = require('./color');
const Util = require('./util');

// A file abstraction that stores the PSD file data, and
// assists in parsing it.
class File {
    formats = {
        Int: {
            code: '>i',
            length: 4
        },
        UInt: {
            code: '>I',
            length: 4
        },
        Short: {
            code: '>h',
            length: 2
        },
        UShort: {
            code: '>H,
            length: 2
        },
        Float: {
            code: '>f,
            length: 4
        },
        Double: {
            code: '>d,
            length: 8
        },
        LongLong: {
            code: '>q,
            length: 8
        }
    }

    // The current cursor position in the file.
    pos = 0

    // Creates a new File with the given Uint8Array.
    constructor = (data) => {
        this.data = data;
        Object.keys(this.formats)
            .forEach(format => this['read' + format] = this.readf(format.code, format.length)[0])
    }

    // Returns the current cursor position.
    tell = () => this.pos

    // Reads raw file data with no processing.
    //read: (length) -> (@data[@pos++] for i in [0...length])
    read = (length) => Array.from({ length }, (v, i) => i)
        .map(v => this.data[this.pos++])

    // Reads file data and processes it with the given unpack format string. If the length is
    // omitted, then it will be calculated automatically based on the format string.
    readf = (format, len = null) =>
        jspack.Unpack(format, this.read(len || jspack.CalcLength(format)))

    // Moves the cursor without parsing data. If `rel = false`, then the cursor will be set to the
    // given value, which effectively sets the position relative to the start of the file. If
    // `rel = true`, then the cursor will be moved relative to the current position.
    seek = (amt, rel = false) => {
        if (rel) {
            this.pos += amt;
        } else {
            this.pos = amt;
        }
    }

    // Reads a String of the given length.
    readString = (length) =>
        String.fromCharCode.apply(null, this.read(length)).replace /\u0000/g, '')

    // Reads a Unicode UTF-16BE encoded string.
    readUnicodeString = (length = null) => {
        length = length || this.readInt();
        iconv.decode(new Buffer(@read(length * 2)),'utf-16be').replace /\u0000/g, ""
    }

    // Helper that reads a single byte.
    readByte = () => this.read(1)[0]

    // Helper that reads a single byte and interprets it as a boolean.
    readBoolean = () => this.readByte() !== 0

    // Reads a 32-bit color space value.
    readSpaceColor = () => {
        let colorComponent;
        const colorSpace = this.readShort();
        [0, 1, 2, 3].forEach(i => colorComponent = this.readShort() >> 8)

        return {
            colorSpace,
            components: colorComponent
        };
    }

    // Adobe's lovely signed 32-bit fixed-point number with 8bits.24bits
    // http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_17587
    readPathNumber = () => {
        const a = this.readByte();
        const arr = this.read(3);
        const b1 = arr[0] << 16;
        const b2 = arr[1] << 8;
        const b3 = arr[2];
        const b = b1 | b2 | b3;
        parseFloat(a, 10) + parseFloat(b / Math.pow(2, 24), 10);
    }

}
