import { SimpleBuffer, Data, DataType, STRING_LENGTH_AUTO} from "../src/SimpleBuffer";

class PacketFixedString {

    @Data(DataType.STRING, 4)
    public foo = "";
}

class PacketDynamicString {

    @Data(DataType.STRING, STRING_LENGTH_AUTO)
    public foo = "";
}

describe("String Serialization", () => {
    describe("Fixed length", () => {
        test("Serialization of a string with a defined byte length", () => {
            const packet = new PacketFixedString();
            packet.foo = "Test";

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketFixedString);

            expect(newPacket.foo).toEqual(packet.foo);
        });

        test("Serialization of an empty string with a defined byte length", () => {
            const packet = new PacketFixedString();
            packet.foo = "";

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketFixedString);

            expect(newPacket.foo).toStrictEqual('\u0000\u0000\u0000\u0000');
        });
    });

    describe("Dynamic length", () => {
        test("Serialization of a string with a dynamic length (4 char)", () => {
            const packet = new PacketDynamicString();
            packet.foo = "Test";

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketDynamicString);

            expect(newPacket.foo).toEqual(packet.foo);
            expect(SimpleBuffer.evaluatePacketSize(packet)).toEqual(6);
        });

        test("Serialization of a string with a dynamic length (256 char)", () => {
            const packet = new PacketDynamicString();
            packet.foo = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,.";

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketDynamicString);

            expect(newPacket.foo).toEqual(packet.foo);
            expect(SimpleBuffer.evaluatePacketSize(packet)).toEqual(259);
        });

        test("Serialization of an empty string with a defined byte length", () => {
            const packet = new PacketDynamicString();
            packet.foo = "";

            const buffer = SimpleBuffer.serialize(packet);
            const newPacket = SimpleBuffer.deserialize(buffer, PacketDynamicString);

            expect(newPacket.foo).toHaveLength(0);
        });
    });
});
