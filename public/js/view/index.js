const nickname = 'User'
const socketServer = 'https://test-mchat.cmsedu.co.kr'
let currRoomAdmin = null
let currNamesapce = null
Handlebars.registerHelper('ifCond', function(v1, v2, options){
  if(v1 == v2) {
    return options.fn(this)
  }
  return options.inverse(this)
})
$(()=>{
  sockm.init({
    fnConnect: () => {
      console.log('connect!!')
    },
    fnRoomchatAdmin: (data) => {
      const inhtml = $('#chat-rev-template').html()
      const template = Handlebars.compile(inhtml)
      const innerHtml = template({msg:data.msg, time:data.time})
      $('#addMessage').append(innerHtml)
      $('#chat_view').animate({scrollTop: $("#chat_view")[0].scrollHeight}, 100)
      console.log('roomchatAdmin : '+data)
    },
    fnRoomchat: (data) => {
      const inhtml = $('#chat-send-template').html()
      const template = Handlebars.compile(inhtml)
      const innerHtml = template({msg:data.msg, time:data.time})
      $('#addMessage').append(innerHtml)
      $('#chat_view').animate({scrollTop: $("#chat_view")[0].scrollHeight}, 100)
      console.log('roomchat : '+data)
    },
    fnDisconnect: () => {
      console.log('disconnect')
    },
    fnTargetRoomInfo: (data) => {
      const isDasable = (data && data.isAdminOnline) ? false : true
      const isAdminEnd = data.isAdminEnd
      disabledToggle(isDasable,isAdminEnd)
    },
    fnImageUser: (data) => {
      console.log("imageUser")
      const inhtml = $('#chat-send-img-template').html()
      const template = Handlebars.compile(inhtml)
      const innerHtml = template({msg:data.msg, time:data.time})
      $('#addMessage').append(innerHtml)
      $('#chat_view').animate({scrollTop: $("#chat_view")[0].scrollHeight}, 100)
    },
    fnImageAdmin: (data) => {
      console.log("imageAdmin")
      const inhtml = $('#chat-rev-img-template').html()
      const template = Handlebars.compile(inhtml)
      const innerHtml = template({msg:data.msg, time:data.time})
      $('#addMessage').append(innerHtml)
      $('#chat_view').animate({scrollTop: $("#chat_view")[0].scrollHeight}, 100)
    },
    socketServer: socketServer
  })
  const startSocket = (namespace, nickname) => {
    $('#addMessage').empty()
    sockm.leaveRoom()
    sockm.startSocket(namespace, nickname)
  }
  const sendUserMessage = (msg) => {
    if (!msg) return
    if (!currRoomAdmin){
      systemShowMessage()
      $('#inMessage').val('')
    } else {
      sockm.sendUserMessage(msg)
      $('#inMessage').val('')
    }
  }
  const sendUserImage = (event) => {
    if (!currRoomAdmin){
      systemShowMessage()
    } else {
      const image = event.target.result
      sockm.sendUserImage(image)
    }
  }

  // 소켓시작버튼
  $(".person").on('click', function(){
    $(this).toggleClass('focus').siblings().removeClass('focus')
    const namespace = $(this).attr('data-namespace')
    currNamesapce = namespace
    startSocket(namespace, nickname)
  })

  $('#btnInMessage').on('click', () => {
    const msg = $('#inMessage').val()
    sendUserMessage(msg)
  })

  $('#inMessage').on('keyup', function(key){
    if (key.keyCode == 13) {
      const msg = $(this).val()
      sendUserMessage(msg)
    }
  })
 
  // 이미지 전송 Listen to file input events
  $('#chatfile').on('change', function(event){
    //document.getElementById("chatfile").addEventListener("change", function (event) {
    //var output = document.getElementById("output");
    // Prepeare file reader
    const file = event.target.files[0]
    //var imgFile = $('#chatfile').val();
    const imgFile = $(this).val()
    const fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/
    const fileReader = new FileReader()
    if (file == null) {
      return
    }
    if (!(imgFile.toLowerCase()).match(fileForm)){
      alert("이미지 파일만 전송이 가능합니다.")
      const agent = navigator.userAgent.toLowerCase()
      if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ){
        $("#chatfile").replaceWith( $("#chatfile").clone(true) )
      } else { 
          // other browser 일때 input[type=file] init. 
          $("#chatfile").val("")
      }
      return
    }
    fileReader.onloadend = function (event) {
      // // Send an image event to the socket
      // var image = event.target.result;
      // //output.src = image;
      // console.log('socket.emit.emit("image", image);');
      // socket.emit("image", image);
      sendUserImage(event)
    }

    // Read file
    fileReader.readAsDataURL(file);
  })
  
  const systemShowMessage = (msg) => {
    //if(!msg) msg = '상담을 대기중입니다. 잠시만 기다려주세요 ...';
    //var inhtml = $('#chat-system-template').html();
    //var template = Handlebars.compile(inhtml);
    //var innerHtml = template({msg:msg});
    //$('#addMessage').append(innerHtml);
    //$('#chat_view').animate({scrollTop: $("#chat_view")[0].scrollHeight}, 100);
  }

  const disabledToggle = (isDisabled, isAdminEnd) => {
    if(isDisabled){
        //$('#chatfile').attr('disabled', 'disabled');
        let msg = ''
        if(isAdminEnd) {
          msg = '상담이 종료되었습니다.'
        } else {
          msg = '상담을 요청중입니다.'
        }
        //$('#chat_system_message').html(msg);
        //$('#chat_system_message').show();
        if (currRoomAdmin == true) {
          //systemShowMessage('관리자가 퇴장하였습니다.');
          currRoomAdmin = false
        }
    } else {
        //$('#inMessage').removeAttr('disabled');
        //$('#btnInMessage').removeAttr('disabled');
        //$('#chatfile').removeAttr('disabled');
        //$('#chat_system_message').hide();
        //$('#chat_system_message').empty();
        if (currRoomAdmin !== true) {
          //systemShowMessage('관리자가 입장하였습니다.');
          currRoomAdmin = true
        }
    }
  }
})

const imgPopupView = (_this) => {
  const source = $(_this).attr('src')
  //console.log(soruce)
  //const wnd = window.open("", "new window", "width=600,height=600")
  //wnd.document.write('<img src="'+soruce+'" />');  

  //wnd.onload = () => {
  //  console.log('wnd.onload!!!!!!!!!!!')
  //  wnd.document.write('<img src="'+soruce+'" />')
  //}
  const { remote } = require('electron');
  let child = new remote.BrowserWindow({
    width: 600,
    height: 600,
    parent: remote.getCurrentWindow(),
    webPreferences: {
      nodeIntegration: true
    },
    modal: true,
    show: false,
    autoHideMenuBar: true
  })
  child.loadFile('imagePopup.html')
  child.once('show', () => {
    child.webContents.send('child-image', source)
  })
  child.once('ready-to-show', () => {
    child.show()
  })

}
