/**
 * A tool for presenting an ArrayBuffer as a stream for writing some simple data types.
 *
 * By Nicholas Sherlock
 *
 * Released under the WTFPLv2 https://en.wikipedia.org/wiki/WTFPL
 */

"use strict";

(function(){
    /*
     * Create an ArrayBuffer of the given length and present it as a writable stream with methods
     * for writing data in different formats.
     */
    let ArrayBufferDataStream = function(length) {
        this.data = new Uint8Array(length);
        this.pos = 0;
    };
    
    ArrayBufferDataStream.prototype.seek = function(toOffset) {
        this.pos = toOffset;
    };

    ArrayBufferDataStream.prototype.writeBytes = function(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.data[this.pos++] = arr[i];
        }
    };

    ArrayBufferDataStream.prototype.writeByte = function(b) {
        this.data[this.pos++] = b;
    };
    
    //Synonym:
    ArrayBufferDataStream.prototype.writeU8 = ArrayBufferDataStream.prototype.writeByte;
    
    ArrayBufferDataStream.prototype.writeU16BE = function(u) {
        this.data[this.pos++] = u >> 8;
        this.data[this.pos++] = u;
    };

    ArrayBufferDataStream.prototype.writeDoubleBE = function(d) {
        let
            bytes = new Uint8Array(new Float64Array([d]).buffer);
        
        for (let i = bytes.length - 1; i >= 0; i--) {
            this.writeByte(bytes[i]);
        }
    };

    ArrayBufferDataStream.prototype.writeFloatBE = function(d) {
        let
            bytes = new Uint8Array(new Float32Array([d]).buffer);
        
        for (let i = bytes.length - 1; i >= 0; i--) {
            this.writeByte(bytes[i]);
        }
    };

    /**
     * Write an ASCII string to the stream
     */
    ArrayBufferDataStream.prototype.writeString = function(s) {
        for (let i = 0; i < s.length; i++) {
            this.data[this.pos++] = s.charCodeAt(i);
        }
    };

    /**
     * Write the given 32-bit integer to the stream as an EBML variable-length integer using the given byte width
     * (use measureEBMLVarInt).
     *
     * No error checking is performed to ensure that the supplied width is correct for the integer.
     *
     * @param i Integer to be written
     * @param width Number of bytes to write to the stream
     */
    ArrayBufferDataStream.prototype.writeEBMLVarIntWidth = function(i, width) {
        switch (width) {
            case 1:
                this.writeU8((1 << 7) | i);
            break;
            case 2:
                this.writeU8((1 << 6) | (i >> 8));
                this.writeU8(i);
            break;
            case 3:
                this.writeU8((1 << 5) | (i >> 16));
                this.writeU8(i >> 8);
                this.writeU8(i);
            break;
            case 4:
                this.writeU8((1 << 4) | (i >> 24));
                this.writeU8(i >> 16);
                this.writeU8(i >> 8);
                this.writeU8(i);
            break;
            case 5:
                /*
                 * JavaScript converts its doubles to 32-bit integers for bitwise operations, so we need to do a
                 * division by 2^32 instead of a right-shift of 32 to retain those top 3 bits
                 */
                this.writeU8((1 << 3) | ((i / 4294967296) & 0x7));
                this.writeU8(i >> 24);
                this.writeU8(i >> 16);
                this.writeU8(i >> 8);
                this.writeU8(i);
            break;
            default:
                throw new Error("Bad EBML VINT size " + width);
        }
    };
    
    /**
     * Return the number of bytes needed to encode the given integer as an EBML VINT.
     */
    ArrayBufferDataStream.prototype.measureEBMLVarInt = function(val) {
        if (val < (1 << 7) - 1) {
            /* Top bit is set, leaving 7 bits to hold the integer, but we can't store 127 because
             * "all bits set to one" is a reserved value. Same thing for the other cases below:
             */
            return 1;
        } else if (val < (1 << 14) - 1) {
            return 2;
        } else if (val < (1 << 21) - 1) {
            return 3;
        } else if (val < (1 << 28) - 1) {
            return 4;
        } else if (val < 34359738367) { // 2 ^ 35 - 1 (can address 32GB)
            return 5;
        } else {
            throw new Error("EBML VINT size not supported " + val);
        }
    };
    
    ArrayBufferDataStream.prototype.writeEBMLVarInt = function(i) {
        this.writeEBMLVarIntWidth(i, this.measureEBMLVarInt(i));
    };
    
    /**
     * Write the given unsigned 32-bit integer to the stream in big-endian order using the given byte width.
     * No error checking is performed to ensure that the supplied width is correct for the integer.
     *
     * Omit the width parameter to have it determined automatically for you.
     *
     * @param u Unsigned integer to be written
     * @param width Number of bytes to write to the stream
     */
    ArrayBufferDataStream.prototype.writeUnsignedIntBE = function(u, width) {
        if (width === undefined) {
            width = this.measureUnsignedInt(u);
        }
        
        // Each case falls through:
        switch (width) {
            case 5:
                this.writeU8(Math.floor(u / 4294967296)); // Need to use division to access >32 bits of floating point var
            case 4:
                this.writeU8(u >> 24);
            case 3:
                this.writeU8(u >> 16);
            case 2:
                this.writeU8(u >> 8);
            case 1:
                this.writeU8(u);
            break;
            default:
                throw new Error("Bad UINT size " + width);
        }
    };
    
    /**
     * Return the number of bytes needed to hold the non-zero bits of the given unsigned integer.
     */
    ArrayBufferDataStream.prototype.measureUnsignedInt = function(val) {
        // Force to 32-bit unsigned integer
        if (val < (1 << 8)) {
            return 1;
        } else if (val < (1 << 16)) {
            return 2;
        } else if (val < (1 << 24)) {
            return 3;
        } else if (val < 4294967296) {
            return 4;
        } else {
            return 5;
        }
    };

    /**
     * Return a view on the portion of the buffer from the beginning to the current seek position as a Uint8Array.
     */
    ArrayBufferDataStream.prototype.getAsDataArray = function() {
        if (this.pos < this.data.byteLength) {
            return this.data.subarray(0, this.pos);
        } else if (this.pos == this.data.byteLength) {
            return this.data;
        } else {
            throw new Error("ArrayBufferDataStream's pos lies beyond end of buffer");
        }
    };
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = ArrayBufferDataStream;
	} else {
		window.ArrayBufferDataStream = ArrayBufferDataStream;
	}
}());"use strict";

/**
 * Allows a series of Blob-convertible objects (ArrayBuffer, Blob, String, etc) to be added to a buffer. Seeking and
 * overwriting of blobs is allowed.
 *
 * You can supply a FileWriter, in which case the BlobBuffer is just used as temporary storage before it writes it
 * through to the disk.
 *
 * By Nicholas Sherlock
 *
 * Released under the WTFPLv2 https://en.wikipedia.org/wiki/WTFPL
 */
(function() {
	let BlobBuffer = function(fs) {
		return function(destination) {
			let
				buffer = [],
				writePromise = Promise.resolve(),
				fileWriter = null,
				fd = null;
			
			if (destination && destination.constructor.name === "FileWriter") {
				fileWriter = destination;
			} else if (fs && destination) {
				fd = destination;
			}
			
			// Current seek offset
			this.pos = 0;
			
			// One more than the index of the highest byte ever written
			this.length = 0;
			
			// Returns a promise that converts the blob to an ArrayBuffer
			function readBlobAsBuffer(blob) {
				return new Promise(function (resolve, reject) {
					let
						reader = new FileReader();
					
					reader.addEventListener("loadend", function () {
						resolve(reader.result);
					});
					
					reader.readAsArrayBuffer(blob);
				});
			}
			
			function convertToUint8Array(thing) {
				return new Promise(function (resolve, reject) {
					if (thing instanceof Uint8Array) {
						resolve(thing);
					} else if (thing instanceof ArrayBuffer || ArrayBuffer.isView(thing)) {
						resolve(new Uint8Array(thing));
					} else if (thing instanceof Blob) {
						resolve(readBlobAsBuffer(thing).then(function (buffer) {
							return new Uint8Array(buffer);
						}));
					} else {
						//Assume that Blob will know how to read this thing
						resolve(readBlobAsBuffer(new Blob([thing])).then(function (buffer) {
							return new Uint8Array(buffer);
						}));
					}
				});
			}
			
			function measureData(data) {
				let
					result = data.byteLength || data.length || data.size;
				
				if (!Number.isInteger(result)) {
					throw new Error("Failed to determine size of element");
				}
				
				return result;
			}
			
			/**
			 * Seek to the given absolute offset.
			 *
			 * You may not seek beyond the end of the file (this would create a hole and/or allow blocks to be written in non-
			 * sequential order, which isn't currently supported by the memory buffer backend).
			 */
			this.seek = function (offset) {
				if (offset < 0) {
					throw new Error("Offset may not be negative");
				}
				
				if (isNaN(offset)) {
					throw new Error("Offset may not be NaN");
				}
				
				if (offset > this.length) {
					throw new Error("Seeking beyond the end of file is not allowed");
				}
				
				this.pos = offset;
			};
			
			/**
			 * Write the Blob-convertible data to the buffer at the current seek position.
			 *
			 * Note: If overwriting existing data, the write must not cross preexisting block boundaries (written data must
			 * be fully contained by the extent of a previous write).
			 */
			this.write = function (data) {
				let
					newEntry = {
						offset: this.pos,
						data: data,
						length: measureData(data)
					},
					isAppend = newEntry.offset >= this.length;
				
				this.pos += newEntry.length;
				this.length = Math.max(this.length, this.pos);
				
				// After previous writes complete, perform our write
				writePromise = writePromise.then(function () {
					if (fd) {
						return new Promise(function(resolve, reject) {
							convertToUint8Array(newEntry.data).then(function(dataArray) {
								let
									totalWritten = 0,
									buffer = Buffer.from(dataArray.buffer),
									
									handleWriteComplete = function(err, written, buffer) {
										totalWritten += written;
										
										if (totalWritten >= buffer.length) {
											resolve();
										} else {
											// We still have more to write...
											fs.write(fd, buffer, totalWritten, buffer.length - totalWritten, newEntry.offset + totalWritten, handleWriteComplete);
										}
									};
								
								fs.write(fd, buffer, 0, buffer.length, newEntry.offset, handleWriteComplete);
							});
						});
					} else if (fileWriter) {
						return new Promise(function (resolve, reject) {
							fileWriter.onwriteend = resolve;
							
							fileWriter.seek(newEntry.offset);
							fileWriter.write(new Blob([newEntry.data]));
						});
					} else if (!isAppend) {
						// We might be modifying a write that was already buffered in memory.
						
						// Slow linear search to find a block we might be overwriting
						for (let i = 0; i < buffer.length; i++) {
							let
								entry = buffer[i];
							
							// If our new entry overlaps the old one in any way...
							if (!(newEntry.offset + newEntry.length <= entry.offset || newEntry.offset >= entry.offset + entry.length)) {
								if (newEntry.offset < entry.offset || newEntry.offset + newEntry.length > entry.offset + entry.length) {
									throw new Error("Overwrite crosses blob boundaries");
								}
								
								if (newEntry.offset == entry.offset && newEntry.length == entry.length) {
									// We overwrote the entire block
									entry.data = newEntry.data;
									
									// We're done
									return;
								} else {
									return convertToUint8Array(entry.data)
										.then(function (entryArray) {
											entry.data = entryArray;
											
											return convertToUint8Array(newEntry.data);
										}).then(function (newEntryArray) {
											newEntry.data = newEntryArray;
											
											entry.data.set(newEntry.data, newEntry.offset - entry.offset);
										});
								}
							}
						}
						// Else fall through to do a simple append, as we didn't overwrite any pre-existing blocks
					}
					
					buffer.push(newEntry);
				});
			};
			
			/**
			 * Finish all writes to the buffer, returning a promise that signals when that is complete.
			 *
			 * If a FileWriter was not provided, the promise is resolved with a Blob that represents the completed BlobBuffer
			 * contents. You can optionally pass in a mimeType to be used for this blob.
			 *
			 * If a FileWriter was provided, the promise is resolved with null as the first argument.
			 */
			this.complete = function (mimeType) {
				if (fd || fileWriter) {
					writePromise = writePromise.then(function () {
						return null;
					});
				} else {
					// After writes complete we need to merge the buffer to give to the caller
					writePromise = writePromise.then(function () {
						let
							result = [];
						
						for (let i = 0; i < buffer.length; i++) {
							result.push(buffer[i].data);
						}
						
						return new Blob(result, {type: mimeType});
					});
				}
				
				return writePromise;
			};
		};
	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = BlobBuffer(require('fs'));
	} else {
		window.BlobBuffer = BlobBuffer(null);
	}
})();
/**
 * WebM video encoder for Google Chrome. This implementation is suitable for creating very large video files, because
 * it can stream Blobs directly to a FileWriter without buffering the entire video in memory.
 *
 * When FileWriter is not available or not desired, it can buffer the video in memory as a series of Blobs which are
 * eventually returned as one composite Blob.
 *
 * By Nicholas Sherlock.
 *
 * Based on the ideas from Whammy: https://github.com/antimatter15/whammy
 *
 * Released under the WTFPLv2 https://en.wikipedia.org/wiki/WTFPL
 */

"use strict";

(function() {
    function extend(base, top) {
        let
            target = {};
        
        [base, top].forEach(function(obj) {
            for (let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    target[prop] = obj[prop];
                }
            }
        });
        
        return target;
    }
    
    /**
     * Decode a Base64 data URL into a binary string.
     *
     * @return {String} The binary string
     */
    function decodeBase64WebPDataURL(url) {
        if (typeof url !== "string" || !url.match(/^data:image\/webp;base64,/i)) {
            throw new Error("Failed to decode WebP Base64 URL");
        }
        
        return window.atob(url.substring("data:image\/webp;base64,".length));
    }
    
    /**
     * Convert the given canvas to a WebP encoded image and return the image data as a string.
     *
     * @return {String}
     */
    function renderAsWebP(canvas, quality) {
        let
            frame = typeof canvas === 'string' && /^data:image\/webp/.test(canvas)
                ? canvas
                : canvas.toDataURL('image/webp', quality);
        
        return decodeBase64WebPDataURL(frame);
    }
    
    /**
     * @param {String} string
     * @returns {number}
     */
    function byteStringToUint32LE(string) {
        let
            a = string.charCodeAt(0),
            b = string.charCodeAt(1),
            c = string.charCodeAt(2),
            d = string.charCodeAt(3);
    
        return (a | (b << 8) | (c << 16) | (d << 24)) >>> 0;
    }
    
    /**
     * Extract a VP8 keyframe from a WebP image file.
     *
     * @param {String} webP - Raw binary string
     *
     * @returns {{hasAlpha: boolean, frame: string}}
     */
    function extractKeyframeFromWebP(webP) {
        let
            cursor = webP.indexOf('VP8', 12); // Start the search after the 12-byte file header
    
        if (cursor === -1) {
            throw new Error("Bad image format, does this browser support WebP?");
        }
        
        let
            hasAlpha = false;
    
        /* Cursor now is either directly pointing at a "VP8 " keyframe, or a "VP8X" extended format file header
         * Seek through chunks until we find the "VP8 " chunk we're interested in
         */
        while (cursor < webP.length - 8) {
            let
                chunkLength, fourCC;
    
            fourCC = webP.substring(cursor, cursor + 4);
            cursor += 4;

            chunkLength = byteStringToUint32LE(webP.substring(cursor, cursor + 4));
            cursor += 4;
            
            switch (fourCC) {
                case "VP8 ":
                    return {
                        frame: webP.substring(cursor, cursor + chunkLength),
                        hasAlpha: hasAlpha
                    };
                    
                case "ALPH":
                    hasAlpha = true;
                    /* But we otherwise ignore the content of the alpha chunk, since we don't have a decoder for it
                     * and it isn't VP8-compatible
                     */
                    break;
            }
            
            cursor += chunkLength;
            
            if ((chunkLength & 0x01) !== 0) {
                cursor++;
                // Odd-length chunks have 1 byte of trailing padding that isn't included in their length
            }
        }
        
        throw new Error("Failed to find VP8 keyframe in WebP image, is this image mistakenly encoded in the Lossless WebP format?");
    }
    
    // Just a little utility so we can tag values as floats for the EBML encoder's benefit
    function EBMLFloat32(value) {
        this.value = value;
    }
    
    function EBMLFloat64(value) {
        this.value = value;
    }
    
    /**
     * Write the given EBML object to the provided ArrayBufferStream.
     *
     * @param buffer
     * @param {Number} bufferFileOffset - The buffer's first byte is at this position inside the video file.
     *                                    This is used to complete offset and dataOffset fields in each EBML structure,
     *                                    indicating the file offset of the first byte of the EBML element and
     *                                    its data payload.
     * @param {*} ebml
     */
    function writeEBML(buffer, bufferFileOffset, ebml) {
        // Is the ebml an array of sibling elements?
        if (Array.isArray(ebml)) {
            for (let i = 0; i < ebml.length; i++) {
                writeEBML(buffer, bufferFileOffset, ebml[i]);
            }
            // Is this some sort of raw data that we want to write directly?
        } else if (typeof ebml === "string") {
            buffer.writeString(ebml);
        } else if (ebml instanceof Uint8Array) {
            buffer.writeBytes(ebml);
        } else if (ebml.id){
            // We're writing an EBML element
            ebml.offset = buffer.pos + bufferFileOffset;
            
            buffer.writeUnsignedIntBE(ebml.id); // ID field
            
            // Now we need to write the size field, so we must know the payload size:
            
            if (Array.isArray(ebml.data)) {
                // Writing an array of child elements. We won't try to measure the size of the children up-front
                
                let
                    sizePos, dataBegin, dataEnd;
                
                if (ebml.size === -1) {
                    // Write the reserved all-one-bits marker to note that the size of this element is unknown/unbounded
                    buffer.writeByte(0xFF);
                } else {
                    sizePos = buffer.pos;
                    
                    /* Write a dummy size field to overwrite later. 4 bytes allows an element maximum size of 256MB,
					 * which should be plenty (we don't want to have to buffer that much data in memory at one time
					 * anyway!)
					 */
                    buffer.writeBytes([0, 0, 0, 0]);
                }
                
                dataBegin = buffer.pos;
                
                ebml.dataOffset = dataBegin + bufferFileOffset;
                writeEBML(buffer, bufferFileOffset, ebml.data);
                
                if (ebml.size !== -1) {
                    dataEnd = buffer.pos;
                    
                    ebml.size = dataEnd - dataBegin;
                    
                    buffer.seek(sizePos);
                    buffer.writeEBMLVarIntWidth(ebml.size, 4); // Size field
                    
                    buffer.seek(dataEnd);
                }
            } else if (typeof ebml.data === "string") {
                buffer.writeEBMLVarInt(ebml.data.length); // Size field
                ebml.dataOffset = buffer.pos + bufferFileOffset;
                buffer.writeString(ebml.data);
            } else if (typeof ebml.data === "number") {
                // Allow the caller to explicitly choose the size if they wish by supplying a size field
                if (!ebml.size) {
                    ebml.size = buffer.measureUnsignedInt(ebml.data);
                }
                
                buffer.writeEBMLVarInt(ebml.size); // Size field
                ebml.dataOffset = buffer.pos + bufferFileOffset;
                buffer.writeUnsignedIntBE(ebml.data, ebml.size);
            } else if (ebml.data instanceof EBMLFloat64) {
                buffer.writeEBMLVarInt(8); // Size field
                ebml.dataOffset = buffer.pos + bufferFileOffset;
                buffer.writeDoubleBE(ebml.data.value);
            } else if (ebml.data instanceof EBMLFloat32) {
                buffer.writeEBMLVarInt(4); // Size field
                ebml.dataOffset = buffer.pos + bufferFileOffset;
                buffer.writeFloatBE(ebml.data.value);
            } else if (ebml.data instanceof Uint8Array) {
                buffer.writeEBMLVarInt(ebml.data.byteLength); // Size field
                ebml.dataOffset = buffer.pos + bufferFileOffset;
                buffer.writeBytes(ebml.data);
            } else {
                throw new Error("Bad EBML datatype " + typeof ebml.data);
            }
        } else {
            throw new Error("Bad EBML datatype " + typeof ebml.data);
        }
    }
    
    /**
     * @typedef {Object} Frame
     * @property {string} frame - Raw VP8 keyframe data
     * @property {string} alpha - Raw VP8 keyframe with alpha represented as luminance
     * @property {Number} duration
     * @property {Number} trackNumber - From 1 to 126 (inclusive)
     * @property {Number} timecode
     */
    
    /**
     * @typedef {Object} Cluster
     * @property {Number} timecode - Start time for the cluster
     */
    
    /**
     * @param ArrayBufferDataStream - Imported library
     * @param BlobBuffer - Imported library
     *
     * @returns WebMWriter
     *
     * @constructor
     */
    let WebMWriter = function(ArrayBufferDataStream, BlobBuffer) {
        return function(options) {
            let
                MAX_CLUSTER_DURATION_MSEC = 5000,
                DEFAULT_TRACK_NUMBER = 1,
            
                writtenHeader = false,
                videoWidth = 0, videoHeight = 0,
    
                /**
                 * @type {[HTMLCanvasElement]}
                 */
                alphaBuffer = null,

                /**
                 * @type {[CanvasRenderingContext2D]}
                 */
                alphaBufferContext = null,

                /**
                 * @type {[ImageData]}
                 */
                alphaBufferData = null,
    
                /**
                 *
                 * @type {Frame[]}
                 */
                clusterFrameBuffer = [],
                clusterStartTime = 0,
                clusterDuration = 0,
                
                optionDefaults = {
                    quality: 0.95,       // WebM image quality from 0.0 (worst) to 0.99999 (best), 1.00 (WebP lossless) is not supported
                    
                    transparent: false,      // True if an alpha channel should be included in the video
                    alphaQuality: undefined, // Allows you to set the quality level of the alpha channel separately.
                                             // If not specified this defaults to the same value as `quality`.
                    
                    fileWriter: null,    // Chrome FileWriter in order to stream to a file instead of buffering to memory (optional)
                    fd: null,            // Node.JS file descriptor to write to instead of buffering (optional)
                    
                    // You must supply one of:
                    frameDuration: null, // Duration of frames in milliseconds
                    frameRate: null,     // Number of frames per second
                },
                
                seekPoints = {
                    Cues: {id: new Uint8Array([0x1C, 0x53, 0xBB, 0x6B]), positionEBML: null},
                    SegmentInfo: {id: new Uint8Array([0x15, 0x49, 0xA9, 0x66]), positionEBML: null},
                    Tracks: {id: new Uint8Array([0x16, 0x54, 0xAE, 0x6B]), positionEBML: null},
                },
                
                ebmlSegment, // Root element of the EBML document
                
                segmentDuration = {
                    "id": 0x4489, // Duration
                    "data": new EBMLFloat64(0)
                },
                
                seekHead,
                
                cues = [],
                
                blobBuffer = new BlobBuffer(options.fileWriter || options.fd);
    
            function fileOffsetToSegmentRelative(fileOffset) {
                return fileOffset - ebmlSegment.dataOffset;
            }
    
            /**
             * Extracts the transparency channel from the supplied canvas and uses it to create a VP8 alpha channel bitstream.
             *
             * @param {HTMLCanvasElement} source
             *
             * @return {HTMLCanvasElement}
             */
            function convertAlphaToGrayscaleImage(source) {
                if (alphaBuffer === null || alphaBuffer.width !== source.width || alphaBuffer.height !== source.height) {
                    alphaBuffer = document.createElement("canvas");
                    alphaBuffer.width = source.width;
                    alphaBuffer.height = source.height;
                    
                    alphaBufferContext = alphaBuffer.getContext("2d");
                    alphaBufferData = alphaBufferContext.createImageData(alphaBuffer.width, alphaBuffer.height);
                }
                
                let
                    sourceContext = source.getContext("2d"),
                    sourceData = sourceContext.getImageData(0, 0, source.width, source.height).data,
                    destData = alphaBufferData.data,
                    dstCursor = 0,
                    srcEnd = source.width * source.height * 4;
                
                for (let srcCursor = 3 /* Since pixel byte order is RGBA */; srcCursor < srcEnd; srcCursor += 4) {
                    let
                        alpha = sourceData[srcCursor];
                    
                    // Turn the original alpha channel into a brightness value (ends up being the Y in YUV)
                    destData[dstCursor++] = alpha;
                    destData[dstCursor++] = alpha;
                    destData[dstCursor++] = alpha;
                    destData[dstCursor++] = 255;
                }
                
                alphaBufferContext.putImageData(alphaBufferData, 0, 0);
                
                return alphaBuffer;
            }
            
            /**
             * Create a SeekHead element with descriptors for the points in the global seekPoints array.
             *
             * 5 bytes of position values are reserved for each node, which lie at the offset point.positionEBML.dataOffset,
             * to be overwritten later.
             */
            function createSeekHead() {
                let
                    seekPositionEBMLTemplate = {
                        "id": 0x53AC, // SeekPosition
                        "size": 5, // Allows for 32GB video files
                        "data": 0 // We'll overwrite this when the file is complete
                    },
                    
                    result = {
                        "id": 0x114D9B74, // SeekHead
                        "data": []
                    };
                
                for (let name in seekPoints) {
                    let
                        seekPoint = seekPoints[name];
                
                    seekPoint.positionEBML = Object.create(seekPositionEBMLTemplate);
                    
                    result.data.push({
                         "id": 0x4DBB, // Seek
                         "data": [
                              {
                                  "id": 0x53AB, // SeekID
                                  "data": seekPoint.id
                              },
                              seekPoint.positionEBML
                         ]
                    });
                }
                
                return result;
            }
            
            /**
             * Write the WebM file header to the stream.
             */
            function writeHeader() {
                seekHead = createSeekHead();
                
                let
                    ebmlHeader = {
                        "id": 0x1a45dfa3, // EBML
                        "data": [
                            {
                                "id": 0x4286, // EBMLVersion
                                "data": 1
                            },
                            {
                                "id": 0x42f7, // EBMLReadVersion
                                "data": 1
                            },
                            {
                                "id": 0x42f2, // EBMLMaxIDLength
                                "data": 4
                            },
                            {
                                "id": 0x42f3, // EBMLMaxSizeLength
                                "data": 8
                            },
                            {
                                "id": 0x4282, // DocType
                                "data": "webm"
                            },
                            {
                                "id": 0x4287, // DocTypeVersion
                                "data": 2
                            },
                            {
                                "id": 0x4285, // DocTypeReadVersion
                                "data": 2
                            }
                        ]
                    },
                    
                    segmentInfo = {
                        "id": 0x1549a966, // Info
                        "data": [
                            {
                                "id": 0x2ad7b1, // TimecodeScale
                                "data": 1e6 // Times will be in miliseconds (1e6 nanoseconds per step = 1ms)
                            },
                            {
                                "id": 0x4d80, // MuxingApp
                                "data": "webm-writer-js",
                            },
                            {
                                "id": 0x5741, // WritingApp
                                "data": "webm-writer-js"
                            },
                            segmentDuration // To be filled in later
                        ]
                    },
                    
                    videoProperties = [
                        {
                            "id": 0xb0, // PixelWidth
                            "data": videoWidth
                        },
                        {
                            "id": 0xba, // PixelHeight
                            "data": videoHeight
                        }
                    ];
                
                if (options.transparent) {
                    videoProperties.push(
                        {
                            "id": 0x53C0, // AlphaMode
                            "data": 1
                        }
                    );
                }
                
                let
                    tracks = {
                        "id": 0x1654ae6b, // Tracks
                        "data": [
                            {
                                "id": 0xae, // TrackEntry
                                "data": [
                                    {
                                        "id": 0xd7, // TrackNumber
                                        "data": DEFAULT_TRACK_NUMBER
                                    },
                                    {
                                        "id": 0x73c5, // TrackUID
                                        "data": DEFAULT_TRACK_NUMBER
                                    },
                                    {
                                        "id": 0x9c, // FlagLacing
                                        "data": 0
                                    },
                                    {
                                        "id": 0x22b59c, // Language
                                        "data": "und"
                                    },
                                    {
                                        "id": 0x86, // CodecID
                                        "data": "V_VP8"
                                    },
                                    {
                                        "id": 0x258688, // CodecName
                                        "data": "VP8"
                                    },
                                    {
                                        "id": 0x83, // TrackType
                                        "data": 1
                                    },
                                    {
                                        "id": 0xe0,  // Video
                                        "data": videoProperties
                                    }
                                ]
                            }
                        ]
                    };
                
                ebmlSegment = {
                    "id": 0x18538067, // Segment
                    "size": -1, // Unbounded size
                    "data": [
                        seekHead,
                        segmentInfo,
                        tracks,
                    ]
                };
                
                let
                    bufferStream = new ArrayBufferDataStream(256);
                    
                writeEBML(bufferStream, blobBuffer.pos, [ebmlHeader, ebmlSegment]);
                blobBuffer.write(bufferStream.getAsDataArray());
                
                // Now we know where these top-level elements lie in the file:
                seekPoints.SegmentInfo.positionEBML.data = fileOffsetToSegmentRelative(segmentInfo.offset);
                seekPoints.Tracks.positionEBML.data = fileOffsetToSegmentRelative(tracks.offset);
                
	            writtenHeader = true;
            }
    
            /**
             * Create a BlockGroup element to hold the given keyframe (used when alpha support is required)
             *
             * @param {Frame} keyframe
             *
             * @return A BlockGroup EBML element
             */
            function createBlockGroupForTransparentKeyframe(keyframe) {
                let
                    block, blockAdditions,
                    
                    bufferStream = new ArrayBufferDataStream(1 + 2 + 1);
    
                // Create a Block to hold the image data:
                
                if (!(keyframe.trackNumber > 0 && keyframe.trackNumber < 127)) {
                    throw new Error("TrackNumber must be > 0 and < 127");
                }
        
                bufferStream.writeEBMLVarInt(keyframe.trackNumber); // Always 1 byte since we limit the range of trackNumber
                bufferStream.writeU16BE(keyframe.timecode);
                bufferStream.writeByte(0); // Flags byte
    
                block = {
                    "id": 0xA1, // Block
                    "data": [
                        bufferStream.getAsDataArray(),
                        keyframe.frame
                    ]
                };
    
                blockAdditions = {
                    "id": 0x75A1, // BlockAdditions
                    "data": [
                        {
                            "id": 0xA6, // BlockMore
                            "data": [
                                {
                                    "id": 0xEE, // BlockAddID
                                    "data": 1   // Means "BlockAdditional has a codec-defined meaning, pass it to the codec"
                                },
                                {
                                    "id": 0xA5, // BlockAdditional
                                    "data": keyframe.alpha // The actual alpha channel image
                                }
                            ]
                        }
                    ]
                };
    
                return {
                    "id": 0xA0, // BlockGroup
                    "data": [
                        block,
                        blockAdditions
                    ]
                };
            }
            
            /**
             * Create a SimpleBlock element to hold the given keyframe.
             *
             * @param {Frame} keyframe
             *
             * @return A SimpleBlock EBML element.
             */
            function createSimpleBlockForKeyframe(keyframe) {
                let
                    bufferStream = new ArrayBufferDataStream(1 + 2 + 1);
                
                if (!(keyframe.trackNumber > 0 && keyframe.trackNumber < 127)) {
                    throw new Error("TrackNumber must be > 0 and < 127");
                }
    
                bufferStream.writeEBMLVarInt(keyframe.trackNumber); // Always 1 byte since we limit the range of trackNumber
                bufferStream.writeU16BE(keyframe.timecode);
                
                // Flags byte
                bufferStream.writeByte(
                    1 << 7 // Keyframe
                );
                
                return {
                    "id": 0xA3, // SimpleBlock
                    "data": [
                         bufferStream.getAsDataArray(),
                         keyframe.frame
                    ]
                };
            }
    
            /**
             * Create either a SimpleBlock or BlockGroup (if alpha is required) for the given keyframe.
             *
             * @param {Frame} keyframe
             */
            function createContainerForKeyframe(keyframe) {
                if (keyframe.alpha) {
                    return createBlockGroupForTransparentKeyframe(keyframe);
                }
                
                return createSimpleBlockForKeyframe(keyframe);
            }
        
            /**
             * Create a Cluster EBML node.
             *
             * @param {Cluster} cluster
             *
             * Returns an EBML element.
             */
            function createCluster(cluster) {
                return {
                    "id": 0x1f43b675,
                    "data": [
                         {
                            "id": 0xe7, // Timecode
                            "data": Math.round(cluster.timecode)
                         }
                    ]
                };
            }
            
            function addCuePoint(trackIndex, clusterTime, clusterFileOffset) {
                cues.push({
                    "id": 0xBB, // Cue
                    "data": [
                         {
                             "id": 0xB3, // CueTime
                             "data": clusterTime
                         },
                         {
                             "id": 0xB7, // CueTrackPositions
                             "data": [
                                  {
                                      "id": 0xF7, // CueTrack
                                      "data": trackIndex
                                  },
                                  {
                                      "id": 0xF1, // CueClusterPosition
                                      "data": fileOffsetToSegmentRelative(clusterFileOffset)
                                  }
                             ]
                         }
                    ]
                });
            }
            
            /**
             * Write a Cues element to the blobStream using the global `cues` array of CuePoints (use addCuePoint()).
             * The seek entry for the Cues in the SeekHead is updated.
             */
            function writeCues() {
                let
                    ebml = {
                        "id": 0x1C53BB6B,
                        "data": cues
                    },
                    
                    cuesBuffer = new ArrayBufferDataStream(16 + cues.length * 32); // Pretty crude estimate of the buffer size we'll need
                
                writeEBML(cuesBuffer, blobBuffer.pos, ebml);
                blobBuffer.write(cuesBuffer.getAsDataArray());
                
                // Now we know where the Cues element has ended up, we can update the SeekHead
                seekPoints.Cues.positionEBML.data = fileOffsetToSegmentRelative(ebml.offset);
            }
            
            /**
             * Flush the frames in the current clusterFrameBuffer out to the stream as a Cluster.
             */
            function flushClusterFrameBuffer() {
                if (clusterFrameBuffer.length === 0) {
                    return;
                }
    
                // First work out how large of a buffer we need to hold the cluster data
                let
                    rawImageSize = 0;
                
                for (let i = 0; i < clusterFrameBuffer.length; i++) {
                    rawImageSize += clusterFrameBuffer[i].frame.length + (clusterFrameBuffer[i].alpha ? clusterFrameBuffer[i].alpha.length : 0);
                }
                
                let
                    buffer = new ArrayBufferDataStream(rawImageSize + clusterFrameBuffer.length * 64), // Estimate 64 bytes per block header
    
                    cluster = createCluster({
                        timecode: Math.round(clusterStartTime),
                    });
                
                for (let i = 0; i < clusterFrameBuffer.length; i++) {
                    cluster.data.push(createContainerForKeyframe(clusterFrameBuffer[i]));
                }
                
                writeEBML(buffer, blobBuffer.pos, cluster);
                blobBuffer.write(buffer.getAsDataArray());
                
                addCuePoint(DEFAULT_TRACK_NUMBER, Math.round(clusterStartTime), cluster.offset);
                
                clusterFrameBuffer = [];
                clusterStartTime += clusterDuration;
                clusterDuration = 0;
            }
            
            function validateOptions() {
                // Derive frameDuration setting if not already supplied
                if (!options.frameDuration) {
                    if (options.frameRate) {
                        options.frameDuration = 1000 / options.frameRate;
                    } else {
                        throw new Error("Missing required frameDuration or frameRate setting");
                    }
                }
                
                // Avoid 1.0 (lossless) because it creates VP8L lossless frames that WebM doesn't support
                options.quality = Math.max(Math.min(options.quality, 0.99999), 0);
                
                if (options.alphaQuality === undefined) {
                    options.alphaQuality = options.quality;
                } else {
                    options.alphaQuality = Math.max(Math.min(options.alphaQuality, 0.99999), 0);
                }
            }
    
            /**
             *
             * @param {Frame} frame
             */
            function addFrameToCluster(frame) {
                frame.trackNumber = DEFAULT_TRACK_NUMBER;
                
                // Frame timecodes are relative to the start of their cluster:
                frame.timecode = Math.round(clusterDuration);
    
                clusterFrameBuffer.push(frame);
                
                clusterDuration += frame.duration;
                
                if (clusterDuration >= MAX_CLUSTER_DURATION_MSEC) {
                    flushClusterFrameBuffer();
                }
            }
            
            /**
             * Rewrites the SeekHead element that was initially written to the stream with the offsets of top level elements.
             *
             * Call once writing is complete (so the offset of all top level elements is known).
             */
            function rewriteSeekHead() {
                let
                    seekHeadBuffer = new ArrayBufferDataStream(seekHead.size),
                    oldPos = blobBuffer.pos;
                
                // Write the rewritten SeekHead element's data payload to the stream (don't need to update the id or size)
                writeEBML(seekHeadBuffer, seekHead.dataOffset, seekHead.data);
                
                // And write that through to the file
                blobBuffer.seek(seekHead.dataOffset);
                blobBuffer.write(seekHeadBuffer.getAsDataArray());
    
                blobBuffer.seek(oldPos);
            }
            
            /**
             * Rewrite the Duration field of the Segment with the newly-discovered video duration.
             */
            function rewriteDuration() {
                let
                    buffer = new ArrayBufferDataStream(8),
                    oldPos = blobBuffer.pos;
                
                // Rewrite the data payload (don't need to update the id or size)
                buffer.writeDoubleBE(clusterStartTime);
                
                // And write that through to the file
                blobBuffer.seek(segmentDuration.dataOffset);
                blobBuffer.write(buffer.getAsDataArray());
        
                blobBuffer.seek(oldPos);
            }
            
            /**
             * Add a frame to the video.
             *
             * @param {HTMLCanvasElement|String} frame - A Canvas element that contains the frame, or a WebP string
             *                                           you obtained by calling toDataUrl() on an image yourself.
             *
             * @param {HTMLCanvasElement|String} [alpha] - For transparent video, instead of including the alpha channel
             *                                             in your provided `frame`, you can instead provide it separately
             *                                             here. The alpha channel of this alpha canvas will be ignored,
             *                                             encode your alpha information into this canvas' grayscale
             *                                             brightness instead.
             *
             *                                             This is useful because it allows you to paint the colours
             *                                             you need into your `frame` even in regions which are fully
             *                                             transparent (which Canvas doesn't normally let you influence).
             *                                             This allows you to control the colour of the fringing seen
             *                                             around objects on transparent backgrounds.
             *
             * @param {Number} [overrideFrameDuration] - Set a duration for this frame (in milliseconds) that differs
             *                                           from the default
             */
            this.addFrame = function(frame, alpha, overrideFrameDuration) {
                if (!writtenHeader) {
                    videoWidth = frame.width || 0;
                    videoHeight = frame.height || 0;
    
                    writeHeader();
                }
    
                let
                    keyframe = extractKeyframeFromWebP(renderAsWebP(frame, options.quality)),
                    frameDuration, frameAlpha = null;
                
                if (overrideFrameDuration) {
                    frameDuration = overrideFrameDuration;
                } else if (typeof alpha == "number") {
                    frameDuration = alpha;
                } else {
                    frameDuration = options.frameDuration;
                }
                
                if (options.transparent) {
                    if (alpha instanceof HTMLCanvasElement || typeof alpha === "string") {
                        frameAlpha = alpha;
                    } else if (keyframe.hasAlpha) {
                        frameAlpha = convertAlphaToGrayscaleImage(frame);
                    }
                }
                
                addFrameToCluster({
                    frame: keyframe.frame,
                    duration: frameDuration,
                    alpha: frameAlpha ? extractKeyframeFromWebP(renderAsWebP(frameAlpha, options.alphaQuality)).frame : null
                });
            };
            
            /**
             * Finish writing the video and return a Promise to signal completion.
             *
             * If the destination device was memory (i.e. options.fileWriter was not supplied), the Promise is resolved with
             * a Blob with the contents of the entire video.
             */
            this.complete = function() {
            	if (!writtenHeader) {
		            writeHeader();
	            }
	            
                flushClusterFrameBuffer();
                
                writeCues();
                rewriteSeekHead();
                rewriteDuration();
                
                return blobBuffer.complete('video/webm');
            };
            
            this.getWrittenSize = function() {
                return blobBuffer.length;
            };
    
            options = extend(optionDefaults, options || {});
            validateOptions();
        };
    };
    
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	    module.exports = WebMWriter(require("./ArrayBufferDataStream"), require("./BlobBuffer"));
    } else {
	    window.WebMWriter = WebMWriter(window.ArrayBufferDataStream, window.BlobBuffer);
    }
})();



;(function () {
  'use strict'

  var isNodeEnviroment = typeof module !== 'undefined' && typeof module.exports !== 'undefined'

  var Tar = isNodeEnviroment ? require('./tar') : window.Tar
  var download = isNodeEnviroment ? require('./download') : window.download
  var GIF = isNodeEnviroment ? require('./gif').GIF : window.GIF
  var WebMWriter = isNodeEnviroment ? require('./webm-writer-0.2.0') : window.WebMWriter

  var objectTypes = {
    function: true,
    object: true,
  }

  function checkGlobal(value) {
    return value && value.Object === Object ? value : null
  }

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
    freeParseInt = parseInt

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType ? exports : undefined

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType ? module : undefined

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports ? freeExports : undefined

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global)

  /** Detect free variable `self`. */
  var freeSelf = checkGlobal(objectTypes[typeof self] && self)

  /** Detect free variable `window`. */
  var freeWindow = checkGlobal(objectTypes[typeof window] && window)

  /** Detect `this` as the global object. */
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this)
  if (typeof window == "undefined") { return }
  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root =
    freeGlobal ||
    (freeWindow !== (thisGlobal && thisGlobal.window) && freeWindow) ||
    freeSelf ||
    thisGlobal ||
    Function('return this')()
  if (typeof window !== "undefined") {
    if (!('gc' in window)) {
      window.gc = function () {}
    }
  }


  if (typeof HTMLCanvasElement !== "undefined" && !HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: function (callback, type, quality) {
        var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
          len = binStr.length,
          arr = new Uint8Array(len)

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i)
        }

        callback(new Blob([arr], { type: type || 'image/png' }))
      },
    })
  }

  // @license http://opensource.org/licenses/MIT
  // copyright Paul Irish 2015

  // Date.now() is supported everywhere except IE8. For IE8 we use the Date.now polyfill
  //   github.com/Financial-Times/polyfill-service/blob/master/polyfills/Date.now/polyfill.js
  // as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values

  // if you want values similar to what you'd get with real perf.now, place this towards the head of the page
  // but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed

  ;(function () {
    if (typeof window !== "undefined") {
      if ('performance' in window == false) {
        window.performance = {}
      }
    }

    Date.now =
      Date.now ||
      function () {
        // thanks IE8
        return new Date().getTime()
      }

    if (typeof window !== "undefined" && 'now' in window.performance == false) {
      var nowOffset = Date.now()

      if (performance.timing && performance.timing.navigationStart) {
        nowOffset = performance.timing.navigationStart
      }

      window.performance.now = function now() {
        return Date.now() - nowOffset
      }
    }
  })()

  function pad(n) {
    return String('0000000' + n).slice(-7)
  }
  // https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Timers

  var g_startTime = window.Date.now()

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }

  function CCFrameEncoder(settings) {
    var _handlers = {}

    this.settings = settings

    this.on = function (event, handler) {
      _handlers[event] = handler
    }

    this.emit = function (event) {
      var handler = _handlers[event]
      if (handler) {
        handler.apply(null, Array.prototype.slice.call(arguments, 1))
      }
    }

    this.filename = settings.name || guid()
    this.extension = ''
    this.mimeType = ''
  }

  CCFrameEncoder.prototype.start = function () {}
  CCFrameEncoder.prototype.stop = function () {}
  CCFrameEncoder.prototype.add = function () {}
  CCFrameEncoder.prototype.save = function () {}
  CCFrameEncoder.prototype.dispose = function () {}
  CCFrameEncoder.prototype.safeToProceed = function () {
    return true
  }
  CCFrameEncoder.prototype.step = function () {
    console.log('Step not set!')
  }

  function CCTarEncoder(settings) {
    CCFrameEncoder.call(this, settings)

    this.extension = '.tar'
    this.mimeType = 'application/x-tar'
    this.fileExtension = ''
    this.baseFilename = this.filename

    this.tape = null
    this.count = 0
    this.part = 1
    this.frames = 0
  }

  CCTarEncoder.prototype = Object.create(CCFrameEncoder.prototype)

  CCTarEncoder.prototype.start = function () {
    this.dispose()
  }

  CCTarEncoder.prototype.add = function (blob) {
    var fileReader = new FileReader()
    fileReader.onload = function () {
      this.tape.append(pad(this.count) + this.fileExtension, new Uint8Array(fileReader.result))

      if (this.settings.autoSaveTime > 0 && this.frames / this.settings.framerate >= this.settings.autoSaveTime) {
        this.save(
          function (blob) {
            this.filename = this.baseFilename + '-part-' + pad(this.part)
            download(blob, this.filename + this.extension, this.mimeType)
            var count = this.count
            this.dispose()
            this.count = count + 1
            this.part++
            this.filename = this.baseFilename + '-part-' + pad(this.part)
            this.frames = 0
            this.step()
          }.bind(this)
        )
      } else {
        this.count++
        this.frames++
        this.step()
      }
    }.bind(this)
    fileReader.readAsArrayBuffer(blob)
  }

  CCTarEncoder.prototype.save = function (callback) {
    callback(this.tape.save())
  }

  CCTarEncoder.prototype.dispose = function () {
    this.tape = new Tar()
    this.count = 0
  }

  function CCPNGEncoder(settings) {
    CCTarEncoder.call(this, settings)

    this.type = 'image/png'
    this.fileExtension = '.png'
  }

  CCPNGEncoder.prototype = Object.create(CCTarEncoder.prototype)

  CCPNGEncoder.prototype.add = function (canvas) {
    canvas.toBlob(
      function (blob) {
        CCTarEncoder.prototype.add.call(this, blob)
      }.bind(this),
      this.type
    )
  }

  function CCJPEGEncoder(settings) {
    CCTarEncoder.call(this, settings)

    this.type = 'image/jpeg'
    this.fileExtension = '.jpg'
    this.quality = settings.quality / 100 || 0.8
  }

  CCJPEGEncoder.prototype = Object.create(CCTarEncoder.prototype)

  CCJPEGEncoder.prototype.add = function (canvas) {
    canvas.toBlob(
      function (blob) {
        CCTarEncoder.prototype.add.call(this, blob)
      }.bind(this),
      this.type,
      this.quality
    )
  }

  /*

	WebM Encoder

*/

  function CCWebMEncoder(settings) {
    var canvas = document.createElement('canvas')
    if (canvas.toDataURL('image/webp').substr(5, 10) !== 'image/webp') {
      console.log('WebP not supported - try another export format')
    }

    CCFrameEncoder.call(this, settings)

    this.quality = settings.quality / 100 || 0.8

    this.extension = '.webm'
    this.mimeType = 'video/webm'
    this.baseFilename = this.filename
    this.framerate = settings.framerate

    this.frames = 0
    this.part = 1

    this.videoWriter = new WebMWriter({
      quality: this.quality,
      fileWriter: null,
      fd: null,
      frameRate: this.framerate,
    })
  }

  CCWebMEncoder.prototype = Object.create(CCFrameEncoder.prototype)

  CCWebMEncoder.prototype.start = function (canvas) {
    this.dispose()
  }

  CCWebMEncoder.prototype.add = function (canvas) {
    this.videoWriter.addFrame(canvas)

    if (this.settings.autoSaveTime > 0 && this.frames / this.settings.framerate >= this.settings.autoSaveTime) {
      this.save(
        function (blob) {
          this.filename = this.baseFilename + '-part-' + pad(this.part)
          download(blob, this.filename + this.extension, this.mimeType)
          this.dispose()
          this.part++
          this.filename = this.baseFilename + '-part-' + pad(this.part)
          this.step()
        }.bind(this)
      )
    } else {
      this.frames++
      this.step()
    }
  }

  CCWebMEncoder.prototype.save = function (callback) {
    this.videoWriter.complete().then(callback)
  }

  CCWebMEncoder.prototype.dispose = function (canvas) {
    this.frames = 0
    this.videoWriter = new WebMWriter({
      quality: this.quality,
      fileWriter: null,
      fd: null,
      frameRate: this.framerate,
    })
  }

  function CCFFMpegServerEncoder(settings) {
    CCFrameEncoder.call(this, settings)

    settings.quality = settings.quality / 100 || 0.8

    this.encoder = new FFMpegServer.Video(settings)
    this.encoder.on(
      'process',
      function () {
        this.emit('process')
      }.bind(this)
    )
    this.encoder.on(
      'finished',
      function (url, size) {
        var cb = this.callback
        if (cb) {
          this.callback = undefined
          cb(url, size)
        }
      }.bind(this)
    )
    this.encoder.on(
      'progress',
      function (progress) {
        if (this.settings.onProgress) {
          this.settings.onProgress(progress)
        }
      }.bind(this)
    )
    this.encoder.on(
      'error',
      function (data) {
        alert(JSON.stringify(data, null, 2))
      }.bind(this)
    )
  }

  CCFFMpegServerEncoder.prototype = Object.create(CCFrameEncoder.prototype)

  CCFFMpegServerEncoder.prototype.start = function () {
    this.encoder.start(this.settings)
  }

  CCFFMpegServerEncoder.prototype.add = function (canvas) {
    this.encoder.add(canvas)
  }

  CCFFMpegServerEncoder.prototype.save = function (callback) {
    this.callback = callback
    this.encoder.end()
  }

  CCFFMpegServerEncoder.prototype.safeToProceed = function () {
    return this.encoder.safeToProceed()
  }

  /*
	HTMLCanvasElement.captureStream()
*/

  function CCStreamEncoder(settings) {
    CCFrameEncoder.call(this, settings)

    this.framerate = this.settings.framerate
    this.type = 'video/webm'
    this.extension = '.webm'
    this.stream = null
    this.mediaRecorder = null
    this.chunks = []
  }

  CCStreamEncoder.prototype = Object.create(CCFrameEncoder.prototype)

  CCStreamEncoder.prototype.add = function (canvas) {
    if (!this.stream) {
      this.stream = canvas.captureStream(this.framerate)
      this.mediaRecorder = new MediaRecorder(this.stream)
      this.mediaRecorder.start()

      this.mediaRecorder.ondataavailable = function (e) {
        this.chunks.push(e.data)
      }.bind(this)
    }
    this.step()
  }

  CCStreamEncoder.prototype.save = function (callback) {
    this.mediaRecorder.onstop = function (e) {
      var blob = new Blob(this.chunks, { type: 'video/webm' })
      this.chunks = []
      callback(blob)
    }.bind(this)

    this.mediaRecorder.stop()
  }

  /*function CCGIFEncoder( settings ) {

	CCFrameEncoder.call( this );

	settings.quality = settings.quality || 6;
	this.settings = settings;

	this.encoder = new GIFEncoder();
	this.encoder.setRepeat( 1 );
  	this.encoder.setDelay( settings.step );
  	this.encoder.setQuality( 6 );
  	this.encoder.setTransparent( null );
  	this.encoder.setSize( 150, 150 );

  	this.canvas = document.createElement( 'canvas' );
  	this.ctx = this.canvas.getContext( '2d' );

}

CCGIFEncoder.prototype = Object.create( CCFrameEncoder );

CCGIFEncoder.prototype.start = function() {

	this.encoder.start();

}

CCGIFEncoder.prototype.add = function( canvas ) {

	this.canvas.width = canvas.width;
	this.canvas.height = canvas.height;
	this.ctx.drawImage( canvas, 0, 0 );
	this.encoder.addFrame( this.ctx );

	this.encoder.setSize( canvas.width, canvas.height );
	var readBuffer = new Uint8Array(canvas.width * canvas.height * 4);
	var context = canvas.getContext( 'webgl' );
	context.readPixels(0, 0, canvas.width, canvas.height, context.RGBA, context.UNSIGNED_BYTE, readBuffer);
	this.encoder.addFrame( readBuffer, true );

}

CCGIFEncoder.prototype.stop = function() {

	this.encoder.finish();

}

CCGIFEncoder.prototype.save = function( callback ) {

	var binary_gif = this.encoder.stream().getData();

	var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
	window?.location = data_url;
	return;

	var blob = new Blob( [ binary_gif ], { type: "octet/stream" } );
	var url = window.URL.createObjectURL( blob );
	callback( url );

}*/

  function CCGIFEncoder(settings) {
    CCFrameEncoder.call(this, settings)

    settings.quality = 31 - ((settings.quality * 30) / 100 || 10)
    settings.workers = settings.workers || 4

    this.extension = '.gif'
    this.mimeType = 'image/gif'

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.sizeSet = false

    this.encoder = new GIF({
      workers: settings.workers,
      quality: settings.quality,
      workerScript: settings.workersPath + 'gif.worker.js',
    })

    this.encoder.on(
      'progress',
      function (progress) {
        if (this.settings.onProgress) {
          this.settings.onProgress(progress)
        }
      }.bind(this)
    )

    this.encoder.on(
      'finished',
      function (blob) {
        var cb = this.callback
        if (cb) {
          this.callback = undefined
          cb(blob)
        }
      }.bind(this)
    )
  }

  CCGIFEncoder.prototype = Object.create(CCFrameEncoder.prototype)

  CCGIFEncoder.prototype.add = function (canvas) {
    if (!this.sizeSet) {
      this.encoder.setOption('width', canvas.width)
      this.encoder.setOption('height', canvas.height)
      this.sizeSet = true
    }

    this.canvas.width = canvas.width
    this.canvas.height = canvas.height
    this.ctx.drawImage(canvas, 0, 0)

    this.encoder.addFrame(this.ctx, { copy: true, delay: this.settings.step })
    this.step()

    /*this.encoder.setSize( canvas.width, canvas.height );
	var readBuffer = new Uint8Array(canvas.width * canvas.height * 4);
	var context = canvas.getContext( 'webgl' );
	context.readPixels(0, 0, canvas.width, canvas.height, context.RGBA, context.UNSIGNED_BYTE, readBuffer);
	this.encoder.addFrame( readBuffer, true );*/
  }

  CCGIFEncoder.prototype.save = function (callback) {
    this.callback = callback

    this.encoder.render()
  }

  function CCapture(settings) {
    var _settings = settings || {},
      _date = new Date(),
      _verbose,
      _display,
      _time,
      _startTime,
      _performanceTime,
      _performanceStartTime,
      _step,
      _encoder,
      _timeouts = [],
      _intervals = [],
      _frameCount = 0,
      _intermediateFrameCount = 0,
      _lastFrame = null,
      _requestAnimationFrameCallbacks = [],
      _capturing = false,
      _handlers = {}

    _settings.framerate = _settings.framerate || 60
    _settings.motionBlurFrames = 2 * (_settings.motionBlurFrames || 1)
    _verbose = _settings.verbose || false
    _display = _settings.display || false
    _settings.step = 1000.0 / _settings.framerate
    _settings.timeLimit = _settings.timeLimit || 0
    _settings.frameLimit = _settings.frameLimit || 0
    _settings.startTime = _settings.startTime || 0

    var _timeDisplay = document.createElement('div')
    _timeDisplay.style.position = 'absolute'
    _timeDisplay.style.left = _timeDisplay.style.top = 0
    _timeDisplay.style.backgroundColor = 'black'
    _timeDisplay.style.fontFamily = 'monospace'
    _timeDisplay.style.fontSize = '11px'
    _timeDisplay.style.padding = '5px'
    _timeDisplay.style.color = 'red'
    _timeDisplay.style.zIndex = 100000
    if (_settings.display) document.body.appendChild(_timeDisplay)

    var canvasMotionBlur = document.createElement('canvas')
    var ctxMotionBlur = canvasMotionBlur.getContext('2d')
    var bufferMotionBlur
    var imageData

    _log('Step is set to ' + _settings.step + 'ms')

    var _encoders = {
      gif: CCGIFEncoder,
      webm: CCWebMEncoder,
      ffmpegserver: CCFFMpegServerEncoder,
      png: CCPNGEncoder,
      jpg: CCJPEGEncoder,
      'webm-mediarecorder': CCStreamEncoder,
    }

    var ctor = _encoders[_settings.format]
    if (!ctor) {
      throw 'Error: Incorrect or missing format: Valid formats are ' + Object.keys(_encoders).join(', ')
    }
    _encoder = new ctor(_settings)
    _encoder.step = _step

    _encoder.on('process', _process)
    _encoder.on('progress', _progress)

    if ('performance' in window == false) {
      window.performance = {}
    }

    Date.now =
      Date.now ||
      function () {
        // thanks IE8
        return new Date().getTime()
      }

    if ('now' in window.performance == false) {
      var nowOffset = Date.now()

      if (performance.timing && performance.timing.navigationStart) {
        nowOffset = performance.timing.navigationStart
      }

      window.performance.now = function now() {
        return Date.now() - nowOffset
      }
    }

    var _oldSetTimeout = window.setTimeout,
      _oldSetInterval = window.setInterval,
      _oldClearInterval = window.clearInterval,
      _oldClearTimeout = window.clearTimeout,
      _oldRequestAnimationFrame = window.requestAnimationFrame,
      _oldNow = window.Date.now,
      _oldPerformanceNow = window.performance.now,
      _oldGetTime = window.Date.prototype.getTime
    // Date.prototype._oldGetTime = Date.prototype.getTime;

    var media = []

    function _init() {
      _log('Capturer start')

      _startTime = window.Date.now()
      _time = _startTime + _settings.startTime
      _performanceStartTime = window.performance.now()
      _performanceTime = _performanceStartTime + _settings.startTime

      window.Date.prototype.getTime = function () {
        return _time
      }
      window.Date.now = function () {
        return _time
      }

      window.setTimeout = function (callback, time) {
        var t = {
          callback: callback,
          time: time,
          triggerTime: _time + time,
        }
        _timeouts.push(t)
        _log('Timeout set to ' + t.time)
        return t
      }
      window.clearTimeout = function (id) {
        for (var j = 0; j < _timeouts.length; j++) {
          if (_timeouts[j] == id) {
            _timeouts.splice(j, 1)
            _log('Timeout cleared')
            continue
          }
        }
      }
      window.setInterval = function (callback, time) {
        var t = {
          callback: callback,
          time: time,
          triggerTime: _time + time,
        }
        _intervals.push(t)
        _log('Interval set to ' + t.time)
        return t
      }
      window.clearInterval = function (id) {
        _log('clear Interval')
        return null
      }
      window.requestAnimationFrame = function (callback) {
        _requestAnimationFrameCallbacks.push(callback)
      }
      window.performance.now = function () {
        return _performanceTime
      }

      function hookCurrentTime() {
        if (!this._hooked) {
          this._hooked = true
          this._hookedTime = this.currentTime || 0
          this.pause()
          media.push(this)
        }
        return this._hookedTime + _settings.startTime
      }

      try {
        Object.defineProperty(HTMLVideoElement.prototype, 'currentTime', { get: hookCurrentTime })
        Object.defineProperty(HTMLAudioElement.prototype, 'currentTime', { get: hookCurrentTime })
      } catch (err) {
        _log(err)
      }
    }

    function _start() {
      _init()
      _encoder.start()
      _capturing = true
    }

    function _stop() {
      _capturing = false
      _encoder.stop()
      _destroy()
    }

    function _call(fn, p) {
      _oldSetTimeout(fn, 0, p)
    }

    function _step() {
      //_oldRequestAnimationFrame( _process );
      _call(_process)
    }

    function _destroy() {
      _log('Capturer stop')
      window.setTimeout = _oldSetTimeout
      window.setInterval = _oldSetInterval
      window.clearInterval = _oldClearInterval
      window.clearTimeout = _oldClearTimeout
      window.requestAnimationFrame = _oldRequestAnimationFrame
      window.Date.prototype.getTime = _oldGetTime
      window.Date.now = _oldNow
      window.performance.now = _oldPerformanceNow
    }

    function _updateTime() {
      var seconds = _frameCount / _settings.framerate
      if (
        (_settings.frameLimit && _frameCount >= _settings.frameLimit) ||
        (_settings.timeLimit && seconds >= _settings.timeLimit)
      ) {
        _stop()
        _save()
      }
      var d = new Date(null)
      d.setSeconds(seconds)
      if (_settings.motionBlurFrames > 2) {
        _timeDisplay.textContent =
          'CCapture ' +
          _settings.format +
          ' | ' +
          _frameCount +
          ' frames (' +
          _intermediateFrameCount +
          ' inter) | ' +
          d.toISOString().substr(11, 8)
      } else {
        _timeDisplay.textContent =
          'CCapture ' + _settings.format + ' | ' + _frameCount + ' frames | ' + d.toISOString().substr(11, 8)
      }
    }

    function _checkFrame(canvas) {
      if (canvasMotionBlur.width !== canvas.width || canvasMotionBlur.height !== canvas.height) {
        canvasMotionBlur.width = canvas.width
        canvasMotionBlur.height = canvas.height
        bufferMotionBlur = new Uint16Array(canvasMotionBlur.height * canvasMotionBlur.width * 4)
        ctxMotionBlur.fillStyle = '#0'
        ctxMotionBlur.fillRect(0, 0, canvasMotionBlur.width, canvasMotionBlur.height)
      }
    }

    function _blendFrame(canvas) {
      //_log( 'Intermediate Frame: ' + _intermediateFrameCount );

      ctxMotionBlur.drawImage(canvas, 0, 0)
      imageData = ctxMotionBlur.getImageData(0, 0, canvasMotionBlur.width, canvasMotionBlur.height)
      for (var j = 0; j < bufferMotionBlur.length; j += 4) {
        bufferMotionBlur[j] += imageData.data[j]
        bufferMotionBlur[j + 1] += imageData.data[j + 1]
        bufferMotionBlur[j + 2] += imageData.data[j + 2]
      }
      _intermediateFrameCount++
    }

    function _saveFrame() {
      var data = imageData.data
      for (var j = 0; j < bufferMotionBlur.length; j += 4) {
        data[j] = (bufferMotionBlur[j] * 2) / _settings.motionBlurFrames
        data[j + 1] = (bufferMotionBlur[j + 1] * 2) / _settings.motionBlurFrames
        data[j + 2] = (bufferMotionBlur[j + 2] * 2) / _settings.motionBlurFrames
      }
      ctxMotionBlur.putImageData(imageData, 0, 0)
      _encoder.add(canvasMotionBlur)
      _frameCount++
      _intermediateFrameCount = 0
      _log('Full MB Frame! ' + _frameCount + ' ' + _time)
      for (var j = 0; j < bufferMotionBlur.length; j += 4) {
        bufferMotionBlur[j] = 0
        bufferMotionBlur[j + 1] = 0
        bufferMotionBlur[j + 2] = 0
      }
      gc()
    }

    function _capture(canvas) {
      if (_capturing) {
        if (_settings.motionBlurFrames > 2) {
          _checkFrame(canvas)
          _blendFrame(canvas)

          if (_intermediateFrameCount >= 0.5 * _settings.motionBlurFrames) {
            _saveFrame()
          } else {
            _step()
          }
        } else {
          _encoder.add(canvas)
          _frameCount++
          _log('Full Frame! ' + _frameCount)
        }
      }
    }

    function _process() {
      var step = 1000 / _settings.framerate
      var dt = (_frameCount + _intermediateFrameCount / _settings.motionBlurFrames) * step

      _time = _startTime + dt
      _performanceTime = _performanceStartTime + dt

      media.forEach(function (v) {
        v._hookedTime = dt / 1000
      })

      _updateTime()
      _log('Frame: ' + _frameCount + ' ' + _intermediateFrameCount)

      for (var j = 0; j < _timeouts.length; j++) {
        if (_time >= _timeouts[j].triggerTime) {
          _call(_timeouts[j].callback)
          //console.log( 'timeout!' );
          _timeouts.splice(j, 1)
          continue
        }
      }

      for (var j = 0; j < _intervals.length; j++) {
        if (_time >= _intervals[j].triggerTime) {
          _call(_intervals[j].callback)
          _intervals[j].triggerTime += _intervals[j].time
          //console.log( 'interval!' );
          continue
        }
      }

      _requestAnimationFrameCallbacks.forEach(function (cb) {
        _call(cb, _time - g_startTime)
      })
      _requestAnimationFrameCallbacks = []
    }

    function _save(callback) {
      if (!callback) {
        callback = function (blob) {
          download(blob, _encoder.filename + _encoder.extension, _encoder.mimeType)
          return false
        }
      }
      _encoder.save(callback)
    }

    function _log(message) {
      if (_verbose) console.log(message)
    }

    function _on(event, handler) {
      _handlers[event] = handler
    }

    function _emit(event) {
      var handler = _handlers[event]
      if (handler) {
        handler.apply(null, Array.prototype.slice.call(arguments, 1))
      }
    }

    function _progress(progress) {
      _emit('progress', progress)
    }

    return {
      start: _start,
      capture: _capture,
      stop: _stop,
      save: _save,
      on: _on,
    }
  }

  ;(freeWindow || freeSelf || {}).CCapture = CCapture

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function () {
      return CCapture
    })
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js.
    if (moduleExports) {
      ;(freeModule.exports = CCapture).CCapture = CCapture
    }
    // Export for CommonJS support.
    freeExports.CCapture = CCapture
  } else {
    // Export to the global object.
    root.CCapture = CCapture
  }
})()
