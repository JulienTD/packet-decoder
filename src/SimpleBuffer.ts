import { Buffer } from "buffer";
import "reflect-metadata";

type IType<T> = new(...args: Array<any>) => T;

const metadataKey = Symbol("Data");

const serializers = [
    Buffer.prototype.writeBigInt64BE,
    Buffer.prototype.writeBigInt64LE,
    Buffer.prototype.writeBigUInt64BE,
    Buffer.prototype.writeBigUInt64LE,
    Buffer.prototype.writeDoubleBE,
    Buffer.prototype.writeDoubleLE,
    Buffer.prototype.writeFloatBE,
    Buffer.prototype.writeFloatLE,
    Buffer.prototype.writeInt8,
    Buffer.prototype.writeUInt8,
    Buffer.prototype.writeInt16BE,
    Buffer.prototype.writeInt16LE,
    Buffer.prototype.writeUInt16BE,
    Buffer.prototype.writeUInt16LE,
    Buffer.prototype.writeInt32BE,
    Buffer.prototype.writeInt32LE,
    Buffer.prototype.writeUInt32BE,
    Buffer.prototype.writeUInt32LE,
    Buffer.prototype.writeIntBE,
    Buffer.prototype.writeIntLE,
    Buffer.prototype.writeUIntBE,
    Buffer.prototype.writeUIntLE,
    Buffer.prototype.write
];

const deserializers = [
    Buffer.prototype.readBigInt64BE,
    Buffer.prototype.readBigInt64LE,
    Buffer.prototype.readBigUInt64BE,
    Buffer.prototype.readBigUInt64LE,
    Buffer.prototype.readDoubleBE,
    Buffer.prototype.readDoubleLE,
    Buffer.prototype.readFloatBE,
    Buffer.prototype.readFloatLE,
    Buffer.prototype.readInt8,
    Buffer.prototype.readUInt8,
    Buffer.prototype.readInt16BE,
    Buffer.prototype.readInt16LE,
    Buffer.prototype.readUInt16BE,
    Buffer.prototype.readUInt16LE,
    Buffer.prototype.readInt32BE,
    Buffer.prototype.readInt32LE,
    Buffer.prototype.readUInt32BE,
    Buffer.prototype.readUInt32LE,
    Buffer.prototype.readIntBE,
    Buffer.prototype.readIntLE,
    Buffer.prototype.readUIntBE,
    Buffer.prototype.readUIntLE,
    Buffer.prototype.toString
];

export enum DataType {
    BIG_INT_64_BE = 0,
    BIG_INT_64_LE = 1,
    BIG_UNSIGNED_INT_BE = 2,
    BIG_UNSIGNED_INT_LE = 3,
    DOUBLE_BE = 4,
    DOUBLE_LE = 5,
    FLOAT_BE = 6,
    FLOAT_LE = 7,
    INT_8 = 8,
    UNSIGNED_INT_8 = 9,
    INT_16_BE = 10,
    INT_16_LE = 11,
    UNSIGNED_INT_16_BE = 12,
    UNSIGNED_INT_16_LE = 13,
    INT_32_BE = 14,
    INT_32_LE = 15,
    UNSIGNED_INT_32_BE = 16,
    UNSIGNED_INT_32_LE = 17,
    INT_BE = 18,
    INT_LE = 19,
    UNSIGNED_INT_BE = 20,
    UNSIGNED_INT_LE = 21,
    STRING = 22
};

export const STRING_LENGTH_AUTO = -1;

/**
 * String constructor
 * @param dataType DataType.STRING
 * @param length number of bytes needed by the string, or it can be auto detected by putting STRING_LENGTH_AUTO
 * @param encoding The character encoding of string. Default: 'utf8'.
 */
export function Data(dataType: DataType.STRING, byteLength: number, encoding: string): any;

/**
 * String constructor
 * @param dataType DataType.STRING
 * @param length number of bytes needed by the string
 */
export function Data(dataType: DataType.STRING, byteLength: number): any;

/**
 * (Unsigned) Integer BE/LE constructor
 * @param dataType DataType.INT_BE | DataType.INT_LE | DataType.UNSIGNED_INT_BE | DataType.UNSIGNED_INT_LE
 * @param byteLength Number of bytes to write or read. Must satisfy 0 < byteLength <= 6.
 */
export function Data(dataType: DataType.INT_BE | DataType.INT_LE | DataType.UNSIGNED_INT_BE | DataType.UNSIGNED_INT_LE, byteLength: number): any;

export function Data(dataType: DataType): any;

export function Data(dataType: DataType, arg1?: any, arg2?: any): unknown {
    if (dataType == DataType.STRING && arg1 == null)
        throw Error("Wrong constructor for the String type");
    else if ((dataType == DataType.INT_BE || dataType == DataType.INT_LE || dataType == DataType.UNSIGNED_INT_BE || dataType == DataType.UNSIGNED_INT_LE) && arg1 == null)
        throw Error("Wrong constructor for the String type");
    return Reflect.metadata(metadataKey, {
        dataType,
        arg1,
        arg2
    });
}

export class SimpleBuffer {

    /**
     * Serialized a class to a buffer
     * @param packet class containing data
     */
    public static serialize<T>(packet: T): Buffer {
        const packetSize = SimpleBuffer.evaluatePacketSize(packet);
        const buffer = Buffer.alloc(packetSize);
        let currentOffset = 0;

        for (const key in packet) {
            const metaData = Reflect.getMetadata(metadataKey, packet, key);

            currentOffset += SimpleBuffer.write(buffer, currentOffset, metaData.dataType, packet[key], metaData.arg1, metaData.arg2);
        }
        return buffer;
    }

    /**
     * Deserialized a buffer to a class
     * @param buffer buffer containing data
     * @param reference the reference class to convert the buffer into a class
     */
    public static deserialize<T>(buffer: Buffer, reference: IType<T>): T {
        const packet: T = new reference();
        let currentOffset = 0;

        for (const key in packet) {
            const metaData = Reflect.getMetadata(metadataKey, packet, key);
            const dataRead = SimpleBuffer.read(buffer, currentOffset, metaData.dataType, metaData.arg1, metaData.arg2);

            packet[key] = dataRead[0];
            currentOffset += dataRead[1];
        }
        return packet;
    }

    /**
     * Write data in a buffer
     * @param buffer the buffer to write on
     * @param offset the write offset
     * @param dataType type of data to write
     * @param data the data to write
     * @param arg1 non required argument, some constructor may use it
     * @param arg2 non required argument, some constructor may use it
     * @returns number of byte written in the buffer
     */
    private static write(buffer: Buffer, offset: number, dataType: DataType, data: any, arg1?: any, arg2?: any): number {
        if (dataType == DataType.STRING) {
            if (arg1 == STRING_LENGTH_AUTO) {
                const stringNbrBytes = Buffer.byteLength(data, (arg2 == undefined ? "utf8" : arg2)); // nbr byte of string
                const stringLengthDataType = SimpleBuffer.retrieveBestDataTypeForNbr(stringNbrBytes); // string length data type
                const stringLengthNbrBytes = SimpleBuffer.getByteSize(stringLengthDataType);

                (serializers[DataType.UNSIGNED_INT_8] as any).call(buffer, stringLengthDataType, offset); // write type of int
                (serializers[stringLengthDataType] as any).call(buffer, stringNbrBytes, offset + 1); // write byte size
                (serializers[dataType] as any).call(buffer, data, offset + stringLengthNbrBytes + 1, stringNbrBytes, (arg2 == undefined ? "utf8" : arg2));
                return stringNbrBytes + stringLengthNbrBytes + 1;
            } else {
                (serializers[dataType] as any).call(buffer, data, offset, arg1, (arg2 == undefined ? "utf8" : arg2));
                return arg1;
            }
        } else if (dataType == DataType.INT_BE || dataType == DataType.INT_LE || dataType == DataType.UNSIGNED_INT_BE || dataType == DataType.UNSIGNED_INT_LE) {
            (serializers[dataType] as any).call(buffer, data, offset, arg1);
            return arg1;
        }
        (serializers[dataType] as any).call(buffer, data, offset);
        return SimpleBuffer.getByteSize(dataType);
    }

    /**
     * Read data from a buffer
     * @param buffer the buffer to read on
     * @param offset the read offset
     * @param dataType type of data to read
     * @param arg1 non required argument, some constructor may use it
     * @param arg2 non required argument, some constructor may use it
     * @returns an array containing at the 0 index: the data read; and at the 1 index: the number of byte read
     */
    private static read(buffer: Buffer, offset: number, dataType: DataType, arg1?: any, arg2?: any): Array<any> {
        let data = null;

        if (dataType == DataType.STRING) {
            if (arg1 == STRING_LENGTH_AUTO) {
                const stringLengthDataType: number = (deserializers[DataType.UNSIGNED_INT_8] as any).call(buffer, offset);
                const stringNbrBytes = (deserializers[stringLengthDataType] as any).call(buffer, offset + 1);
                const stringLengthNbrByte = SimpleBuffer.getByteSize(stringLengthDataType);

                data = (deserializers[dataType] as any).call(buffer, (arg2 == undefined ? "utf8" : arg2),
                                                            offset + stringLengthNbrByte + 1, offset + stringLengthNbrByte + stringNbrBytes + 1);
                return [data, 1 + stringLengthNbrByte + stringNbrBytes];
            } else {
                data = (deserializers[dataType] as any).call(buffer, (arg2 == undefined ? "utf8" : arg2), offset, offset + arg1);
                return [data, arg1];
            }
        } else if (dataType == DataType.INT_BE || dataType == DataType.INT_LE || dataType == DataType.UNSIGNED_INT_BE || dataType == DataType.UNSIGNED_INT_LE) {
            data = (deserializers[dataType] as any).call(buffer, offset, arg1);
            return [data, arg1];
        }
        data = (deserializers[dataType] as any).call(buffer, offset);
        return [data, SimpleBuffer.getByteSize(dataType)];
    }

    /**
     * Evaluate the size of a packet in byte
     * @param packet the packet to evaluate
     */
    public static evaluatePacketSize<T>(packet: T): number {
        let packetSize = 0;

        for (const key in packet) {
            const metaData = Reflect.getMetadata(metadataKey, packet, key);

            if (metaData.dataType == DataType.INT_BE || metaData.dataType == DataType.INT_LE ||
                metaData.dataType == DataType.UNSIGNED_INT_BE || metaData.dataType == DataType.UNSIGNED_INT_LE) {
                    packetSize += metaData.arg1;
            } else if (metaData.dataType == DataType.STRING) {
                if (metaData.arg1 == STRING_LENGTH_AUTO) {
                    const stringNbrBytes = Buffer.byteLength(packet[key] as any, (metaData.arg2 == undefined ? "utf8" : metaData.arg2));
                    const stringLengthDataType = SimpleBuffer.retrieveBestDataTypeForNbr(stringNbrBytes);
                    const stringLengthNbrBytes = SimpleBuffer.getByteSize(stringLengthDataType);

                    packetSize += 1 + stringNbrBytes + stringLengthNbrBytes;
                } else {
                    packetSize += metaData.arg1;
                }
            } else {
                packetSize += SimpleBuffer.getByteSize(metaData.dataType);
            }
        }
        return packetSize;
    }

    /**
     * Size in byte of a data type
     * @param dataType data type
     */
    public static getByteSize(dataType: DataType) {
        switch(dataType) {
            case DataType.BIG_INT_64_BE:
            case DataType.BIG_INT_64_LE:
            case DataType.BIG_UNSIGNED_INT_BE:
            case DataType.BIG_UNSIGNED_INT_LE:
            case DataType.DOUBLE_BE:
            case DataType.DOUBLE_LE:
                return 8;
            case DataType.FLOAT_BE:
            case DataType.FLOAT_LE:
                return 4;
            case DataType.INT_8:
            case DataType.UNSIGNED_INT_8:
                return 1;
            case DataType.INT_16_BE:
            case DataType.INT_16_LE:
            case DataType.UNSIGNED_INT_16_BE:
            case DataType.UNSIGNED_INT_16_LE:
                return 2;
            case DataType.INT_32_BE:
            case DataType.INT_32_LE:
            case DataType.UNSIGNED_INT_32_BE:
            case DataType.UNSIGNED_INT_32_LE:
                return 4;
            case DataType.INT_BE:
            case DataType.INT_LE:
            case DataType.UNSIGNED_INT_BE:
            case DataType.UNSIGNED_INT_LE:
            case DataType.STRING:
                return 0;
            default:
                return 0;
        }
    }

    /**
     * Find the best data type for a number
     * @param val a number, must be positive or equal to zero
     */
    private static retrieveBestDataTypeForNbr(val: number): DataType {
        if (val <= 255)
            return DataType.UNSIGNED_INT_8;
        if (val <= 65535)
            return DataType.UNSIGNED_INT_16_BE;
        if (val <= 4294967295)
            return DataType.UNSIGNED_INT_32_BE;
        return DataType.BIG_UNSIGNED_INT_BE;
    }
}
