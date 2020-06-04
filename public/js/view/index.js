var nickname = 'User';
var socketServer = 'https://test-mchat.cmsedu.co.kr';
var currRoomAdmin = null;
var currNamesapce = null;
Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
$(function(){
  sockm.init({
    fnConnect: function(){
      console.log('connect!!');
    },
    fnRoomchatAdmin: function (data){
      var inhtml = $('#chat-rev-template').html();
      var template = Handlebars.compile(inhtml);
      var innerHtml = template({msg:data.msg, time:data.time});
      $('#addMessage').append(innerHtml);
      $('#chat_view').animate({scrollTop: $("#chat_view")[0].scrollHeight}, 100);
      console.log('roomchatAdmin : '+data);
    },
    fnRoomchat: function (data){
      var inhtml = $('#chat-send-template').html();
      var template = Handlebars.compile(inhtml);
      var innerHtml = template({msg:data.msg, time:data.time});
      $('#addMessage').append(innerHtml);
      $('#chat_view').animate({scrollTop: $("#chat_view")[0].scrollHeight}, 100);
      console.log('roomchat : '+data);
    },
    fnDisconnect: function (){
      console.log('disconnect');
    },
    fnTargetRoomInfo: function (data){
      var isDasable = (data && data.isAdminOnline) ? false : true;
      var isAdminEnd = data.isAdminEnd;
      disabledToggle(isDasable,isAdminEnd);
    },
    fnImageUser: function (data){
      console.log("imageUser");
      var inhtml = $('#chat-send-img-template').html();
      var template = Handlebars.compile(inhtml);
      var innerHtml = template({msg:data.msg, time:data.time});
      $('#addMessage').append(innerHtml);
      $('#chat_view').animate({scrollTop: $("#chat_view")[0].scrollHeight}, 100);
    },
    fnImageAdmin: function (data){
      console.log("imageAdmin");
      var inhtml = $('#chat-rev-img-template').html();
      var template = Handlebars.compile(inhtml);
      var innerHtml = template({msg:data.msg, time:data.time});
      $('#addMessage').append(innerHtml);
      $('#chat_view').animate({scrollTop: $("#chat_view")[0].scrollHeight}, 100);
    },
    socketServer: socketServer
  });
  function startSocket(namespace, nickname){
    $('#addMessage').empty();
    sockm.leaveRoom();
    sockm.startSocket(namespace, nickname);
  }
  function sendUserMessage(msg){
    if (!msg) return;
    if (!currRoomAdmin){
      systemShowMessage();
      $('#inMessage').val('');
    } else {
      sockm.sendUserMessage(msg);
      $('#inMessage').val('');
    }
  }
  function sendUserImage(event){
    if (!currRoomAdmin){
      systemShowMessage();
    } else {
      var image = event.target.result;
      sockm.sendUserImage(image);
    }
  }

  // 소켓시작버튼
  $(".person").on('click', function(){
    $(this).toggleClass('focus').siblings().removeClass('focus');
    var namespace = $(this).attr('data-namespace');
    currNamesapce = namespace;
    startSocket(namespace, nickname);
  });

  $('#btnInMessage').on('click', function(){
    var msg = $('#inMessage').val();
    sendUserMessage(msg);
  });
  $('#inMessage').on('keyup', function(key){
    if (key.keyCode == 13) {
        var msg = $(this).val();
        sendUserMessage(msg);
    }
  });
 
  // 이미지 전송 Listen to file input events
  $('#chatfile').on('change', function(event){
    //document.getElementById("chatfile").addEventListener("change", function (event) {
    //var output = document.getElementById("output");
    // Prepeare file reader
    var file = event.target.files[0];
    //var imgFile = $('#chatfile').val();
    var imgFile = $(this).val();
    var fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
    var fileReader = new FileReader();
    if (file == null) {
      return;
    }
    if (!(imgFile.toLowerCase()).match(fileForm)){
      alert("이미지 파일만 전송이 가능합니다.");
      var agent = navigator.userAgent.toLowerCase();
      if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ){
        $("#chatfile").replaceWith( $("#chatfile").clone(true) ); 
      } else { 
          // other browser 일때 input[type=file] init. 
          $("#chatfile").val(""); 
      }
      return;
    }
    fileReader.onloadend = function (event) {
      // // Send an image event to the socket
      // var image = event.target.result;
      // //output.src = image;
      // console.log('socket.emit.emit("image", image);');
      // socket.emit("image", image);
      sendUserImage(event);
    };

    // Read file
    fileReader.readAsDataURL(file);
  });
  
  function systemShowMessage(msg){
    //if(!msg) msg = '상담을 대기중입니다. 잠시만 기다려주세요 ...';
    //var inhtml = $('#chat-system-template').html();
    //var template = Handlebars.compile(inhtml);
    //var innerHtml = template({msg:msg});
    //$('#addMessage').append(innerHtml);
    //$('#chat_view').animate({scrollTop: $("#chat_view")[0].scrollHeight}, 100);
  }

  function disabledToggle(isDisabled, isAdminEnd){
    if(isDisabled){
        //$('#chatfile').attr('disabled', 'disabled');
        var msg = '';
        if(isAdminEnd) {
          msg = '상담이 종료되었습니다.';
        } else {
          msg = '상담을 요청중입니다.';
        }
        //$('#chat_system_message').html(msg);
        //$('#chat_system_message').show();
        if (currRoomAdmin == true) {
          //systemShowMessage('관리자가 퇴장하였습니다.');
          currRoomAdmin = false;
        }
    } else {
        //$('#inMessage').removeAttr('disabled');
        //$('#btnInMessage').removeAttr('disabled');
        //$('#chatfile').removeAttr('disabled');
        //$('#chat_system_message').hide();
        //$('#chat_system_message').empty();
        if (currRoomAdmin !== true) {
          //systemShowMessage('관리자가 입장하였습니다.');
          currRoomAdmin = true;
        }
    }
  }
});

function imgPopupView(_this){
  var soruce = $(_this).attr('src');
  console.log(soruce);
  var wnd = window.open("", "new window", "width=600,height=600");  
  //wnd.document.write('<img src="'+soruce+'" />');  

  wnd.onload = function () {
    console.log('wnd.onload!!!!!!!!!!!');
    wnd.document.write('<img src="'+soruce+'" />');  
  };

}
