## 接口说明
### 签名程序位于 routes/tools/sign.js，routes/signTest.js 为 sign.js 的使用示例
### 接口 signERC1155Claim(obj)
### 参数 
    obj.id          NFT的批次id，正整数，string类型
    obj.spender     谁能领这个NFT，string类型 
    obj.deadline    过期时间戳，单位秒，string类型
### 返回   
    data.v      用于Bank1155合约claim接口
    data.s      用于Bank1155合约claim接口
    data.r      用于Bank1155合约claim接口
    data.digest 签名的hash，用于Bank1155合约nonce接口，可以查询该签名是否已使用
<br>

### 接口 signERC20Claim(obj)
### 参数 
    obj.token       token的合约地址，string类型
    obj.spender     谁能领这个token，string类型
    obj.value       领取的数量，正整数，以token的最小单位起算，string类型
    obj.deadline    过期时间戳，单位秒，string类型
### 返回   
    data.v      用于Bank20合约claim接口
    data.s      用于Bank20合约claim接口
    data.r      用于Bank20合约claim接口
    data.digest 签名的hash，用于Bank20合约nonce接口，可以查询该签名是否已使用

<br>
<br>

## 合约说明
### DeDropsNFT合约 0x27c6bA2d108E754805eACFD87e6394f75075f96c
### 用于铸造NFT并且转入Bank1155合约，每次调用mint可以铸造一批次的NFT，批次id自增
### 写入接口 mint
### 参数 
    name    NFT的名称，string类型
    url     图片的连接，string类型
    amount  数量，uint256类型
    info    NFT介绍，string类型
    info2   领取条件介绍，string类型
### 返回   
    无
<br>

### 读取接口 idToNFT
### 参数 
    id  批次id，uint256类型
### 返回 
    id      批次id，uint256类型  
    name    NFT的名称，string类型
    url     图片的连接，string类型
    amount  数量，uint256类型
    info    NFT介绍，string类型
    info2   领取条件介绍，string类型
<br>
<br>

### DeDropsERC合约 0x89071e124A10C0C91e87Ba6Fb17CBDA468DC1340
### 用于接收空投的ERC20token并且转入Bank20合约，并且把空投信息记录上链
### 写入接口 drop
### 参数 
    token       token的合约地址，address类型
    amount      数量，uint256类型
    title       图片的连接，string类型
    startTime   空投开始时间戳，单位秒，uint256类型
    endTime     空投开始时间戳，单位秒，uint256类型
    claimNum    可领取的地址数量，单位秒，uint256类型
    info        空投介绍，string类型
### 返回   
    无
<br>

### 读取接口 idToDrop
### 参数 
    id  空投活动id，uint256类型
### 返回
    id          空投活动id，uint256类型
    token       token的合约地址，address类型
    amount      数量，uint256类型
    title       图片的连接，string类型
    startTime   空投开始时间戳，单位秒，uint256类型
    endTime     空投开始时间戳，单位秒，uint256类型
    claimNum    可领取的地址数量，单位秒，uint256类型
    info        空投介绍，string类型
<br>
<br>

### Bank1155合约 0xc44dc52e259352B6C26AfFcEf9ce280836AD6860
### 用于分发NFT，用户提交签名来领取NFT
### 写入接口 claim
### 参数 
    token       NFT的合约地址，address类型
    id          批次id，uint256类型
    owner       签名者，固定是服务器账户，address类型
    spender     谁来领，一般是调用者自己，address类型
    deadline    过期时间戳，单位秒，uint256类型
    v           签名数据，uint8类型
    r           签名数据，bytes32类型
    s           签名数据，bytes32类型
### 返回   
    无
<br>

### 读取接口 nonces
### 参数 
    bytes32      签名的digest，bytes32类型
### 返回
    bool        是否已领取，bool类型
<br>
<br>

### Bank20合约 0x13d6f4529c2a003f14cde0a356cee66637cd739a
### 用于分发ERC20token，用户提交签名来领取token
### 写入接口 claim
### 参数 
    token       token的合约地址，address类型
    owner       签名者，固定是服务器账户，address类型
    spender     谁来领，一般是调用者自己，address类型
    value       数量，以token的最小单位起算，uint256类型
    deadline    过期时间戳，单位秒，uint256类型
    v           签名数据，uint8类型
    r           签名数据，bytes32类型
    s           签名数据，bytes32类型
### 返回   
    无
<br>

### 读取接口 nonces
### 参数 
    bytes32      签名的digest，bytes32类型
### 返回
    bool        是否已领取，bool类型
<br>
<br>
