import { SimpleBuffer, Data, DataType, STRING_LENGTH_AUTO} from "../src/SimpleBuffer";

class PacketFloat {

    @Data(DataType.FLOAT_BE)
    public foo = 0.0;
}

describe("Float Serialization", () => {

    test("Serialization of a float", () => {
        const packet = new PacketFloat();
        packet.foo = 1;

        const buffer = SimpleBuffer.serialize(packet);
        const newPacket = SimpleBuffer.deserialize(buffer, PacketFloat);

        expect(newPacket.foo).toEqual(packet.foo);
    });

});
