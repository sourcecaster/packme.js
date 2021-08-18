## What is PackMe
PackMe is a lightweight library for packing your data into binary buffer (presumably in order to be sent over TCP connection) and unpacking it back to class objects described in a simple way via JSON manifest files.

## It is Fast 
Spoiler alert! ~500k pack/unpack cycles per second for data of average size and complexity. Of course it depends on system configuration :)

Since PackMe generates .mjs classes, there is no need for any resource demanding serialization/deserialization process. No intermediate steps involved, every class has it's own efficient methods to quickly put all data to Uint8List buffer and extract it. Comparing to popular solutions it's performance is similar to FlatBuffers and greatly outperforms Proto Buffers.

## It is Simple
No special file formats (like for FlatBuffers or Proto Buffers manifest files), just use JSON. Objects, types and messages declarations are very simple and intuitive.

## Usage
The best way of using it for client-server applications is by using ConnectMe package which provides all necessary stuff like adding message listeners, calling asynchronous queries etc. But you can use it separately as well.

Here's a simple manifest.json file (located in packme directory) for some hypothetical client-server application:
```json
{
    "get_user": [
        {
            "id": "string"
        },
        {
            "first_name": "string",
            "last_name": "string",
            "age": "uint8"
        }
    ]
}
```
Generate javascript files: 
```bash
# Usage: compiler.mjs <json_manifests_dir> <generated_classes_dir>
node compiler.mjs packme generated
```
Using on client side:
```javascript
import {manifestMessageFactory, GetUserRequest, GetUserResponse} from 'generated/manifest.generated.mjs';
import {PackMe, PackMeMessage} from 'packme';

// ... whatever code goes here

let packMe = new PackMe();
packMe.register(manifestMessageFactory); // Required by PackMe to create class instances while unpacking messages

let request = GetUserRequest('a7db84cc2ef5012a6498bc64334ffa7d');
socket.send(packMe.pack(request)); // Some socket implementation

socket.listen((/** Uint8Array */ data) => {
    let message = packMe.unpack(data);
    if (message instanceof GetUserResponse) {
        print(`He is awesome: ${message.firstName} ${message.lastName}, ${message.age} y.o.`);
    }
});
```
Using on server side:
```node
import {manifestMessageFactory, GetUserRequest, GetUserResponse} from 'generated/manifest.generated.mjs';
import {PackMe, PackMeMessage} from 'packme';

// ... whatever code goes here

let packMe = new PackMe();
packMe.register(manifestMessageFactory); // Required by PackMe to create class instances while unpacking messages

server.listen((/** Uint8Array */ data, /** SomeSocket */ socket) => { // Some server implementation
    let message = packMe.unpack(data);
    if (message instanceof GetUserRequest) {
        let response = GetUserResponse('Peter', 'Hollens', 39);
        socket.send(packMe.pack(response));
    }
});
```

## Supported platforms
Now it's only for Dart and JavaScript. Will there be more platforms? Well it depends... If developers will find this package useful then it will be implemented for C++ I guess.
