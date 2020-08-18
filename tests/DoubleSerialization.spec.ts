import { SimpleBuffer, Data, DataType, STRING_LENGTH_AUTO} from "../src/SimpleBuffer";

class PacketDouble {

    @Data(DataType.DOUBLE_BE)
    public foo = 0.0;
}

describe("Double Serialization", () => {

    test("Serialization of a double", () => {
        const packet = new PacketDouble();
        packet.foo = 1.23456789;

        const buffer = SimpleBuffer.serialize(packet);
        const newPacket = SimpleBuffer.deserialize(buffer, PacketDouble);

        expect(newPacket.foo).toEqual(packet.foo);
    });

});
