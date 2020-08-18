# Simple-Buffer

Facilitates the manipulation of buffers.

## Installation

```bash
$ npm install simple-buffer
```

You must also activate `experimentalDecorators` and `emitDecoratorMetadata` in your `tsconfig.json`.  
It should look similar to the one below:
```json
{
    "compilerOptions": {
        "target": "es5",
        "lib": ["es2015"],
        "module": "commonjs",
        "strict": true,
        "declaration": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
    }
}
```

## Getting started

First, we'll create a class containing the data we want to serialize.
```typescript

class UserProfile {

    @Data(DataType.STRING, STRING_LENGTH_AUTO)
    name: string = "";

    @Data(DataType.STRING, 100)
    email: string = "";

    @Data(DataType.INT_8)
    age: number = 0;

    @Data(DataType.DOUBLE_BE)
    date: number = 0;
}
```

As you can see, on each field we put @Data with the specification of the data type.  
Some DataType may require one or two extra arguments.  
i.e.: a string has a variable length, so the lib needs to know how many bytes it can write. It can be defined by the user, or it can be automatically detected by putting the flag `STRING_LENGTH_AUTO`.
  
Once the packet class is created, we may proceed to the serialization and deserialization.
```typescript

const packet = new UserProfile();
packet.name = "Lorem Ipsum";
packet.email = "lorem.ipsum@loremipsum.loremipsum";
packet.age = 42;
packet.date = Date.now();

const buffer = SimpleBuffer.serialize(packet);

const decodedPacket = SimpleBuffer.deserialize(buffer, UserProfile);

```
That's it, the serialization and deserialization only take 2 lines.  
You can find this code [here](https://github.com/JulienTD/simple-buffer/blob/master/example/Example.ts)