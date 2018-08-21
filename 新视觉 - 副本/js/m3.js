var TVmodel = null;
var a = 0;
var key = 0 ;
var showa = 0;
var gologFlag = false;
var stopStatus = false;
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
        _czc.push(['_trackEvent', 'D20180824点击‘返回’次数', '酷开商城', TVmodel, '', '']);
        exit();
    },

    onDeviceReady: function() {
        cordova.require("coocaaosapi");
        app.receivedEvent('deviceready');
        coocaaosapi.getDeviceInfo(function(message) {
            deviceInfo = message;
            TVmodel = deviceInfo.model;
            macAddress = deviceInfo.mac;
            console.log(JSON.stringify(deviceInfo));
            _czc.push(['_trackEvent', 'D20180824弹窗出现', '酷开商城', TVmodel, '', '']);
        }, function(error) { console.log(error); });

        

        // document.getElementById("goToDown").focus();

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
        
        map = new coocaakeymap($(".coocaabtn"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
        $("#walk").unbind('itemClick').bind("itemClick", function() {
            nointeresting();
        });
        $("#goToDown").unbind('itemClick').bind("itemClick", function() {
            experienceonclick(this)
        });
    },
    triggleButton: function() {
        cordova.require("coocaaosapi");
        coocaaosapi.addAppTaskListener(function(message){
             console.log("taskinfo " + JSON.stringify(message));
             console.log("msg.status ==" + message.status  + "======url======"+message.url+"=========num====="+a);
             if(message.status == "ON_DOWNLOADING"){
                if(showa != message.progress){
                    showa = message.progress;
                    var interval =  setInterval(function(){
                        if(a <= showa){
                            a = a+1
                            $("#hasfinish").html("正在跳转中，请稍后..."+parseInt(a)+"%");
                        }else{
                            clearInterval(interval);
                        }
                    },100)
                }
            }
             else if (message.status == "ON_COMPLETE") {
                if(showa != 98){
                    showa = 98;
                    var interval =  setInterval(function(){
                        if(a <= showa){
                            a = parseInt(a);
                            a = a+1
                            $("#hasfinish").html("正在跳转中，请稍后..."+parseInt(a)+"%");
                        }else{
                            clearInterval(interval);
                        }
                    },100)
                }
                setTimeout(downFail,120000);
             }
             else if (message.status == "ON_STOPPED") {
                stopStatus = true;
                showa = 0;
                downFail()
             }
             else if (message.status == "ON_REMOVED") {
                if(showa != 100){
                    showa = 100;
                    var interval =  setInterval(function(){
                        if(a <= showa){
                            a = a+1
                            $("#hasfinish").html("正在跳转中，请稍后..."+parseInt(100)+"%");
                        }else{
                            clearInterval(interval);
                        }
                    },100)
                }
            };
             if(message.status == "ON_REMOVED" && message.url == "http://apk.sky.fs.skysrt.com/uploads/20180206/20180206103450797932.apk" && showa >= 80){
                gologFlag = true;
                $("#goToDown").trigger('itemClick');
             }

        });

        // var gotoSeeObject = document.getElementById("goToDown");
        //       gotoSeeObject.onclick = function(){
        //               experienceonclick();
        //       }
    }
};

function downFail(){
    $("#hasfinish").html("跳转失败，请稍后再试...");
    coocaaosapi.removeAppTaskListener(function(message){});
    map = new coocaakeymap($("#progress"), null, "null", function() {}, function(val) {}, function(obj) {});
    $("#progress").unbind('itemClick').bind("itemClick", function() {
        exit();
    });
}

app.initialize();

function nointeresting() {
    _czc.push(['_trackEvent', 'D20180824点击‘不感兴趣’次数', '酷开商城', TVmodel, '', '']);
    pkgButtonLog("不感兴趣","20180405");
    exit();
}

function exit() {
    navigator.app.exitApp();
}

function experienceonclick(obj) {
    if (!gologFlag) {
        _czc.push(['_trackEvent', 'D20180824点击‘去看看’次数', '酷开商城', TVmodel, '', '']);
        pkgButtonLog("去看看","20180405");
    }
    var apkName = obj.getAttribute("apkName");
    coocaaosapi.startAppShopVideo("16147", "https://ks3-cn-beijing.ksyun.com/hmsott/960101.mp4-1280x720-edfd4d41.m3u8", "华夏保险常青藤医疗组合保证计划 新版", 
    // coocaaosapi.startAppShopZone2("106",
    function(message) {
        console.log(message);
        console.log("启动成功");
        _czc.push(['_trackEvent', 'D20180824启动商城', '酷开商城', TVmodel, '', '']);
        exit();
    }, function(error) {
        console.log("启动失败");
        coocaaosapi.startOrCreateDownloadTask2(
            "http://apk.sky.fs.skysrt.com/uploads/20180206/20180206103450797932.apk", "98B59D6C52B8BFEA17D250D5D9FF3F1D", "优选购物", apkName, "26040", "http://img.sky.fs.skysrt.com//uploads/20170415/20170415110115834369.png", "coocaa.intent.action.MALL_HOME",
            function(message) {
                console.log(message);
                console.log("调用成功");
                _czc.push(['_trackEvent', 'D20180824启动下载', '酷开商城', TVmodel, '', '']);
                // exit();
                $("#goToDown").hide();
                $("#walk").hide();
                $("#progress").show();
                map = new coocaakeymap($("body"), null, "null", function() {}, function(val) {}, function(obj) {});
                var d = null;
                function progress() {
                    // var show = showa/100;
                    // $("#hasfinish").html("正在跳转中，请稍后..."+parseInt(a)+"%");
                    if (showa >= 100) {
                        clearInterval(c);
                    }
                    else if(stopStatus){
                        $("#up").css({
                            "width": '0px'
                        });
                        clearInterval(c);
                    } 
                    else {
                        var b = (showa*10) + "px";
                        $("#up").css({
                            "transition": 'width 2s',
                            "-webkit-transition": 'width 2s',
                            "width": b
                        });
                        
                    }
                }

                var c = setInterval(progress, 10);
            },
            function(error) {
                console.log(error);
                console.log("调用失败");
                exit();
            }
        )
    });
}

function pkgButtonLog(btnName,today) {
    coocaaosapi.notifyJSLogInfo("web_ccmall_button_click", '{"button_name":"' + btnName  + '","date":"' + today +'"}', function(message) { console.log(message); }, function(error) { console.log(error); });
}





function keydownOnFirst() {
    if (event.keyCode == "41") {
        console.log("-------------left-------------");
        var div1 = document.getElementById('goToDown');
        var div2 = document.getElementById('walk');
        if (div1) {
            div1.focus();
            div2.blur();
        }
    } else if (event.keyCode == "39") {
        console.log("-------------right-------------");
        var div1 = document.getElementById('goToDown');
        var div2 = document.getElementById('walk');
        if (div2) {
            div2.focus();
            div1.blur();

        }
    }
}

function focus() {
    document.getElementById("goToDown").focus();
}