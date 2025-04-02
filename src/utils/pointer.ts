import { Data2, Data3 } from "data/data_types";

export class Pointer {
    private dataView: DataView;
    private currentOffset = 0;

    constructor(arrayBuffer: ArrayBuffer) {
        this.dataView = new DataView(arrayBuffer);
    }

    skip(offset: number) {
        this.currentOffset += offset;
    }

    readUint8(): number {
        let value = this.dataView.getUint8(this.currentOffset);
        this.currentOffset += Uint8Array.BYTES_PER_ELEMENT;
        return value;
    }

    readInt32(): number {
        let value = this.dataView.getInt32(this.currentOffset, true);
        this.currentOffset += Int32Array.BYTES_PER_ELEMENT;
        return value;
    }

    readFloat32(): number {
        let value = this.dataView.getFloat32(this.currentOffset, true);
        this.currentOffset += Float32Array.BYTES_PER_ELEMENT;
        return value;
    }

    readBool32(): boolean {
        let value = this.dataView.getInt32(this.currentOffset, true) != 0 ? true : false;
        this.currentOffset += Int32Array.BYTES_PER_ELEMENT;
        return value;
    }

    readData2Int32(): Data2 {
        let d0 = this.dataView.getInt32(this.currentOffset, true);
        this.currentOffset += Int32Array.BYTES_PER_ELEMENT
        let d1 = this.dataView.getInt32(this.currentOffset, true);
        this.currentOffset += Int32Array.BYTES_PER_ELEMENT
        return new Data2(d0, d1);
    }

    readData3Uint8(): Data3 {
        let d0 = this.dataView.getUint8(this.currentOffset);
        this.currentOffset += Uint8Array.BYTES_PER_ELEMENT
        let d1 = this.dataView.getUint8(this.currentOffset);
        this.currentOffset += Uint8Array.BYTES_PER_ELEMENT
        let d2 = this.dataView.getUint8(this.currentOffset);
        this.currentOffset += Uint8Array.BYTES_PER_ELEMENT
        return new Data3(d0, d1, d2);
    }

    readData3Int32(): Data3 {
        let d0 = this.dataView.getInt32(this.currentOffset, true);
        this.currentOffset += Int32Array.BYTES_PER_ELEMENT
        let d1 = this.dataView.getInt32(this.currentOffset, true);
        this.currentOffset += Int32Array.BYTES_PER_ELEMENT
        let d2 = this.dataView.getInt32(this.currentOffset, true);
        this.currentOffset += Int32Array.BYTES_PER_ELEMENT
        return new Data3(d0, d1, d2);
    }

    readData3Float32(): Data3 {
        let d0 = this.dataView.getFloat32(this.currentOffset, true);
        this.currentOffset += Float32Array.BYTES_PER_ELEMENT
        let d1 = this.dataView.getFloat32(this.currentOffset, true);
        this.currentOffset += Float32Array.BYTES_PER_ELEMENT
        let d2 = this.dataView.getFloat32(this.currentOffset, true);
        this.currentOffset += Float32Array.BYTES_PER_ELEMENT
        return new Data3(d0, d1, d2);
    }
}