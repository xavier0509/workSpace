var userinfo = null;
var intervalProgress = null;
var setTimeoutFunc = null;
var showprogress = 0;
var voiceVersion = null;
var openid = "";
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
        webapp.exit();
    },

    onDeviceReady: function() {
        cordova.require("coocaaosapi");
        app.receivedEvent('deviceready');
        webapp.hasLogin(webapp.getUserInfo());
        if (voiceVersion < 4000041) {
            $("#divImg").show();
            $("#bg").show();
            webapp.handlerKeyDownEvent('.coocaabtn');
        }
        webapp.bindClick();
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
        webapp.webShowTimes("语音引导页面");
        _czc.push(['_trackEvent', '曝光次数', '语音引导页面', '', '', '']);

    },
    triggleButton: function() {
        cordova.require("coocaaosapi");
    }
};
var webapp = {
    //退出页面
    exit: function() {
        clearTimeout(setTimeoutFunc);
        navigator.app.exitApp();
    },
    hasLogin: function(nextFunc) {
        coocaaosapi.hasCoocaaUserLogin(function(message){
            if (message.haslogin == "true") {
                nextFunc;
            }
        },function(error){

        })
    },
    getUserInfo: function() {
        coocaaosapi.getUserInfo(function(userinfo){
            openid = userinfo.open_id;
        },function(error){

        })
    },
    //移除监听
    removeApklisten: function() {
        coocaaosapi.removeAppTaskListener(function(message){});
    },
    //添加监听
    addApklisten: function() {
        coocaaosapi.addAppTaskListener(function(message) {
            // console.log("taskinfo " + JSON.stringify(message));
            console.log("msg.status ==" + message.status + "======url======" + message.url + "=========num=====" + showprogress);
            if (message.status == "ON_DOWNLOADING") {
                if (showprogress != message.progress) {
                    showprogress = message.progress;
                }
            } else if (message.status == "ON_COMPLETE") {
                if (showprogress != 98) {
                    showprogress = 98;
                }
                setTimeoutFunc =  setTimeout('webapp.downFail()', 120000);
            } else if (message.status == "ON_STOPPED") {
                showprogress = 0;
                webapp.downFail()
            } else if (message.status == "ON_REMOVED") {
                if (showprogress != 100) {
                    showprogress = 100;
                }
            };
            if (message.status == "ON_REMOVED" && message.url == "http://apk.sky.fs.skysrt.com/uploads/20180515/20180515183839928111.apk" && showprogress >= 100) {
                setTimeout("$('#divImg').hide();$('#bg').hide()", 1000);
                clearTimeout(setTimeoutFunc);
                webapp.resultLog("2018世界杯主活动","升级/安装语音成功",openid,"语音","");
                _czc.push(['_trackEvent', '升级/安装语音成功', '语音引导页面', '', '', '']);
                var a = '{ "pkgList": ["com.skyworth.lafite.srtnj.speechserver"] }'
                coocaaosapi.getAppInfo(a, function(message) {
                    console.log("getAppInfo====" + JSON.stringify(message));
                }, function(error) {
                    console.log("getAppInfo----error" + JSON.stringify(error))
                });
                webapp.removeApklisten();
            }

        });
    },
    //自定义曝光日志
    webShowTimes: function(page_name) {
        coocaaosapi.notifyJSLogInfo("web_page_show_new", '{"page_name":"' + page_name + '"}', function(message) { console.log(message); }, function(error) { console.log(error); });
    },
    //按钮点击事件日志
    webBtnClickLog: function(button_name, page_name) {
        coocaaosapi.notifyJSLogInfo("web_button_clicked", '{"button_name":"' + button_name + '","page_name":"' + page_name + '"}', function(message) { console.log(message); }, function(error) { console.log(error); });
    },
    //结果事件日志
    resultLog: function(activity_name, event_name,open_id,app_name,fail_reason) {
        coocaaosapi.notifyJSLogInfo("result_event", '{"activity_name":"' + activity_name + '","event_name":"' + event_name + '","open_id":"' + open_id + '","app_name":"' + app_name + '","fail_reason":"' + fail_reason + '"}', function(message) { console.log(message); }, function(error) { console.log(error); });
    },
    //按钮焦点初始化
    handlerKeyDownEvent: function(initClass) {
        console.log("焦点是=====" + initClass)
        map = new coocaakeymap($(initClass), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
    },
    //点击绑定
    bindClick: function() {
        $("#startDownLoad").unbind('itemClick').bind("itemClick", function() {
            webapp.clickbutton("点击下载安装");
        });
        $("#reDownLoad").unbind('itemClick').bind("itemClick", function() {
            webapp.clickbutton("点击重试");
        });
    },
    //点击按钮
    clickbutton: function(logName) {
        webapp.addApklisten();
        console.log("点击按钮====" + logName)
        $("#page1").hide();
        $("#page3").hide();
        $("#page2").show();
        webapp.webBtnClickLog(logName, "语音引导页面");
        _czc.push(['_trackEvent', logName, '语音引导页面', '', '', '']);
        webapp.createDownloadTask("http://apk.sky.fs.skysrt.com/uploads/20180515/20180515183839928111.apk", "D46B2B0C6C177B594B32C441A745744B", "创维语音", "com.skyworth.lafite.srtnj.speechserver", "com.skyworth.lafite.srtnj.speechserver", "http://img.sky.fs.skysrt.com/uploads/20180515/20180515183839768334.png");
    },
    //下载安装apk
    createDownloadTask: function(apkurl, md5, title, pkgname, appid, iconurl) {
        coocaaosapi.createDownloadTask(
            apkurl, md5, title, pkgname, appid, iconurl,
            function(message) {
                webapp.progress();
                interval = setInterval(webapp.progress, 10);
            },
            function(error) {
                console.log(error);
                console.log("调用失败");
            }
        )
    },
    //进度条
    progress: function() {
        if (showprogress >= 100) {
            clearInterval(intervalProgress);
        } else {
            var length = (showprogress / 100 * 395) + "px";
            $("#up").css({
                "transition": 'width 2s',
                "-webkit-transition": 'width 2s',
                "width": length
            });

        }
    },
    //下载安装失败
    downFail: function() {
        clearTimeout(setTimeoutFunc);
        webapp.resultLog("2018世界杯主活动","升级/安装语音失败",openid,"语音","");
        _czc.push(['_trackEvent', '升级/安装语音失败 ', '语音引导页面', '', '', '']);
        webapp.removeApklisten();
        $("#page1").hide();
        $("#page2").hide();
        $("#page3").show();
        webapp.handlerKeyDownEvent('.coocaabtn2');
    }
}

app.initialize();