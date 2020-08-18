import { SimpleBuffer, Data, DataType, STRING_LENGTH_AUTO} from "../src/SimpleBuffer";

class PacketBigInt {

    @Data(DataType.BIG_INT_64_BE)
    public foo = BigInt("");
}

class PacketUnsignedBigInt {

    @Data(DataType.BIG_UNSIGNED_INT_BE)
    public foo = BigInt("");
}

describe("Big Serialization", () => {

    test("Serialization of a Big Int", () => {
        const packet = new PacketBigInt();
        packet.foo = BigInt("-12345678987654321");

        const buffer = SimpleBuffer.serialize(packet);
        const newPacket = SimpleBuffer.deserialize(buffer, PacketBigInt);

        expect(newPacket.foo).toEqual(packet.foo);
    });

    test("Serialization of an unsigned Big Int", () => {
        const packet = new PacketUnsignedBigInt();
        packet.foo = BigInt("123456789876543212");

        const buffer = SimpleBuffer.serialize(packet);
        const newPacket = SimpleBuffer.deserialize(buffer, PacketUnsignedBigInt);

        expect(newPacket.foo).toEqual(packet.foo);
    });
});
