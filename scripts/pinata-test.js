const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('0714ed1903dec7123950', '3ebe35383c35143cff2131c6ee4cc64f096f9f8085cb0e6118b6f5781204ca1f');

// pinata.testAuthentication().then((result) => {
//     //handle successful authentication here
//     console.log(result);
// }).catch((err) => {
//     //handle error here
//     console.log(err);
// });


const fs = require('fs');
const readableStreamForFile = fs.createReadStream('./logo.png');
// const options = {
//     pinataMetadata: {
//         name: MyCustomName,
//         keyvalues: {
//             customKey: 'customValue',
//             customKey2: 'customValue2'
//         }
//     },
//     pinataOptions: {
//         cidVersion: 0
//     }
// };
pinata.pinFileToIPFS(readableStreamForFile).then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});