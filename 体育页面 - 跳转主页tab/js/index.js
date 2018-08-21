var userinfo = null;
var browserVersion = 0;
var startActionReplace = "coocaa.intent.action.HOME";
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
        webShowTimes("聚体育0808跳转曝光");
        _czc.push(['_trackEvent', '曝光次数', '聚体育0808跳转曝光', '', '', '']);
        // coocaaosapi.getUserInfo(function(message) {
        //     userinfo = message;
        //     console.log("用户信息：" + JSON.stringify(userinfo));
        // }, function(error) { console.log(error); });
        // 
        coocaaosapi.getDeviceInfo(function(message) {
            deviceInfo = message;
            if (deviceInfo.version < '6') {
                coocaaosapi.getPropertiesValue("persist.service.homepage.pkg", function(data) {
                    var val = data.propertiesValue;
                    if ("com.tianci.movieplatform" == val) {
                        startActionReplace = "coocaa.intent.action.HOME.Translucent";
                    } else {
                        startActionReplace = "coocaa.intent.movie.home";
                    }
                },function(err){console.log("getPropertiesValue error")});
            }
        }, function(error) { console.log("get deviceinfo error") })

        map = new coocaakeymap($(".coocaabtn"), null, "btnFocus", function() {}, function(val) {}, function(obj) {});
        $("#deviceready").unbind('itemClick').bind("itemClick", function() {
            experienceonclick();
        });
    },
    triggleButton: function() {
        cordova.require("coocaaosapi");

    }
};


app.initialize();


function exit() {
    navigator.app.exitApp();
}

function experienceonclick(obj) {
    webBtnClickLog("点击确定", "聚体育0808跳转曝光");
    _czc.push(['_trackEvent', '点击确定', '聚体育0808跳转曝光', '', '', '']);
    var source = getUrlParam("source");
    if(source == "tencent"){
        tabid = "10836";
    }else{
        tabid = "10840";
    }
        coocaaosapi.startHomeTab(startActionReplace,tabid, function(message) {
            exit();
        }, function(error) { console.log(error); })
}

//自定义曝光
function webShowTimes(page_name) {
    coocaaosapi.notifyJSLogInfo("web_page_show_new", '{"page_name":"' + page_name + '"}', function(message) { console.log(message); }, function(error) { console.log(error); });
}

function webBtnClickLog(button_name, page_name) {
    coocaaosapi.notifyJSLogInfo("web_button_clicked", '{"button_name":"' + button_name + '","page_name":"' + page_name + '"}', function(message) { console.log(message); }, function(error) { console.log(error); });
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURI(r[2], 'utf-8');
    return null; //返回参数值
}