var sockm = {
  socket: null,
  socketServer: null,
  namespace: null,
  nickname: null,
  fnConnect: null,
  fnRoomchatAdmin: null,
  fnRoomchat: null,
  fnDisconnect: null,
  fnTargetRoomInfo: null,
  fnImageUser: null,
  fnImageAdmin: null,
  fnRoomInfo: null,
  fnRoomcreate: null,
  init: function(option){
    this.fnConnect = option.fnConnect;
    this.fnRoomchatAdmin = option.fnRoomchatAdmin;
    this.fnRoomchat = option.fnRoomchat;
    this.fnDisconnect = option.fnDisconnect;
    this.fnTargetRoomInfo = option.fnTargetRoomInfo;
    this.fnImageUser = option.fnImageUser;
    this.fnImageAdmin = option.fnImageAdmin;
    this.fnRoomInfo = option.fnRoomInfo;
    this.fnRoomcreate = option.fnRoomcreate;
    this.socketServer = option.socketServer;
  },
  startSocket: function(namespace, nickname){
    var _this = this;
    _this.namespace = namespace;
    _this.nickname = nickname;
    _this.socket = io(_this.socketServer+'/'+_this.namespace);
    _this.socket.on('connect', function(){
      _this.socket.emit('roomcreate', {nickname:nickname});
      if(typeof _this.fnConnect == 'function') _this.fnConnect();
    });
    _this.socket.on('roomchatAdmin', function(data){
      if(typeof _this.fnConnect == 'function') _this.fnRoomchatAdmin(data);
    });
    _this.socket.on('roomchat', function(data){
      if(typeof _this.fnRoomchat == 'function') _this.fnRoomchat(data);
    });
    _this.socket.on('disconnect', function(){
      if(typeof _this.fnDisconnect == 'function') _this.fnDisconnect();
    });
    _this.socket.on('targetRoomInfo', function(data){
      if(typeof _this.fnTargetRoomInfo == 'function') _this.fnTargetRoomInfo(data);
    });
    _this.socket.on("imageUser", function (data) {
      if(typeof _this.fnImageUser == 'function') _this.fnImageUser(data);
    });
    _this.socket.on("imageAdmin", function (data) {
      if(typeof _this.fnImageAdmin == 'function') _this.fnImageAdmin(data);
    });
    _this.socket.on("roomInfo", function (data) {
      if(typeof _this.fnRoomInfo == 'function') _this.fnRoomInfo(data);
    });
    _this.socket.on("roomcreate", function (data) {
      if(typeof _this.fnRoomcreate == 'function') _this.fnRoomcreate(data);
    });

  },
  sendUserMessage: function(msg){
    if(this.socket) this.socket.emit("roomchat", {msg:msg});
  },
  sendUserImage: function(image){
    if(this.socket) this.socket.emit("image", image);
  },
  closeSocketLister: function(){
    if(this.socket) this.socket.off();
    this.socket = null;
  },
  leaveRoom: function(){
    if(this.socket) this.socket.emit('leaveroom');
  },
  closeSocket: function(){
    try {
      if(this.socket){
        this.socket.disconnect();
        this.socket.close();
      }
    } catch (error) {
    }
    this.closeSocketLister();
  }
};