include('/script/cryptojs.md5.js');

function do_login() { 	
    var uname = $('#uname').val();
    var pass = $('#pass').val();

    if (uname == '') {
        alert("请填写用户名");
        $('#uname').focus();
        return;
    }

    if (pass == '') {
        alert("请填写密码");
        $('#pass').focus();
        return;
    }

    var topost = "username=" + uname + "&password=" + CryptoJS.MD5(pass) +
        "&drop=0&type=1&n=100";

    var res = post('/cgi-bin/do_login', topost);

    if (/^\d+,/.test(res)) {
        if ($('#cookie')[0].checked) {
            $.cookie('tunet', uname + '\n' + pass,
                     { expires: 365, path: '/'});
        } else {
            $.cookie('tunet', null);
        }
        var a = res.split(",");
        a[1] = uname;
        a[4] = 0;
        window.open("succeed.html?" + a.join(','), "user_login");
        if (dst) {
            setTimeout("location = dst;", wireness == 'wired' ? 1000 : 3000);	
        }
        return;
    } else if (/^password_error@\d+/.test(res)) {
        alert("密码错误或会话失效");
        document.login_form.pass.focus();
        return;
    }

    var code = {
        "username_error": function() {
            alert("用户名错误");
            $('#uname').focus();
        },
        "password_error": function() {
            alert("密码错误");
            $('#password').focus();
        },
        "user_tab_error": "认证程序未启动",
        "user_group_error": "您的计费组信息不正确",
        "non_auth_error": "您无须认证，可直接上网",
        "status_error": "用户已欠费，请尽快充值。",
        "available_error": "您的帐号已停用",
        "delete_error": "您的帐号已删除",
        "ip_exist_error": "IP已存在，请稍后再试。",
        "usernum_error": "用户数已达上限",
        "online_num_error": "该帐号的登录人数已超过限额\n" +
            "如果怀疑帐号被盗用，请联系管理员。",
        "mode_error": "系统已禁止WEB方式登录，请使用客户端",
        "time_policy_error": "当前时段不允许连接",
        "flux_error": "您的流量已超支",
        "minutes_error": "您的时长已超支",
        "ip_error": "您的 IP 地址不合法",
        "mac_error": "您的 MAC 地址不合法",
        "sync_error": "您的资料已修改，正在等待同步，请 2 分钟后再试。",
        "ip_alloc": "您不是这个地址的合法拥有者，IP 地址已经分配给其它用户。",
        "ip_invaild": "您是区内地址，无法使用。"
    }[res];

    if (typeof(code) == 'function') {
        code();
    } else if (typeof(code) == 'string') {
        alert(code);
    } else {
        alert('未知错误\n' + res);
    }
}

function refreshLabel(e, f) {
    $('.placeholder[for=' + e.id + ']').css('display', (f || e.value) ? 'none' : 'inherit');
}

function addBookmark(name) {
    var name = name || 'TUNet 网页登录';
    var url = $.url().attr('source').replace(/\?.*$/, '');
    if (window.sidebar) { 
        window.sidebar.addPanel(name, url, ""); 
    } else if (document.all) {
        window.external.AddFavorite(url, name);
    } else if (window.opera && window.print) {
        return true;
    }
}

if (!$.url().param('noforward')) {
    $.post("/cgi-bin/do_login", "action=check_online", function(data) {
        if (/^\d+,[^,]+,\d+,\d+,\d+($|\n)/.test(data)) {
            if (!$.url().param('nosucceed')) {
                location = dst || '/' + wireness + '/succeed.html?' + data;
            } else if (dst) {
                location = dst;
            }
        }
    });
}

$(document).ready(function() {
    var cookie = $.cookie('tunet');
    if (cookie) {
        var a = cookie.split('\n', 2);
        $('#uname').val(a[0]);
        $('#pass').val(a[1]);
        $('#cookie')[0].checked = true;
    }
    if ($('#msg').length) {
        $.get('/msg.txt', function(data) {
            $('#msg').text(data);
        })
    }

    $('#uname, #pass').bind('focusin focusout', function(ev) {
        refreshLabel(ev.target, ev.type == 'focusin');
    })
    refreshLabel($('#uname')[0]);
    refreshLabel($('#pass')[0]);
})

