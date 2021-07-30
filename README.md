## 合约说明
### DeDropsNFT合约 0xa96e19Fd3342a52eff889EF729a81ba1Ed8a60E0
#### 用于铸造NFT并且转入Bank1155合约，每次调用mint可以铸造一批次的NFT，批次id自增
### 写入接口 mint
### 参数 
    amount  数量，uint256类型
    info    描述，string类型
    info2   描述2，string类型
### 返回   
    无
<br>

### 读取接口 idToItem
### 参数 
    id  批次id，uint256类型
### 返回 
    id      批次id，uint256类型  
    info    描述，string类型
    info2   描述2，string类型
<br>

### 事件 event Drop(uint indexed id, uint256 amount, string info, string info2)
#### 调用mint就会发起Drop事件，表示是这批NFT已经投放到Bank1155合约，用服务器签名可以领取NFT
<br>
<br>

### DeDropsERC合约 0xF2F2ed5f790f33e33f48D0e33addb33B002Ab4DF
#### 用于接收空投的ERC20token并且转入Bank20合约，并且把空投信息记录上链
### 写入接口 drop
### 参数 
    token   token的合约地址，address类型
    amount  数量，uint256类型
    info    描述，string类型
    info2   描述2，string类型
### 返回   
    无
<br>

### 读取接口 idToItem
### 参数 
    id  空投活动id，uint256类型
### 返回
    id      空投活动id，uint256类型
    token   token的合约地址，address类型
    amount  数量，uint256类型
    info    描述，string类型
    info2   描述2，string类型
<br>

### 事件 event Drop(address indexed token, uint256 amount, string info, string info2)
#### 调用drop就会发起Drop事件，表示是这批ERC已经投放到Bank20合约，用服务器签名可以领取ERC
<br>
<br>

### Bank1155合约 0xc44dc52e259352B6C26AfFcEf9ce280836AD6860
#### 用于分发NFT，用户提交签名来领取NFT
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
#### 用于分发ERC20token，用户提交签名来领取token
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
