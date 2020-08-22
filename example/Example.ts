import { SimpleBuffer, Data, DataType, STRING_LENGTH_AUTO} from "../src/SimpleBuffer";

class UserProfile {

    @Data(DataType.INT_8)
    packetId: number = 0;

    @Data(DataType.STRING, STRING_LENGTH_AUTO)
    name: string = "";

    @Data(DataType.STRING, 100)
    email: string = "";

    @Data(DataType.INT_8)
    age: number = 0;

    @Data(DataType.DOUBLE_BE)
    date: number = 0;
}

const packet = new UserProfile();
packet.packetId = 2;
packet.name = "Lorem Ipsum";
packet.email = "lorem.ipsum@loremipsum.loremipsum";
packet.age = 42;
packet.date = Date.now();

const buffer = SimpleBuffer.serialize(packet);

const decodedPacket = SimpleBuffer.deserialize(buffer, UserProfile);

console.log(decodedPacket);
