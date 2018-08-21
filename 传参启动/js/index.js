var userinfo = null;
var app = {

    canonical_uri: function(src, base_path) {
        var root_page = /^[^?#]*\//.exec(location.href)[0],
            root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0],
            absolute_regex = /^\w+\:\/\//;
        // is `src` is protocol-relative (begins with // or ///), prepend protocol  
        if (/^\/\/\/?/.test(src)) {
            src = location.protocol + src;
        }
        // is `src` page-relative? (not an absolute URL, and not a domain-relative path, beginning with /)  
        else if (!absolute_regex.test(src) && src.charAt(0) != "/") {
            // prepend `base_path`, if any  
            src = (base_path || "") + src;
        }
        // make sure to return `src` as absolute  
        return absolute_regex.test(src) ? src : ((src.charAt(0) == "/" ? root_domain : root_page) + src);
    },

    rel_html_imgpath: function(iconurl) {
        // console.log(app.canonical_uri(iconurl.replace(/.*\/([^\/]+\/[^\/]+)$/, '$1')));
        return app.canonical_uri(iconurl.replace(/.*\/([^\/]+\/[^\/]+)$/, '$1'));
    },

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.handleBackButton, false);
    },
    handleBackButton: function() {
        exit();
    },

    onDeviceReady: function() {
        cordova.require("coocaaosapi");
        app.receivedEvent('deviceready');
        app.triggleButton();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelectorAll('.received');
        // listeningElement.setAttribute('style', 'display:none;');
        for (var i = 0, j = receivedElement.length; i < j; i++) {
            // receivedElement[i].setAttribute('style', 'display:block;');
        }
        /*receivedElement.setAttribute('style', 'display:block;');*/

        console.log('Received Event: ' + id);
        coocaaosapi.getUserInfo(function(message) {
            userinfo = message;
            console.log("用户信息："+JSON.stringify(userinfo));
            var avatar = message.avatar;
            document.getElementById("avatar").src = avatar;
            $("#userName").html(message.nick_name)
        }, function(error) { console.log(error); });

        
    },
    triggleButton: function() {
        cordova.require("coocaaosapi");

    }
};


app.initialize();


function exit() {
    navigator.app.exitApp();
}
//监听账户变化
function listenUserChange() {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    coocaaosapi.addUserChanggedListener(function(message) {
        console.log("账户状态变化sssssssssssssssssssssssssssssssssssssss")
        //刷新前的逻辑判断
        // beforeResh();
    });
}
function experienceonclick(obj) {
    coocaaosapi.removeUserChanggedListener(function(message) {});
    listenUserChange();
     coocaaosapi.startUserSettingAndFinish(function(message) { console.log(message); }, function(error) { console.log(error); });
}

function add(){
    var box = document.getElementById("addbox");
    var length = box.children.length;
    var adddiv = document.createElement("div");
    adddiv.id = "add" + (length+1)
    adddiv.innerHTML = 'key:<input type="" name="" id="key'+(1+length)+'">value:<input type="" name="" id="value'+(length+1)+'">'
    box.appendChild(adddiv)
}
function commit(){
    var pkname = document.getElementById("pkname").value;
    console.log("pkname==="+pkname)
    var version = document.getElementById("version").value;
    console.log("version==="+version)
    var activity = document.getElementById("activity").value;
    console.log("activity==="+activity)
    var action = document.getElementById("action").value;
    console.log("action==="+action)
    var param = document.getElementById("param").value;
    console.log("param==="+param)
    var box = document.getElementById("addbox");
    var length = box.children.length;
    console.log("length==="+length)
    var arrayQ = []

    for(var a=1;a<=length;a++){
        if ((document.getElementById("key"+a).value == ""&&document.getElementById("value"+a).value != "") || (document.getElementById("key"+a).value != ""&&document.getElementById("value"+a).value == "")){
            alert("请保持扩展参数成对出现")
        }else{
            if (document.getElementById("key"+a).value != ""&&document.getElementById("value"+a).value != "") {
                var str = {};
                str[document.getElementById("key"+a).value] = document.getElementById("value"+a).value;
                arrayQ.push(str);
            }
        }
    }
    console.log("str==="+JSON.stringify(arrayQ))
    coocaaosapi.startParamAction(pkname,version,activity,action,param,JSON.stringify(arrayQ),function(message) { console.log(message); }, function(error) { console.log(error); });
}