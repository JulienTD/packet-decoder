import { SimpleBuffer, Data, DataType, STRING_LENGTH_AUTO} from "../src/SimpleBuffer";

class PacketInt8 {

    @Data(DataType.INT_8)
    public foo = 0;
}

class PacketUnsignedInt8 {

    @Data(DataType.UNSIGNED_INT_8)
    public foo = 0;
}

class PacketInt16 {

    @Data(DataType.INT_16_BE)
    public foo = 0;
}

class PacketUnsignedInt16 {

    @Data(DataType.UNSIGNED_INT_16_BE)
    public foo = 0;
}

class PacketInt32 {

    @Data(DataType.INT_32_BE)
    public foo = 0;
}

class PacketUnsignedInt32 {

    @Data(DataType.UNSIGNED_INT_32_BE)
    public foo = 0;
}

class PacketInt {

    @Data(DataType.INT_BE, 2)
    public foo = 0;
}

class PacketUnsignedInt {

    @Data(DataType.UNSIGNED_INT_BE, 2)
    public foo = 0;
}

describe("Integer Serialization", () => {
    describe("INT_8", () => {
        test("Serialization of a signed integer (8 bytes)", () => {
            const packet = new PacketInt8();
            packet.foo = -128;

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketInt8);

            expect(newPacket.foo).toEqual(packet.foo);
        });

        test("Serialization of an unsigned integer (8 bytes)", () => {
            const packet = new PacketUnsignedInt8();
            packet.foo = 255;

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketUnsignedInt8);

            expect(newPacket.foo).toEqual(packet.foo);
        });
    });

    describe("INT_16", () => {
        test("Serialization of a signed integer (16 bytes)", () => {
            const packet = new PacketInt16();
            packet.foo = -32768;

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketInt16);

            expect(newPacket.foo).toEqual(packet.foo);
        });

        test("Serialization of an unsigned integer (16 bytes)", () => {
            const packet = new PacketUnsignedInt16();
            packet.foo = 65535;

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketUnsignedInt16);

            expect(newPacket.foo).toEqual(packet.foo);
        });
    });

    describe("INT_32", () => {
        test("Serialization of a signed integer (32 bytes)", () => {
            const packet = new PacketInt32();
            packet.foo = -2147483648;

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketInt32);

            expect(newPacket.foo).toEqual(packet.foo);
        });

        test("Serialization of an unsigned integer (32 bytes)", () => {
            const packet = new PacketUnsignedInt32();
            packet.foo = 4294967295;

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketUnsignedInt32);

            expect(newPacket.foo).toEqual(packet.foo);
        });
    });

    describe("INT", () => {
        test("Serialization of a signed integer", () => {
            const packet = new PacketInt();
            packet.foo = -32768;

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketInt);

            expect(newPacket.foo).toEqual(packet.foo);
        });

        test("Serialization of an unsigned integer", () => {
            const packet = new PacketUnsignedInt();
            packet.foo = 65535;

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketUnsignedInt);

            expect(newPacket.foo).toEqual(packet.foo);
        });
    });
});
