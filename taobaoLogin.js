KISSY.add("login/capslocktips", function(a) {
	var b = function(c) {
		if (! (this instanceof b)) {
			return new b(c)
		}
		c = c || {};
		this.input = a.one(c.input);
		this.tips = a.one(c.tips);
		this._init()
	};
	a.augment(b, {
		_init: function() {
			if (!this.input || ! this.tips) {
				return
			}
			this.input.on("keypress", function(c) {
				if (!this.input.val()) {
					this.tips.hide()
				}
				if (!this._isLetter(c)) {
					return
				}
				if (this._isCapsLock(c)) {
					this.tips.show()
				} else {
					this.tips.hide()
				}
			},
			this).on("blur", function(c) {
				this.tips.hide()
			},
			this)
		},
		_isShift: function(c) {
			return c.shiftKey || (c.keyCode === 16)
		},
		_isLowerCase: function(c) {
			return c.keyCode >= 97 && c.keyCode <= 122
		},
		_isUpperCase: function(c) {
			return c.keyCode >= 65 && c.keyCode <= 90
		},
		_isLetter: function(c) {
			return this._isLowerCase(c) || this._isUpperCase(c)
		},
		_isCapsLock: function(c) {
			return (this._isShift(c) && this._isLowerCase(c)) || (!this._isShift(c) && this._isUpperCase(c))
		}
	});
	return b
});
KISSY.config({
	combine: true
});
KISSY.ready(function(a) {
	a.use("node, ua", function(f) {
		var e = f.one,
		h = f.all;
		var i = f.unparam(window.location.search.slice(1));
		var g = {
			elLoginBox: e("#J_LoginBox"),
			elStaticForm: e("#J_StaticForm"),
			elUserName: e("#TPL_username_1"),
			elPassword: e("#TPL_password_1"),
			elEditChk: e("#J_SafeLoginCheck"),
			elCheckCode: e("#J_CodeInput_i"),
			elCheckCodeImg: e("#J_StandardCode_m"),
			elCheckCodeImgHandler: e("#J_StandardCode"),
			elDynamicForm: e("#J_DynamicForm"),
			elMobile: e("#J_TPL_mobile_1"),
			elMobilePwd: e("#J_TPL_PhoneCode_1"),
			elSSOBox: e("#J_QuickLogin"),
			bMini: i && i.style ? !! i.style.match(/^(?:mini|b2b)/) : false,
			from: e("#J_From") ? e("#J_From").val() : "",
			bCBU: (f.one("#J_loginsite") ? f.one("#J_loginsite").val() : "") === "3",
			bDaily: window.location.host.indexOf("daily.taobao.net") >= 0 ? true: false,
			bHttps: window.location.protocol === "https:"
		};
		var c = window.loginConfig,
		b = window.havanaConfig || {};
		b.havanaEnable = !! b.enable;
		if (!c) {
			return
		}
		var d = window.location.hostname.split(".").slice( - 2).join(".");
		if (d.indexOf("taobao") !== - 1) {
			document.domain = d
		}
		f.use("login/page", function(j, k) {
			k.init(j.merge(c, b, g))
		})
	});
	window._submit_t_ = {};
	window._lgrt_ = a.now();
	a.use("node, event", function(b) {
		b.one(window).on("load", function() {
			window._lglt_ = b.now()
		})
	});
	window._goldlog_submit_ = function(g) {
		var f = a.unparam(window.location.search.slice(1)),
		b = f && f.style ? f.style.match(/^(?:mini|b2b)/) : "";
		b = b ? b[0] : "full";
		var m = window.goldlog,
		c = window._lgst_,
		i = window._lgrt_,
		j = window._lglt_,
		l = window._submit_t_,
		k = window._log_submitted_;
		if (!k && g && m && m.emit && c && i && j && l.t1 && l.t2 && l.loading) {
			if (Math.floor(Math.random() * 100) !== 1 && ! f.glog) {
				return
			}
			var h = l.t2 - c,
			e = i - c;
			g = g - c;
			if (h >= 600000 || g >= 600000 || e >= 600000) {
				return
			}
			window._log_submitted_ = true;
			var d = {
				t0: c,
				rt: e,
				lt: j - c,
				t1: l.t1,
				t2: h,
				t3: g,
				l: l.loading - c,
				s: b
			};
			if (l.ww) {
				d.w = l.ww - i
			}
			if (l.havana) {
				d.h = l.havana - (l.ww || i)
			}
			m.emit("tbloginact2", d)
		}
	}
});
KISSY.add("login/inputclear", function(b) {
	var a = function(c) {
		if (! (this instanceof a)) {
			return new a(c)
		}
		this.input = b.one(c.input);
		this.uid = b.now();
		this.el = null;
		this.force = !! c.force;
		this._init()
	};
	b.augment(a, {
		_init: function() {
			if (!this.input || (!this.force && this.nativeSupport())) {
				return
			}
			this.wrap = this.input.parent();
			this.input.on("valuechange", function() {
				if (this.input.val().length) {
					this.show()
				} else {
					this.hide()
				}
			},
			this);
			this.input.fire("valuechange")
		},
		_create: function() {
			var c = b.DOM.create("<span>", {
				id: "J_NickX" + this.uid,
				"class": "nickx",
				href: "javascript:void(0)"
			});
			this.wrap.append(c);
			this.el = b.one("#J_NickX" + this.uid);
			b.one(this.el).on("click", function(d) {
				d.halt();
				this.input.val("");
				this.input[0].focus();
				this.hide()
			},
			this)
		},
		nativeSupport: function() {
			return b.UA.ie && b.UA.ie >= 10
		},
		show: function() {
			if (!this.el) {
				this._create()
			}
			this.el[0].style.display = "block";
			return this
		},
		hide: function() {
			if (this.el) {
				this.el[0].style.display = "none"
			}
			return this
		}
	});
	return a
});
KISSY.add("login/message", function(a) {
	var b = function(c) {
		if (! (this instanceof b)) {
			return new b(c)
		}
		c = c || {};
		this.wrap = a.one("#J_Message");
		this.content = this.wrap.one("p");
		this._init()
	};
	a.augment(b, {
		_init: function() {
			if (!this.wrap || ! this.content) {
				return
			}
			return this
		},
		show: function(d, c) {
			this.content.html(d).attr("class", c || "error");
			this.wrap[0].style.display = "block"
		},
		hide: function() {
			this.wrap[0].style.display = "none"
		},
		reset: function() {
			this.hide();
			this.content.html("")
		}
	});
	return b
},
{
	requires: ["node"]
});
KISSY.add("login/page", function(d, f, c, g, a, e) {
	var b = {
		cfg: {
			defaultView: "static"
		},
		init: function(h) {
			this.initialize(h)
		},
		initialize: function(i) {
			if (i) {
				this.cfg = d.merge(this.cfg, i)
			}
			var h = this;
			this.message = c();
			d.each(d.all(".ph-label"), function(l) {
				g({
					label: l
				})
			});
			var j = f(h.cfg);
			if (!i.disableQuickLogin) {
				d.use("login/sso/index", function(l, m) {
					m(l.merge(h.cfg, {
						callback: function(n) {
							n = n || {};
							switch (n.stat) {
							case "ready":
								j.switchTo("sso");
								break;
							case "nouser":
							case "loginfail":
							case "loginerror":
								j.switchTo(i.defaultView);
								break;
							default:
								break
							}
							if (window._submit_t_ && window._lgst_) {
								window._submit_t_.loading = l.now()
							}
						}
					}))
				})
			} else {
				j.switchTo(i.defaultView)
			}
			var k = a(d.merge(h.cfg, {
				message: h.message
			}));
			e(d.merge(h.cfg, {
				message: h.message
			}));
			j.on("switch", function(l) {
				h.message.reset();
				if (l.module === "static") {
					k.refreshEdit()
				}
			})
		}
	};
	return b
},
{
	requires: ["login/switcher", "login/message", "login/placeholder", "login/static/index", "login/dynamic/index"]
});
KISSY.add("login/placeholder", function(a) {
	var b = function(c) {
		if (! (this instanceof b)) {
			return new b(c)
		}
		c = c || {};
		this.label = c.label ? a.one(c.label) : null;
		this.wrap = this.label ? this.label.parent() : null;
		this.input = (c.input ? a.one(c.input) : null) || (this.wrap ? this.wrap.one("input") : null);
		this._init()
	};
	a.augment(b, {
		_init: function() {
			if (!this.input || ! this.label) {
				return
			}
			this._bind();
			a.later(function() {
				this.input.fire("valuechange")
			},
			50, false, this)
		},
		_bind: function() {
			this.label.on("click", function(c) {
				this.input[0].focus()
			},
			this);
			this.input.on("blur", function(c) {
				if (this.input.val()) {
					this._hide()
				} else {
					this._show()
				}
				this._focusing = false
			},
			this).on("focus", function(c) {
				if (this.input.val()) {
					this._hide()
				} else {
					this._focus()
				}
				this._focusing = true
			},
			this).on("valuechange", function(c) {
				if (this.input.val()) {
					this._hide()
				} else {
					if (this._focusing) {
						this._focus()
					} else {
						this._show()
					}
				}
			},
			this)
		},
		_show: function() {
			this.wrap.removeClass("ph-focus").removeClass("ph-hide")
		},
		_hide: function() {
			this.wrap.removeClass("ph-focus").addClass("ph-hide")
		},
		_focus: function() {
			this.wrap.removeClass("ph-hide").addClass("ph-focus")
		}
	});
	return b
},
{
	requires: ["node"]
});
KISSY.add("login/submitbutton", function(b) {
	var a = function(c) {
		if (! (this instanceof a)) {
			return new a(c)
		}
		c = c || {};
		this.el = b.one(c.el);
		this._init()
	};
	b.augment(a, {
		_init: function() {
			if (!this.el) {
				return
			}
			this.text = this.el.text();
			return this
		},
		ing: function(c) {
			this.el.text(c);
			return this
		},
		reset: function() {
			this.el.prop("disabled", false);
			this.el.text(this.text);
			return this
		},
		t: function() {
			return this.el && this.el.attr("data-ing")
		}
	});
	return a
});
KISSY.add("login/switcher", function(d) {
	var i = d.Event,
	g = "dynamic",
	h = "sso",
	e = "static",
	c = "module-dynamic",
	f = "module-quick",
	a = "module-static";
	var b = function(j) {
		if (! (this instanceof b)) {
			return new b(j)
		}
		j = j || {};
		this.elLoginBox = j.elLoginBox;
		this.elMobile = j.elMobile;
		this.elMobilePwd = j.elMobilePwd;
		this._init()
	};
	d.augment(b, i.Target, {
		_init: function() {
			var j = this;
			d.all("#J_VisitorLink_2, #J_StaticLink, #J_Quick2Static").on("click", function(k) {
				k.halt();
				j.switchTo(e)
			});
			d.all("#J_VisitorLink_1, #J_DynamicLink").on("click", function(k) {
				k.halt();
				j.switchTo(g)
			})
		},
		switchTo: function(j) {
			this.elLoginBox.removeClass("loading");
			switch (j) {
			case e:
				this.elLoginBox.addClass(a).removeClass(f).removeClass(c);
				this.fire("switch", {
					module: e
				});
				break;
			case g:
				this.elLoginBox.addClass(c).removeClass(a).removeClass(f);
				this.elMobile.val("");
				this.elMobilePwd.val("");
				this.fire("switch", {
					module: g
				});
				break;
			case h:
				this.elLoginBox.addClass(f).removeClass(a).removeClass(c);
				this.fire("switch", {
					module: h
				});
				break;
			default:
				break
			}
		}
	});
	return b
},
{
	requires: ["node", "event"]
});
KISSY.add("login/tracknick", function(b) {
	var a = function(c) {
		if (! (this instanceof a)) {
			return new a(c)
		}
		c = c || {};
		this.cookiename = c.bCBU ? "lid": "tracknick";
		this._init()
	};
	b.augment(a, {
		_init: function() {},
		get: function() {
			var c = b.Cookie.get(this.cookiename);
			c = c ? window.unescape(c.replace(/(?:#88)$/, "").replace(/\\u/g, "%u")) : "";
			return c
		}
	});
	return a
},
{
	requires: ["cookie"]
});
KISSY.add("login/um", function(a) {
	return {
		ready: function(h) {
			if (!a.isFunction(h)) {
				return
			}
			var d = a.one("#um_to");
			var e = window.um,
			g = 1500,
			c = 200,
			f = 0;
			var b;
			if (!d) {
				h();
				return
			}
			if (e && e.getStatus) {
				b = a.later(function() {
					f += c;
					if (e.getStatus() || f >= g) {
						d.val(window.parseInt(d.val(), 10) + f);
						b.cancel();
						h()
					}
				},
				c, true)
			} else {
				h()
			}
		}
	}
});
KISSY.add("login/validator", function(d) {
	var e = d.all,
	c = d.one;
	var b = function(f) {
		if (! (this instanceof b)) {
			return new b(f)
		}
		f = f || {};
		this.message = f.message;
		this.type = d.isString(f.type) ? f.type: "";
		this.checkcode = f.checkcode;
		this.password = f.password;
		this.elUserName = f.elUserName;
		this.elMobile = f.elMobile;
		this.elMobilePwd = f.elMobilePwd;
		this._init()
	};
	var a = {
		on: function(f) {
			e(f).addClass("highlight")
		},
		off: function(f) {
			e(f).removeClass("highlight")
		}
	};
	d.augment(b, {
		_init: function() {
			if (!this.message || ! this.type) {
				return
			}
		},
		check: function() {
			var f = "";
			switch (this.type) {
			case "static":
				f = this._checkStaticForm();
				break;
			case "dynamic":
				f = this._checkDynamicForm();
				break;
			default:
				break
			}
			if (f) {
				if (this.message) {
					this.message.show(f)
				}
				return false
			}
			return true
		},
		_checkStaticForm: function() {
			var h = "";
			var i = this.elUserName ? d.trim(this.elUserName.val()) : "",
			f = this.checkcode ? d.trim(this.checkcode.val()) : "",
			g = this.password ? this.password.val() : "";
			if (this.elUserName && ! i) {
				h = "\u8d26\u6237\u540d";
				if (this.elUserName) {
					a.on(this.elUserName)
				}
			} else {
				if (this.elUserName) {
					a.off(this.elUserName)
				}
			}
			if (!g) {
				if (h) {
					h += "\u548c\u5bc6\u7801"
				} else {
					h = "\u5bc6\u7801";
					if (this.password) {
						this.password.focus()
					}
				}
				if (this.password) {
					a.on(this.password.input)
				}
			} else {
				if (this.password) {
					a.off(this.password.input)
				}
			}
			if (this.checkcode && this.checkcode.on && ! f) {
				if (!h) {
					h = "\u9a8c\u8bc1\u7801";
					this.checkcode.focus();
					a.on(this.checkcode.input)
				} else {
					a.off(this.checkcode.input)
				}
			}
			return h ? ("\u8bf7\u8f93\u5165" + h) : ""
		},
		_checkDynamicForm: function() {
			var f = "";
			if (this.elMobile && ! d.trim(this.elMobile.val())) {
				f = "\u8bf7\u8f93\u5165\u624b\u673a\u53f7\u7801";
				this.elMobile[0].focus();
				a.on(this.elMobile);
				return f
			} else {
				if (this.elMobile && ! /^\d+$/g.test(d.trim(this.elMobile.val()))) {
					f = "\u624b\u673a\u53f7\u7801\u53ea\u80fd\u4e3a\u6570\u5b57";
					this.elMobile[0].focus();
					a.on(this.elMobile);
					return f
				} else {
					if (this.elMobile) {
						a.off(this.elMobile)
					}
				}
			}
			if (this.elMobilePwd && ! d.trim(this.elMobilePwd.val())) {
				f = "\u8bf7\u8f93\u5165\u52a8\u6001\u5bc6\u7801";
				a.on(this.elMobilePwd)
			} else {
				if (this.elMobilePwd) {
					a.off(this.elMobilePwd)
				}
			}
			return f
		}
	});
	return b
});
KISSY.config({
	combine: true
});
KISSY.use("node, ua", function(d) {
	var c = d.one,
	f = d.all;
	var g = d.unparam(window.location.search.slice(1));
	var e = {
		elLoginBox: c("#J_LoginBox"),
		elStaticForm: c("#J_Form"),
		elPassword: c("#J_PwdV"),
		elCheckCode: c("#J_CodeInputV"),
		elCheckCodeImg: c("#J_CodeImageV"),
		elCheckCodeImgHandler: c("#J_CodeHandlerV"),
		bMini: g && g.style ? !! g.style.match(/^(?:mini|b2b)/) : false,
		bDaily: window.location.host.indexOf("daily.taobao.net") >= 0 ? true: false,
		bHttps: window.location.protocol === "https:"
	};
	var b = window.loginConfig,
	a = window.havanaConfig || {};
	a.havanaEnable = !! a.enable;
	if (!b) {
		return
	}
	d.use("login/message, login/placeholder, login/static/index", function(k, j, l, i) {
		var h = k.merge(b, a, e);
		k.each(k.all(".ph-label"), function(m) {
			l({
				label: m
			})
		});
		i(k.merge(h, {
			message: j(),
			verify: true
		}))
	})
});
KISSY.add("login/xlogin", function(f, b, e, d, c, h, a) {
	var g = function(i) {
		if (! (this instanceof g)) {
			return new g(i)
		}
	};
	f.augment(g, {
		_init: function() {
			if (!this.form) {
				return
			}
			this.validator = d(f.merge(this.cfg, {
				message: this.message
			}));
			this.submitbutton = c({
				el: f.one(".J_Submit", this.form)
			});
			this._bind()
		},
		_ci: function() {
			if (this.type !== "STATIC" || ! this.password) {
				return
			}
			try {
				this.form[0].elements.tid.value = this.password.ci1();
				if (f.UA.ie) {
					this.form[0].elements.poy.value = this.password.ci2()
				}
			} catch(i) {}
		},
		_bind: function() {
			var i = this;
			this.form.on("submit", function(j) {
				j.halt();
				if (window._submit_t_ && window._lgst_) {
					window._submit_t_.t1 = i.type === "STATIC" ? "static": "dynamic";
					window._submit_t_.t2 = f.now()
				}
				if (i.submitbutton) {
					i.submitbutton.ing(i.submitbutton.t() || "\u6b63\u5728\u767b\u5f55...")
				}
				e.ready(function() {
					if (i.validator.check()) {
						i._login()
					} else {
						if (i.submitbutton) {
							i.submitbutton.reset()
						}
					}
				})
			})
		},
		_updateCacheEdit: function() {
			this.cacheedit = this.cacheedit || a(this.cfg);
			this.cacheedit.update()
		},
		_login: function() {
			var i = this;
			if (this.type === "STATIC") {
				if (this.password.safeon) {
					this.password.input.val(this.password.val())
				} else {
					if (f.isFunction(window.PwdIntensity)) {
						this.form[0].elements.pstrong.value = window.PwdIntensity(this.password.val())
					}
				}
				this._ci();
				this._updateCacheEdit()
			}
			if (!this.havanaEnable) {
				this._submit();
				return
			}
			this._getToken(function(j) {
				if (!j) {
					i._submit();
					return
				}
				i.havanalogin = i.havanalogin || h(f.merge({
					success: function(k) {
						if (k.top) {
							window.top.location.href = k.url
						} else {
							window.location.href = k.url
						}
					},
					error: function() {
						i._submit()
					}
				},
				{
					url: i.cfg.vstUrl,
					applyStUrl: i.cfg.applyStUrl,
					miniLoginCheckUrl: i.cfg.miniLoginCheckUrl,
					site: i.cfg.site,
					params: i.cfg.vstParams
				}));
				i.havanalogin.login({
					token: j
				})
			})
		},
		_getToken: function(m) {
			if (!f.isFunction(m)) {
				return
			}
			try {
				var j = this.form[0].elements.newlogin,
				l = this.form[0].elements.callback;
				j && (j.value = "1");
				l && (l.value = "1")
			} catch(k) {}
			var i = this;
			f.io({
				type: "post",
				dataType: "json",
				cache: false,
				url: this.getTokenURL,
				form: this.form,
				timeout: 2,
				success: function(o) {
					if (!o) {
						i._submit();
						return
					}
					if (!o.state) {
						var n = o.data ? o.data.code: 0;
						if (!n) {
							i._submit();
							return
						}
						if (o.data.needrefresh && o.data.url) {
							window.top.location.href = o.data.url;
							return
						}
						if (i.message && o.message) {
							if (n === 5 || n === 3101 || n === 3153) {
								if (i.bCBU) {
									o.message += ' <a href="http://member.1688.com/member/rename/account_input.htm?tracelog=denglu_zhaohui" target="_blank">\u5fd8\u8bb0\u4f1a\u5458\u540d</a>\uff1f'
								} else {
									o.message += ' <a href="http://service.taobao.com/support/knowledge-1120621.htm" target="_blank">\u5fd8\u8bb0\u8d26\u6237\u540d</a>\uff1f'
								}
							}
							if (n === 3501) {
								if (i.bCBU) {
									o.message += '<a href="http://service.china.alibaba.com/kf/detail/2995045.html?tracelog=login_forgetpassword_20130502" target="_blank">\u5fd8\u8bb0\u5bc6\u7801</a>\u6216<a href="http://member.1688.com/member/rename/account_input.htm?tracelog=denglu_zhaohui" target="_blank">\u4f1a\u5458\u540d</a>\uff1f'
								} else {
									o.message += '<a href="http://110.taobao.com/account/forget_passwd.htm" target="_blank">\u5fd8\u8bb0\u5bc6\u7801</a>\u6216<a href="http://service.taobao.com/support/knowledge-1120621.htm" target="_blank">\u8d26\u6237\u540d</a>\uff1f'
								}
							}
							i.message.show(o.message || "\u51fa\u9519\u4e86\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\uff01", "error")
						}
						if (i.submitbutton) {
							i.submitbutton.reset()
						}
						if (n === 3425) {
							if (i.checkcode && i.checkcode.isShow()) {
								i.checkcode.refresh().focus()
							} else {
								if (i.checkcode) {
									i.checkcode.show().focus()
								}
							}
						} else {
							i.checkcode && i.checkcode.isShow() && i.checkcode.refresh()
						}
					} else {
						if (o.data && o.data.token) {
							m(o.data.token)
						} else {
							i._submit()
						}
					}
				},
				error: function() {
					i._submit()
				}
			})
		},
		_submit: function() {
			var i = this.form[0];
			try {
				var j = i.elements.newlogin,
				l = i.elements.callback;
				j && (j.value = "0");
				l && (l.value = "")
			} catch(k) {}
			i.submit()
		}
	});
	return g
},
{
	requires: ["event", "login/um", "login/validator", "login/submitbutton", "login/havana/havanalogin", "login/static/cacheedit"]
});
KISSY.add("login/checkcode/audiocheckcode", function(b) {
	var c = b.DOM;
	var a = function(d) {
		if (! (this instanceof a)) {
			return new a(d)
		}
		d = d || {};
		this.url = d.url || "";
		this.input = d.input && b.one(d.input);
		this.handle = d.handle && b.one(d.handle);
		this.player = null;
		this._init()
	};
	b.augment(a, {
		_init: function() {
			if (!this.url || ! this.input || ! this.handle) {
				return this
			}
			var d = this;
			this.handle.on("click", function(f) {
				f.halt();
				d.play();
				b.later(function() {
					d.input[0].focus()
				},
				10)
			})
		},
		playHTML: function() {
			var d;
			var f = navigator.userAgent.indexOf("Windows") !== - 1;
			try {
				d = ("Audio" in window && (new window.Audio()).canPlayType("audio/x-wav;")) ? function() {
					return "<audio autoplay hidden></audio>"
				}: (b.UA.ie ? function() {
					return "<bgsound></bgsound>"
				}: function() {
					return "<embed " + (f ? 'type="application/x-mplayer2"': 'type="audio/x-wav"') + ' autostart="true" hidden="true" />'
				})
			} catch(g) {
				d = b.UA.ie ? function() {
					return "<bgsound></bgsound>"
				}: function() {
					return "<embed " + (f ? 'type="application/x-mplayer2"': 'type="audio/x-wav"') + ' autostart="true" hidden="true" />'
				}
			}
			this.playHTML = d;
			return d()
		},
		play: function() {
			if (this.player) {
				this.player.parentNode.removeChild(this.player)
			}
			this.player = c.create(this.playHTML(), {
				src: this.url + "&t=" + new Date().getTime()
			});
			c.append(this.player, document.body || document.documentElement)
		}
	});
	return a
});
KISSY.add("login/checkcode/index", function(e, c, a, b) {
	var d = function(f) {
		if (! (this instanceof d)) {
			return new d(f)
		}
		f = f || {};
		this.form = f.elStaticForm;
		this.input = f.elCheckCode;
		this.img = f.elCheckCodeImg;
		this.imgHandler = f.elCheckCodeImgHandler;
		this.wrap = e.one("#l_f_code");
		this.elNeedCheckCode = this.form ? e.one(this.form[0].elements.need_check_code) : null;
		this.src = this.img ? this.img.attr("data-src") : "";
		this.bMini = f.bMini;
		this._refreshed = false;
		this._init()
	};
	e.augment(d, {
		_init: function() {
			if (!this.img || ! this.imgHandler || ! this.wrap) {
				return
			}
			var f = this;
			this.imgHandler.on("click", function(g) {
				g.halt();
				f.refresh();
				f.focus()
			});
			this.img.on("click", function() {
				f.refresh();
				f.focus()
			});
			b({
				input: this.input,
				url: "http://voicecheckcode.taobao.com/vcc/checkcode?sessionID=0",
				handle: "#J_audioHandle"
			});
			if (this.isShow()) {
				this.refresh()
			}
		},
		refresh: function() {
			this.img.attr("src", this.src + (this.src.indexOf("?") > 0 ? "&": "?") + "_r_=" + e.now());
			this._refreshed = true
		},
		show: function() {
			if (this.img.attr("src").indexOf("blank") >= 0 || (!this._refreshed && this.bMini && this.isShow())) {
				this.refresh()
			}
			this.wrap.removeClass("hidden");
			this.input.val("");
			if (this.elNeedCheckCode) {
				this.elNeedCheckCode.val("true")
			}
			this.on = true;
			return this
		},
		hide: function() {
			this.wrap.addClass("hidden");
			if (this.elNeedCheckCode) {
				this.elNeedCheckCode.val("")
			}
			this.on = false;
			return this
		},
		val: function() {
			return this.input.val()
		},
		isShow: function() {
			this.on = ! this.wrap.hasClass("hidden");
			return this.on
		},
		focus: function() {
			this.input[0].focus();
			return this
		}
	});
	return d
},
{
	requires: ["node", "event", "login/checkcode/audiocheckcode"]
});
KISSY.add("login/dynamic/index", function(a, b) {
	return function(c) {
		if (!a.isObject(c)) {
			return
		}
		b(a.merge(c, {
			form: c.elDynamicForm
		}))
	}
},
{
	requires: ["login/dynamic/login"]
});
KISSY.add("login/dynamic/login", function(c, b, a, e) {
	var d = function(f) {
		if (! (this instanceof d)) {
			return new d(f)
		}
		this.cfg = f = f || {};
		this.bCBU = this.cfg.bCBU;
		this.form = f.elDynamicForm;
		this.message = f.message;
		this.havanaEnable = f.havanaEnable;
		this.getTokenURL = f.loginUrl;
		this.type = "DYNAMIC";
		this._init()
	};
	c.augment(d, e, {
		_init: function() {
			if (!this.form) {
				return
			}
			this.validator = b(c.merge(this.cfg, {
				type: "dynamic",
				message: this.message
			}));
			this.submitbutton = a({
				el: c.one(".J_Submit", this.form)
			});
			this._bind()
		}
	});
	return d
},
{
	requires: ["login/validator", "login/submitbutton", "login/xlogin"]
});
KISSY.add("login/havana/havanalogin", function(a) {
	var b = function(c) {
		if (! (this instanceof b)) {
			return new b(c)
		}
		c = c || {};
		this.url = c.url;
		this.token = c.token;
		this.applyStUrl = c.applyStUrl;
		this.miniLoginCheckUrl = c.miniLoginCheckUrl;
		this.vstData = {
			site: c.site
		};
		if (this.token) {
			this.vstData.token = c.token
		}
		this.params = a.isArray(c.params) ? c.params: null;
		this.success = a.isFunction(c.success) ? c.success: null;
		this.error = a.isFunction(c.error) ? c.error: null;
		this._init()
	};
	a.augment(b, {
		_init: function() {
			if (!this.url || ! this.getVSTURL) {
				return
			}
		},
		login: function(c) {
			c = c || {};
			if (c.token) {
				this.token = this.vstData.token = c.token
			}
			this.success = a.isFunction(c.success) ? c.success: this.success;
			this.error = a.isFunction(c.error) ? c.error: this.error;
			if (!this.success && ! this.error) {
				return
			}
			this._getVST()
		},
		_login: function() {
			var c = this;
			a.io({
				url: this.url,
				dataType: "jsonp",
				cache: false,
				scriptCharset: "utf-8",
				timeout: 5,
				data: {
					st: this.st,
					params: this._params()
				},
				complete: function(e) {
					if (e && e.data && e.data.url) {
						window._goldlog_submit_ && window._goldlog_submit_(a.now());
						if (c.success) {
							c.success({
								url: e.data.url,
								top: !! e.data.script
							})
						}
						return
					}
					if (c.error) {
						c.error(e)
					}
				}
			})
		},
		_getVST: function() {
			var c = this;
			this.getVSTURL = this.token ? this.applyStUrl: this.miniLoginCheckUrl;
			var f = "vstCallback" + a.guid(),
			e = a.merge(this.vstData, {
				callback: f
			});
			var d = this.getVSTURL + (this.getVSTURL.indexOf("?") > 0 ? "&": "?") + a.param(e);
			window[f] = function(g) {
				if (c["CALLBACKED_" + f]) {
					return
				}
				c["CALLBACKED_" + f] = true;
				if (g && g.code === 200 && g.data && g.data.st) {
					c.st = g.data.st;
					c._login();
					return
				}
				if (c.error) {
					c.error(g)
				}
			};
			a.getScript(d, {
				charset: "utf-8",
				timeout: 1,
				success: function(g) {
					a.log(g);
					a.later(function() {
						if (!c["CALLBACKED_" + f] && c.error) {
							a.log("getscript error");
							c["CALLBACKED_" + f] = true;
							c.error(g)
						}
					},
					100)
				},
				error: function(g) {
					if (c["CALLBACKED_" + f]) {
						return
					}
					c["CALLBACKED_" + f] = true;
					if (c.error) {
						c.error(g)
					}
				}
			})
		},
		_params: function() {
			if (!this.params || ! this.params.length) {
				return ""
			}
			var c = {};
			a.each(this.params, function(g) {
				var e = a.one(g);
				if (!e) {
					return
				}
				var d = e.attr("name");
				if (!d) {
					return
				}
				var f = d === "TPL_redirect_url" ? window.encodeURIComponent(e.val()) : e.val();
				c[d] = f
			});
			return a.param(c)
		}
	});
	return b
});
KISSY.add("login/havana/havanauser", function(b) {
	var a = function(c) {
		if (! (this instanceof a)) {
			return new a(c)
		}
		c = c || {};
		this.url = c.url;
		this.success = b.isFunction(c.success) ? c.success: function() {};
		this.error = b.isFunction(c.error) ? c.error: function() {};
		this._init()
	};
	b.augment(a, {
		_init: function() {
			if (!this.url || (!this.success && ! this.error)) {
				return
			}
			this._get()
		},
		_get: function() {
			var c = this;
			b.io({
				url: this.url,
				dataType: "jsonp",
				cache: false,
				timeout: 1,
				scriptCharset: "utf-8",
				complete: function(e) {
					if (e && e.code === 200 && b.isArray(e.data) && e.data.length) {
						c.success(e.data);
						return
					}
					c.error(e)
				}
			})
		}
	});
	return a
},
{
	requires: ["ajax"]
});
KISSY.add("login/safeedit/index", function(d, c, g, a, b) {
	var e = function() {
		var h = null;
		if (window.ActiveXObject) {
			try {
				h = new window.ActiveXObject("Aliedit.EditCtrl")
			} catch(i) {
				return false
			}
		} else {
			h = navigator.plugins["Alipay security control"] || navigator.plugins["Aliedit Plug-In"] || navigator.plugins.Aliedit
		}
		return !! h
	};
	var f = function(h) {
		if (! (this instanceof f)) {
			return new f(h)
		}
		this.mode = d.isString(h.mode) ? h.mode.toUpperCase() : "";
		this.container = d.one(h.container);
		this.classid = h.classid || "clsid:488A4255-3236-44B3-8F27-FA1AECAA8844";
		this.codebase = h.codebase || "https://img.alipay.com/download/2121/aliedit.cab";
		this.width = d.isNumber(h.width) ? h.width: 250;
		this.height = d.isNumber(h.height) ? h.height: 26;
		this.uid = d.now();
		this._init()
	};
	d.augment(f, d.EventTarget, {
		_init: function() {
			if (this.mode === "PASSWORD" && ! this.container) {
				return
			}
			this.container = this.mode !== "PASSWORD" && ! this.container ? d.one("body") : this.container;
			if (this.support) {
				this.create()
			}
			if (this.mode === "PASSWORD") {
				b({
					edit: this.ctrl,
					tabindex: 2
				})
			}
		},
		ready: function(h) {
			this.timer = d.later(function() {
				this.clock = this.clock ? this.clock += 20: 0;
				try {
					if (this.clock <= 1000 && this.ctrl && ! d.isUndefined(this.ctrl.TextData)) {
						h.call(this);
						this.timer.cancel()
					} else {
						if (this.clock > 1000) {
							this.timer.cancel()
						}
					}
				} catch(i) {}
			},
			20, true, this)
		},
		support: e(),
		tabsupport: ! d.UA.chrome && ! d.UA.safari && ! d.UA.opera,
		envsupport: (function() {
			var h = d.UA,
			i = h.os;
			if (i === "macintosh") {
				if (h.firefox || h.safari || h.chrome) {
					return true
				}
			} else {
				if (i === "windows") {
					if (h.firefox || h.safari || h.chrome || h.ie || h.opera) {
						return true
					}
				}
			}
			return false
		})(),
		create: function() {
			if (!this.support) {
				return
			}
			var h = this;
			var i = ! d.UA.ie ? '<embed type="application/aliedit" id="J_SafeeditNotIE{uid}" width="{width}" height="{height}">': "",
			j = '<object id="J_Safeedit{uid}" tabindex="2" classid="{classid}" codebase="{codebase}" type="application/aliedit" width="{width}" height="{height}"><param name="cm5ts" value="0613110323" /><param name="cm5pk" value="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDS92pDVyWNT7dzG9zH0opH44z9FayCZTX5iqGUxUjPi667IkyaqrsmDPqKsJp47lJ29lzs+Qv8zjPPdmnxjFteMrfpc4ui24gL1iZnchwX87Ox/+Xrm8HFmKlhmUO9n/QgTT+Nz1RGMEN1+HijvsoAhS0TS8XjSfzRkrwvK2pJQIDAQAB" /><param name="CryptoMode" value="4" /><param name="PasswordMode" value="{mode}">' + i + "</object>";
			j = d.substitute(j, {
				uid: this.uid,
				mode: this.mode === "PASSWORD" ? 1: 0,
				width: this.mode === "PASSWORD" ? this.width: 0,
				height: this.mode === "PASSWORD" ? this.height: 0,
				classid: this.classid,
				codebase: this.codebase
			});
			this.container.append(j);
			this.ctrl = d.all("#J_SafeeditNotIE" + this.uid)[0] || d.all("#J_Safeedit" + this.uid)[0];
			if (this.ctrl) {
				this.ctrl.onkeydown = function(k) {
					if (!k) {
						k = window.event
					}
					if (k.keyCode === 13) {
						h.fire("enter_keydown")
					}
				}
			}
		},
		val: function() {
			return this.ctrl ? this.ctrl.TextData: ""
		},
		ci1: function() {
			try {
				return this.ctrl ? this.ctrl.ci1() : ""
			} catch(h) {
				return ""
			}
		},
		ci2: function() {
			return this.ctrl ? this.ctrl.ci2() : ""
		},
		ver: function() {
			return this.ctrl ? this.ctrl.alieditVersion() : ""
		}
	});
	return f
},
{
	requires: ["node", "dom", "event", "login/safeedit/safeedittab"]
});
KISSY.add("login/safeedit/pluginpop", function(d, f, l, e, a) {
	var j = a.Popup;
	var b = d.one("#J_PluginPopup");
	if (!b) {
		return
	}
	var h = b.one(".J_Close"),
	g = d.one("#J_DlEdit");
	var k = {
		mac: "http://download.alipay.com/sec/edit/wkaliedit.dmg",
		notmac: "http://download.alipay.com/sec/edit/aliedit.exe"
	};
	var i, c;
	h.on("click", function() {
		c.hide()
	});
	if (g) {
		g.attr("href", d.UA.os === "macintosh" ? k.mac: k.notmac)
	}
	c = {
		show: function(m) {
			if (!b) {
				return
			}
			if (!i) {
				b.show().appendTo("body");
				i = new j({
					srcNode: b,
					width: m ? 290: 341,
					mask: true,
					align: {
						points: ["cc", "cc"]
					}
				})
			}
			b.css({
				display: "block"
			});
			i.show()
		},
		hide: function() {
			if (i) {
				i.hide();
				b.css({
					display: "none"
				})
			}
		}
	};
	return c
},
{
	requires: ["node", "dom", "ua", "overlay"]
});
KISSY.add("login/safeedit/safeedittab", function(b) {
	var a = function(c) {
		if (! (this instanceof a)) {
			return new a(c)
		}
		c = c || {};
		this.edit = c.edit && b.one(c.edit);
		this.tabindex = Number(c.tabindex) || 0;
		this._init()
	};
	b.augment(a, {
		_init: function() {
			if (!this.edit || b.UA.ie) {
				return this
			}
			this.edit.attr("tabindex", this.tabindex);
			this.edit.parent("object").removeAttr("tabindex");
			var c = this;
			this.edit[0].addEventListener("keypress", function(f) {
				if (f.keyCode === 9) {
					var d;
					if (f.shiftKey) {
						d = c.prevSource(c.edit, c.filter)
					} else {
						d = c.nextSource(c.edit, c.filter)
					}
					if (d) {
						d[0].focus()
					}
				}
			},
			false)
		},
		nextSource: function(f, e) {
			var d = f.first();
			if (!d) {
				d = f.next()
			}
			var c = f;
			while (!d && (c = c.parent())) {
				d = c.next()
			}
			if (!d) {
				return null
			}
			if (this.filter(d)) {
				return d
			}
			return this.nextSource(d, e)
		},
		prevSource: function(f, e) {
			var d = b.one(f[0].lastChild);
			if (!d) {
				d = f.prev()
			}
			var c = f;
			while (!d && (c = c.parent())) {
				d = c.prev()
			}
			if (!d) {
				return null
			}
			if (this.filter(d)) {
				return d
			}
			return this.prevSource(d, e)
		},
		filter: function(c) {
			return c[0].nodeType === 1 && c[0].offsetHeight && c[0].offsetWidth && c.attr("tabindex") >= 0
		}
	});
	return a
});
KISSY.add("login/sso/havana", function(c, b, d) {
	var a = function(e) {
		if (! (this instanceof a)) {
			return new a(e)
		}
		this.cfg = e = e || {};
		this.success = c.isFunction(e.success) ? e.success: function() {};
		this.error = c.isFunction(e.error) ? e.error: function() {};
		this._init()
	};
	c.augment(a, {
		_init: function() {
			if (!this.cfg.url) {
				this.error();
				return
			}
			var e = this;
			b({
				url: this.cfg.url,
				success: function(f) {
					e.success(f)
				},
				error: function(f) {
					e.error(f)
				}
			});
			this.havanalogin = d({
				url: this.cfg.vstUrl,
				applyStUrl: this.cfg.applyStUrl,
				miniLoginCheckUrl: this.cfg.miniLoginCheckUrl,
				site: this.cfg.site,
				params: this.cfg.vstParams
			})
		},
		login: function(e) {
			if (!c.isObject(e) || (!e.success && ! e.error)) {
				return
			}
			this.havanalogin.login({
				success: e.success,
				error: e.error
			})
		}
	});
	return a
},
{
	requires: ["login/havana/havanauser", "login/havana/havanalogin"]
});
KISSY.add("login/sso/index", function(b, a) {
	var c = function(d) {
		if (! (this instanceof c)) {
			return new c(d)
		}
		this.cfg = d = d || {};
		this.callback = b.isFunction(d.callback) ? d.callback: function() {};
		this._init()
	};
	b.augment(c, {
		_init: function() {
			var d = this;
			var e = a(b.merge(this.cfg, {
				havanaEnable: this.cfg.enable,
				vstUrl: d.cfg.vstUrl,
				applyStUrl: d.cfg.applyStUrl,
				miniLoginCheckUrl: d.cfg.miniLoginCheckUrl,
				site: d.cfg.site,
				vstParams: d.cfg.vstParams,
				ul: this.cfg.elSSOBox ? this.cfg.elSSOBox.one(".userlist") : null,
				form: this.cfg.elSSOBox ? this.cfg.elSSOBox.one("form") : null,
				callback: this.callback
			}))
		}
	});
	return c
},
{
	requires: ["login/sso/userlist"]
});
KISSY.add("login/sso/userlist", function(b, g, e, f, h, i, c, d) {
	var a = function(j) {
		if (! (this instanceof a)) {
			return new a(j)
		}
		this.cfg = j = j || {};
		this.box = j.elSSOBox;
		this.ul = j.ul;
		this.form = j.form;
		this.bCBU = j.bCBU;
		this.bDaily = j.bDaily;
		this.bHttps = j.bHttps;
		this.havanaEnable = j.havanaEnable;
		this.callback = b.isFunction(j.callback) ? j.callback: function() {};
		this.elButton = b.one("#J_SubmitQuick");
		this._init()
	};
	b.augment(a, {
		_init: function() {
			if (!this.ul || ! this.form) {
				return
			}
			var j = this;
			this.tracknick = i(this.cfg).get();
			this.wangwang = c(this.cfg);
			this.wwUserList = this.wangwang.userlist;
			if (this.wwUserList && this.wwUserList.length) {
				if (window._submit_t_ && window._lgst_) {
					window._submit_t_.ww = b.now()
				}
				this._fireReady()
			}
			if (this.havanaEnable) {
				this.havana = d({
					url: this.cfg.havanaTopUrl,
					vstUrl: this.cfg.vstUrl,
					applyStUrl: this.cfg.applyStUrl,
					miniLoginCheckUrl: this.cfg.miniLoginCheckUrl,
					site: this.cfg.site,
					vstParams: this.cfg.vstParams,
					success: function(k) {
						if (window._submit_t_ && window._lgst_) {
							window._submit_t_.havana = b.now()
						}
						j.havanaUserList = k;
						j._fireReady();
						j._uniq();
						j._ui()
					},
					error: function() {
						if (window._submit_t_ && window._lgst_) {
							window._submit_t_.havana = b.now()
						}
						j._ui()
					}
				})
			} else {
				this._ui()
			}
		},
		_fireReady: function() {
			if (!this._readyFired) {
				this.callback({
					stat: "ready"
				});
				this._readyFired = true
			}
		},
		_ui: function() {
			this.usersize = (this.wwUserList ? this.wwUserList.length: 0) + (this.havanaUserList ? this.havanaUserList.length: 0);
			if (this.usersize > 1 && this.box) {
				this.box.removeClass("ql-single")
			}
			if (!this.usersize) {
				this.callback({
					stat: "nouser"
				});
				return
			}
			this._wwdata();
			this._havanadata();
			this._wwui();
			this._havanaui();
			this._bind()
		},
		_wwui: function() {
			if (!this.wwUserList || ! this.wwUserList.length) {
				return
			}
			var j = '<li class="item-sso-user {cls}"><input data-index="{index}" data-type="ww" id="ra-{index}" class="r-sso-user r-wwuser" name="user" value="{fullNick}" type="radio" {checked} /> <label for="ra-{index}">{nick}</label></li>';
			var k = "";
			b.each(this.wwUserList, function(l, m) {
				k = b.substitute(j, l) + k
			});
			this.ul.append(k)
		},
		_wwdata: function() {
			if (!this.wwUserList || ! this.wwUserList.length) {
				return
			}
			var j = this.wwUserList.length,
			k;
			while (j-- && (k = this.wwUserList[j])) {
				if (this.tracknick && this.tracknick === k.nick) {
					this._resetdata();
					this.userIndex = k.index;
					this._userIndex = j;
					k.cls = "current";
					k.checked = "checked";
					this.loginType = "WANGWANG"
				} else {
					if (b.isUndefined(this.userIndex) && ! j) {
						this.userIndex = k.index;
						this._userIndex = j;
						k.cls = "current";
						k.checked = "checked";
						this.loginType = "WANGWANG"
					}
				}
			}
		},
		_havanaui: function() {
			if (!this.havanaUserList || ! this.havanaUserList.length) {
				return
			}
			var j = '<li class="item-sso-user {cls}"><input data-index="{index}" data-type="ha" id="ha-{index}" class="r-sso-user r-hauser" name="user" value="{nick}" type="radio" {checked} /> <label for="ha-{index}">{nick}</label></li>';
			var k = "";
			b.each(this.havanaUserList, function(l, m) {
				k = b.substitute(j, l) + k
			});
			this.ul.append(k)
		},
		_havanadata: function() {
			var l = '<li class="item-sso-user {cls}"><input data-index="{index}" data-type="ha" id="ha-{index}" class="r-sso-user r-hauser" name="user" value="{nick}" type="radio" {checked} /> <label for="ha-{index}">{nick}</label></li>';
			if (!this.havanaUserList || ! this.havanaUserList.length) {
				return
			}
			var m = "",
			j = this.havanaUserList.length,
			k;
			while (j-- && (k = this.havanaUserList[j])) {
				k.index = k.index || j;
				if (k.email) {
					k.shortEmail = k.email.replace(/([^@]{7})(?:[^@]{3,})@([^@]+)/, "$1...@$2")
				}
				k.nick = (this.bCBU ? k.cbuLoginId: k.taobaoNick) || k.shortEmail || k.mobile;
				k.nonick = this.bCBU ? (k.cbuLoginId ? "": "") : (k.taobaoNick ? "": "\uff08\u672a\u5f00\u901a\u6dd8\u5b9d\uff09");
				if (this.tracknick && this.tracknick === k.nick) {
					this._resetdata();
					this.userIndex = k.index;
					this._userIndex = j;
					k.cls = "current";
					k.checked = "checked";
					this.loginType = "HAVANA"
				} else {
					if (b.isUndefined(this.userIndex) && ! j) {
						this.userIndex = k.index;
						this._userIndex = j;
						k.cls = "current";
						k.checked = "checked";
						this.loginType = "HAVANA"
					}
				}
			}
		},
		_resetdata: function() {
			if (b.isUndefined(this._userIndex)) {
				return
			}
			if (this.loginType === "HAVANA" && this.havanaUserList[this._userIndex]) {
				this.havanaUserList[this._userIndex].checked = "";
				this.havanaUserList[this._userIndex].cls = ""
			} else {
				if (this.loginType === "WANGWANG" && this.wwUserList[this._userIndex]) {
					this.wwUserList[this._userIndex].checked = "";
					this.wwUserList[this._userIndex].cls = ""
				}
			}
		},
		_uniq: function() {
			if (!this.wwUserList || ! this.havanaUserList) {
				return
			}
			var k = [],
			j = this;
			b.each(this.wwUserList, function(n, l) {
				var m = false;
				b.each(j.havanaUserList, function(o, p) {
					var q = o.taobaoNick || o.cbuLoginId;
					if (n.nick === q) {
						m = true
					}
				});
				if (!m) {
					k.push(n)
				}
			});
			this.wwUserList = k
		},
		_bind: function() {
			var j = this;
			f.delegate(this.ul, "click", ".r-sso-user", function(l) {
				var k = b.one(l.currentTarget);
				j.loginType = k.attr("data-type") === "ww" ? "WANGWANG": "HAVANA";
				if (j.loginType === "WANGWANG") {
					j.userIndex = window.parseInt(k.attr("data-index"))
				}
				j.ul.all("li.current").removeClass("current");
				k.parent().addClass("current")
			});
			this._login()
		},
		_login: function() {
			var j = this;
			this.form.on("submit", function(k) {
				k.halt();
				if (window._submit_t_ && window._lgst_) {
					window._submit_t_.t1 = j.loginType === "WANGWANG" ? "ww": "havana";
					window._submit_t_.t2 = b.now()
				}
				if (b.isUndefined(j.userIndex) || j.userIndex < 0) {
					return
				}
				if (!j.button && j.elButton) {
					j.button = h({
						el: j.elButton
					})
				}
				if (j.button) {
					j.button.ing("\u6b63\u5728\u767b\u5f55...")
				}
				if (j.loginType === "WANGWANG") {
					j._wwLogin()
				} else {
					j._havanaLogin()
				}
			})
		},
		_wwLogin: function() {
			var k = this,
			l, n = {};
			if (this.bCBU) {
				l = b.one("#J_TPL_redirect_url") && b.one("#J_TPL_redirect_url").val() || "http://china.alibaba.com"
			} else {
				if (this.bDaily) {
					l = "http://www.daily.taobao.net"
				} else {
					l = "http://www.taobao.com"
				}
				n = b.unparam(window.location.search.slice(1));
				if (this.bHttps) {
					n.c_isScure = true
				}
				n.quicklogin = true;
				var j = window.loginClient;
				if (j) {
					n.oslanguage = j.lang;
					n.sr = j.ratio;
					n.osVer = j.os;
					n.naviVer = j.browser
				}
				m("from");
				m("not_duplite_str");
				m("guf");
				m("wbp");
				l += "?" + b.param(n)
			}
			window._goldlog_submit_ && window._goldlog_submit_(b.now());
			this.wangwang.login(this.userIndex, l, function(o) {
				if (!o) {
					k.switchToStatic("loginerror")
				}
			});
			function m(p) {
				var o = k._getValByName(p);
				if (o && n) {
					n[p] = o
				}
			}
		},
		_havanaLogin: function() {
			var j = this;
			this.havana.login({
				success: function(k) {
					if (k.top) {
						window.top.location.href = k.url
					} else {
						window.location.href = k.url
					}
				},
				error: function() {
					j.switchToStatic("loginerror")
				}
			})
		},
		_getValByName: function(j) {
			if (!b.isString(j) || ! document.getElementsByName(j).length) {
				return
			}
			return document.getElementsByName(j)[0].value
		},
		switchToStatic: function(j) {
			this.callback({
				stat: j
			});
			if (this.button) {
				this.button.reset()
			}
		}
	});
	return a
},
{
	requires: ["dom", "node", "event", "login/submitbutton", "login/tracknick", "login/sso/wangwang/index", "login/sso/havana"]
});
KISSY.add("login/static/cacheedit", function(c, b) {
	var a = function(d) {
		if (! (this instanceof a)) {
			return new a(d)
		}
		this.cfg = d || {};
		this.elEditChk = d.elEditChk;
		this._init()
	};
	c.augment(a, {
		_init: function() {
			if (!this.elUserName || ! this.elEditChk) {
				return
			}
		},
		_get: function() {
			try {
				return c.Cookie.get("_lg_nse_")
			} catch(d) {
				this._set();
				return true
			}
		},
		check: function() {
			return !! this._get()
		},
		_set: function() {
			var d = new Date();
			d.setFullYear(d.getFullYear() + 1);
			c.Cookie.set("_lg_nse_", c.now(), d)
		},
		_unset: function() {
			c.Cookie.set("_lg_nse_", "")
		},
		update: function() {
			if (!this.elUserName || ! c.trim(this.elUserName.val()) || ! this.elEditChk) {
				return
			}
			if (this.elEditChk.prop("checked")) {
				this._unset()
			} else {
				if (c.trim(this.elUserName.val())) {
					this._set()
				}
			}
		}
	});
	return a
},
{
	requires: ["cookie"]
});
KISSY.add("login/static/guidehook", function(a) {
	return function(c) {
		var b = a.one("#J_SC_Guide");
		if (!b || ! a.isFunction(c)) {
			return
		}
		b.on("click", function(d) {
			d.halt();
			c({
				type: "click"
			})
		})
	}
},
{
	requires: ["node", "event"]
});
KISSY.add("login/static/index", function(e, f, h, d, c, b, g, a) {
	return function(i) {
		if (!e.isObject(i)) {
			return
		}
		var l = c(i),
		k = b(i),
		j = d(e.merge(i, {
			safeon: !! i.verify
		})),
		m;
		if (!i.verify) {
			m = h(e.merge(i, {
				checkcode: k,
				longlogin: l
			}))
		}
		g(e.merge(i, {
			form: i.elStaticForm,
			password: j,
			checkcode: k
		}));
		a(function() {
			if (j && j.hideEdit) {
				j.hideEdit()
			}
		});
		return {
			refreshEdit: function() {
				j.refreshEdit()
			}
		}
	}
},
{
	requires: ["ua", "login/static/username/index", "login/static/password", "login/static/longlogin", "login/checkcode/index", "login/static/login", "login/static/guidehook"]
});
KISSY.add("login/static/login", function(c, b, a, e) {
	var d = function(f) {
		if (! (this instanceof d)) {
			return new d(f)
		}
		this.cfg = f = f || {};
		this.bCBU = this.cfg.bCBU;
		this.havanaEnable = f.havanaEnable;
		this.getTokenURL = f.loginUrl;
		this.form = f.form;
		this.message = f.message;
		this.password = f.password;
		this.checkcode = f.checkcode;
		this.type = "STATIC";
		this._init()
	};
	c.augment(d, e, {
		_init: function() {
			if (!this.form) {
				return
			}
			this.validator = b(c.merge(this.cfg, {
				type: "static",
				message: this.message,
				password: this.password,
				checkcode: this.checkcode
			}));
			this.submitbutton = a({
				el: c.one(".J_Submit", this.form)
			});
			this._bind()
		}
	});
	return d
},
{
	requires: ["login/validator", "login/submitbutton", "login/xlogin"]
});
KISSY.add("login/static/longlogin", function(b, a, c) {
	var d = function(e) {
		if (! (this instanceof d)) {
			return new d(e)
		}
		e = e || {};
		this.elLoginBox = e.elLoginBox;
		this.elUserName = e.elUserName;
		this.elWrap = b.one("#J_LongLogin_c"),
		this.elChk = b.one("#J_LongLogin_1");
		this.elTip = this.elWrap ? this.elWrap.parent().one(".login-tips-content") : null;
		this.defChked = this.elChk ? this.elChk.prop("checked") : false;
		this.avialable = true;
		this._init()
	};
	b.augment(d, {
		_init: function() {
			if (!this.elWrap || ! this.elChk || ! this.elLoginBox) {
				this.avialable = false;
				return
			}
			var e = this;
			b.ready(function() {
				e.resetChk();
				e.elChk.on("click", function(f) {
					e.updateVal()
				})
			})
		},
		show: function() {
			if (!this.avialable) {
				return
			}
			this.elLoginBox.removeClass("no-longlogin");
			return this
		},
		hide: function() {
			if (!this.avialable) {
				return
			}
			this.elLoginBox.addClass("no-longlogin");
			return this
		},
		notCheck: function() {
			if (!this.avialable) {
				return
			}
			this.elChk.prop("checked", false).val(0);
			return this
		},
		resetChk: function() {
			if (!this.avialable) {
				return
			}
			var e = c.val("#llnick1"),
			f = this.elUserName ? this.elUserName: "";
			if (e !== "" && e === f) {
				this.elChk.prop("checked", true)
			} else {
				this.elChk.prop("checked", this.defChked)
			}
			this.updateVal()
		},
		updateVal: function() {
			if (!this.avialable) {
				return
			}
			if (this.elChk.prop("checked")) {
				this.elChk.val(1)
			} else {
				this.elChk.val(0)
			}
		}
	});
	return d
},
{
	requires: ["node", "dom"]
});
KISSY.add("login/static/password", function(e, c, h, f, g, b, a) {
	var d = function(i) {
		if (! (this instanceof d)) {
			return new d(i)
		}
		this.cfg = i = i || {};
		this._safeon = !! i.safeon;
		this.safeon = false;
		this.input = i.elPassword;
		this.inputContainer = e.one("#J_StandardPwd");
		this.form = i.elStaticForm;
		this.editChk = i.elEditChk;
		this.editContainer = e.one("#J_PasswordEdit");
		this.editContainer = e.one("#J_PasswordEdit");
		this.editTmpContainer = e.one("#J_PasswordEditTmp");
		this.elUserName = this.cfg.elUserName;
		this._init()
	};
	e.augment(d, {
		_init: function() {
			var i = this;
			this.safeeditTmp = g({
				container: this.editTmpContainer,
				width: 0,
				height: 0
			});
			if (!this.input || ! this.editChk) {
				return
			}
			this.editContainer.hide();
			this.safeedit = g({
				mode: "password",
				container: this.editContainer
			});
			if (!this.safeedit.envsupport) {
				this.editChk.parent().hide();
				this.editChk.prop("disabled", true);
				return
			}
			this.safeedit.on("enter_keydown", function() {
				i.form.fire("submit")
			});
			this.cacheedit = a(this.cfg);
			e.later(function() {
				if (this.safeedit && this.safeedit.support && this._safeon && ! this.cacheedit.check()) {
					this.showEdit()
				} else {
					if (this.input.val().length > 20) {
						this.input.val("")
					}
				}
			},
			50, false, this);
			this.editChk.on("click", function() {
				i._editChkClicked = true;
				var j = i.editChk.prop("checked");
				if (j) {
					i.showEdit()
				} else {
					i.hideEdit()
				}
			});
			if (this.elUserName && ! this.safeedit.tabsupport) {
				this.elUserName && this.elUserName.on("keydown", function(j) {
					if (j.keyCode === 9 && ! i._editChkClicked && i.safeon) {
						i.hideEdit();
						e.later(function() {
							i.focus()
						},
						50)
					}
				})
			}
		},
		val: function() {
			if (this.safeon) {
				return this.safeedit.val()
			} else {
				return this.input.val()
			}
		},
		focus: function() {
			if (this.safeon) {} else {
				this.input[0].focus()
			}
		},
		showEdit: function() {
			if (!this.safeedit.support) {
				b.show(this.cfg.bMini);
				this.editChk.prop("checked", false);
				return
			}
			this.inputContainer[0].style.display = "none";
			this.editContainer[0].style.display = "block";
			this.safeon = true;
			this.editChk.prop("checked", true);
			this.form[0].elements.loginType.value = 4;
			this.input.val("").attr("maxlength", 1000);
			this.cfg.elStaticForm && this.cfg.elStaticForm.attr("autocomplete", "off")
		},
		hideEdit: function() {
			this.inputContainer[0].style.display = "block";
			this.editContainer[0].style.display = "none";
			this.safeon = false;
			this.editChk.prop("checked", false);
			this.form[0].elements.loginType.value = 3;
			this.input.val("").attr("maxlength", 20);
			this.cfg.elStaticForm && this.cfg.elStaticForm.attr("autocomplete", "on")
		},
		ci1: function() {
			if (this.safeon && this.safeedit) {
				return this.safeedit.ci1()
			} else {
				if (this.safeeditTmp) {
					return this.safeeditTmp.ci1()
				}
			}
			return ""
		},
		ci2: function() {
			if (this.safeon && this.safeedit) {
				return this.safeedit.ci2()
			} else {
				if (this.safeeditTmp) {
					return this.safeeditTmp.ci2()
				}
			}
			return ""
		},
		refreshEdit: function() {
			if (this.editChk.prop("checked")) {
				this.editContainer[0].style.visibility = "hidden";
				e.later(function() {
					this.editContainer[0].style.visibility = "visible"
				},
				50, false, this)
			}
		}
	});
	return d
},
{
	requires: ["node", "dom", "ua", "login/safeedit/index", "login/safeedit/pluginpop", "login/static/cacheedit"]
});
KISSY.add("login/sso/wangwang/cbuwangwang", function(b) {
	var a = (function() {
		if (!window.ActiveXObject) {
			return false
		}
		var g;
		try {
			if ((g = window.external) && typeof g.msActiveXFilteringEnabled != "undefined" && g.msActiveXFilteringEnabled()) {
				return false
			}
		} catch(f) {}
		return true
	})(),
	c = function() {
		var f;
		if (a) {
			try {
				f = new ActiveXObject("AliIMSSOLoginM.SSOLoginCtrl.1")
			} catch(g) {}
		}
		return !! f
	},
	d = function() {
		if (! (this instanceof d)) {
			return new d()
		}
		this.support = c();
		this.ctrl = null;
		this.userNum = 0;
		this.uid = b.now();
		this._init()
	};
	b.augment(d, {
		_init: function() {
			if (!this.support) {
				return
			}
			this._create();
			try {
				if (this.ctrl && this.ctrl.CreateSSOData && this.ctrl.InitSSOLoginCtrl) {
					this.ctrl.InitSSOLoginCtrl(this.ctrl.CreateSSOData(), 0)
				}
			} catch(f) {}
			this._getUserList();
			return this
		},
		_create: function() {
			if (a) {
				this.ctrl = new ActiveXObject("AliIMSSOLoginM.SSOLoginCtrl.1")
			} else {
				this.ctrl = b.DOM.create("<object>", {
					id: "J_CBUWangWangPlugin" + this.uid,
					type: "application/npAliSSOLogin",
					width: 0,
					height: 0
				});
				this.ctrlWrap = b.one(b.DOM.create("<div>", {
					style: "width:0;height:0;overflow:hidden;"
				}));
				this.ctrlWrap.append(this.ctrl);
				b.one("body").append(this.ctrlWrap)
			}
			try {
				this.WWVersion = this.ctrl.GetWWClientVersion();
				this.ctrlVersion = this.ctrl.GetSSOLoginCtrlVersion()
			} catch(f) {}
		},
		_getUserList: function() {
			this.oUserList = null;
			this.userlist = [];
			var f = this.userNum = 0,
			g;
			try {
				this.oUserList = this.ctrl.GetUserList(2, 0);
				if (this.oUserList === null) {
					return
				}
				this.userNum = this.oUserList.GetSize();
				while (f < this.userNum && (g = this.oUserList.GetItemData(f))) {
					this.userlist.push({
						index: f,
						nick: g.GetDataStr("strKey_ShortUserID"),
						fullNick: g.GetDataStr("strKey_FullUserID"),
						site: g.GetDataStr("strKey_SiteID"),
						siteDesc: g.GetDataStr("strKey_SiteID_Description")
					});
					f++
				}
			} catch(h) {}
			return this.userlist
		},
		login: function(k, f, n) {
			if (!b.isNumber(k) || ! f || k < 0 || k > this.userNum) {
				if (b.isFunction(n)) {
					n(false)
				}
				return
			}
			var n = b.isFunction(n) ? n: function() {};
			var m, g, i, h = {};
			h.url = f;
			try {
				i = this.oUserList.GetItemData(k);
				m = this.ctrl.BeginSSOLogin(0, i);
				g = m ? m.GetDataStr("strKey_GOResult") : null;
				if (g === "1") {
					var f = m.GetDataStr("strKey_ResultURL");
					if (!f) {
						n(false)
					}
					var j = b.now();
					window["jsonpCallback" + j] = function(e) {
						if (e && e.success && e.url) {
							n(true);
							window.location.assign(e.url)
						} else {
							n(false)
						}
					};
					h.callback = "jsonpCallback" + j;
					if (f.indexOf("?") > 0) {
						f += "&" + b.param(h)
					} else {
						f += "?" + b.param(h)
					}
					b.getScript(f, {
						success: function() {},
						error: function() {
							n(false)
						}
					})
				} else {
					n(false)
				}
			} catch(l) {
				b.log(l.message);
				m = false;
				n(m)
			}
			return !! m
		}
	});
	return d
});
KISSY.add("login/sso/wangwang/index", function(a, d, b) {
	var c = function(e) {
		if (! (this instanceof c)) {
			return new c(e)
		}
		e = e || {};
		this.bCBU = e.bCBU;
		this.type = this.bCBU ? 2: 1;
		this._init()
	};
	a.augment(c, {
		_init: function() {
			this.ww = d({
				bCBU: !! this.bCBU,
				type: this.type,
				host: !! this.bCBU ? "http://china.alibaba.com": "http://www.taobao.com"
			});
			if ((!this.ww.support || ! this.ww.userlist) && this.bCBU) {
				this.ww = b()
			}
			this._getUserList()
		},
		_getUserList: function() {
			if (this.ww.support) {
				this.userlist = this.ww.userlist
			}
		},
		login: function(f, e, g) {
			if (this.ww.support && this.ww.userlist) {
				this.ww.login(f, e, g)
			}
		}
	});
	return c
},
{
	requires: ["login/sso/wangwang/wangwang", "login/sso/wangwang/cbuwangwang"]
});
KISSY.add("login/sso/wangwang/wangwang", function(b) {
	var a = (function() {
		if (!window.ActiveXObject) {
			return false
		}
		var g;
		try {
			if ((g = window.external) && typeof g.msActiveXFilteringEnabled !== "undefined" && g.msActiveXFilteringEnabled()) {
				return false
			}
		} catch(f) {}
		return true
	})(),
	c = function() {
		var f;
		if (a) {
			try {
				f = new window.ActiveXObject("AliIMSSOLogin.SSOLoginCtrl.1")
			} catch(g) {}
		} else {
			f = window.navigator.plugins["AliSSOLogin plugin"]
		}
		return !! f
	},
	d = function(e) {
		if (! (this instanceof d)) {
			return new d(e)
		}
		e = e || {};
		this.type = b.isNumber(e.type) && e.type >= 0 && e.type <= 2 ? e.type: 0;
		this.bCBU = !! e.bCBU;
		this.sub = !! e.sub ? 1: 0;
		this.support = c();
		this.ctrlType = "AliIMSSOLogin";
		this.ctrl = null;
		this.userNum = 0;
		this.uid = b.now();
		this._init()
	};
	b.augment(d, {
		_init: function() {
			if (!this.support) {
				return
			}
			this._create();
			try {
				if (this.ctrl && this.ctrl.CreateSSOData && this.ctrl.InitSSOLoginCtrl) {
					this.ctrl.InitSSOLoginCtrl(this.ctrl.CreateSSOData(), 0)
				}
			} catch(f) {}
			this._getUserList();
			return this
		},
		_create: function() {
			if (a) {
				this.ctrl = new ActiveXObject("AliIMSSOLogin.SSOLoginCtrl.1")
			} else {
				this.ctrl = b.DOM.create("<object>", {
					id: "J_WangWangPlugin" + this.uid,
					type: "application/npAliSSOLogin",
					width: 0,
					height: 0
				});
				this.ctrlWrap = b.one(b.DOM.create("<div>", {
					style: "width:0;height:0;overflow:hidden;"
				}));
				this.ctrlWrap.append(this.ctrl);
				b.one("body").append(this.ctrlWrap)
			}
			try {
				this.WWVersion = this.ctrl.GetWWClientVersion();
				this.ctrlVersion = this.ctrl.GetSSOLoginCtrlVersion()
			} catch(f) {}
		},
		_getUserList: function() {
			this.oUserList = null;
			this.userlist = [];
			var f = this.userNum = 0,
			g;
			try {
				this.oUserList = this.ctrl.GetUserList(this.type, this.sub);
				if (this.oUserList === null) {
					return
				}
				this.userNum = this.oUserList.GetSize();
				while (f < this.userNum && (g = this.oUserList.GetItemData(f))) {
					this.userlist.push({
						index: f,
						nick: g.GetDataStr("strKey_ShortUserID"),
						fullNick: g.GetDataStr("strKey_FullUserID"),
						site: g.GetDataStr("strKey_SiteID"),
						siteDesc: g.GetDataStr("strKey_SiteID_Description")
					});
					f++
				}
			} catch(h) {}
			return this.userlist
		},
		login: function(h, g, l) {
			if (!b.isNumber(h) || ! g || h < 0 || h > this.userNum - 1) {
				if (b.isFunction(l)) {
					l(false)
				}
				return
			}
			var f, k, i;
			try {
				i = this.oUserList.GetItemData(h);
				i.SetDataStr("strKey_SrcURL", g);
				f = this.ctrl.Go(0, i);
				this.retData = f ? f.GetDataStr("strKey_GOResult") : null
			} catch(j) {
				b.log(j.message);
				f = false
			}
			if (b.isFunction(l)) {
				l( !! f)
			}
			return !! f
		}
	});
	return d
});
KISSY.add("login/static/username/index", function(e, d, c, b, a) {
	var f = function(g) {
		if (! (this instanceof f)) {
			return new f(g)
		}
		g = g || {};
		this.input = g.elUserName;
		this.checkURL = g.checkURL;
		this.usePhoneTips = !! g.usePhoneTips;
		this.bCBU = g.bCBU;
		this.url = g.checkUserNameURL;
		this.checkcode = g.checkcode;
		this.longlogin = g.longlogin;
		this.CACHE = {};
		this._init()
	};
	e.augment(f, {
		_init: function() {
			if (!this.input) {
				return
			}
			var h = c({
				bCBU: this.bCBU
			}).get();
			if (h && ! this.input.val()) {
				this.input.val(h)
			}
			b({
				input: this.input
			});
			if (this.bCBU) {
				return
			}
			if (this.usePhoneTips) {
				this.phonetips = a({
					wrap: this.input.parent()
				}).on("click", function(i) {
					this.phonetips.hide()
				},
				this)
			}
			var g = this;
			e.later(function() {
				g._check()
			},
			300, false);
			this.input.on("blur", function() {
				g._check();
				if (g.usePhoneTips && ! g.phonetips.onover) {
					g.phonetips.hide()
				}
			}).on("keyup focus", function() {
				if (!g.usePhoneTips) {
					return
				}
				if (/^\d+$/.test(g.input.val()) || g.input.val().length >= 2) {
					g.phonetips.hide()
				} else {
					g.phonetips.show()
				}
			})
		},
		_checkLongLogin: function(g) {
			if (!this.longlogin || ! this.longlogin.avialable || this.from === "etao") {
				return
			}
			if (!g) {
				this.longlogin.hide().notCheck()
			} else {
				this.longlogin.show()
			}
		},
		_checkCode: function(g) {
			if (!this.checkcode) {
				return
			}
			if (g) {
				if (this.checkcode.isShow()) {
					this.checkcode.refresh()
				} else {
					this.checkcode.show()
				}
			} else {
				this.checkcode.hide()
			}
		},
		_check: function() {
			var h = window.encodeURIComponent(e.trim(this.input.val()));
			if (!h) {
				if (this.longlogin && this.longlogin.avialable && this.from !== "etao") {
					this.longlogin.hide().notCheck()
				}
				return
			}
			if (this.CACHE.hasOwnProperty(h) && ! e.isUndefined(this.CACHE[h].needcode)) {
				this._checkCode(this.CACHE[h].needcode);
				this._checkLongLogin(this.CACHE[h].tag);
				return
			}
			if (this._checking) {
				return
			}
			this._checking = true;
			var g = this;
			e.io({
				type: "get",
				url: this.url + "&username=" + h,
				cache: false,
				dataType: "json",
				success: function(i) {
					g.CACHE[h] = i;
					g._checkCode(i.needcode);
					g._checkLongLogin(i.tag);
					g._checking = false
				},
				error: function() {
					g._checking = false
				}
			})
		}
	});
	return f
},
{
	requires: ["ajax", "login/tracknick", "login/inputclear", "login/static/username/phonetips"]
});
KISSY.add("login/static/username/phonetips", function(b) {
	var a = function(c) {
		if (! (this instanceof a)) {
			return new a(c)
		}
		c = c || {};
		this.wrap = c.wrap ? b.one(c.wrap) : null;
		this.el = null;
		this.onover = false;
		this._init()
	};
	b.augment(a, b.EventTarget, {
		_init: function() {
			if (!this.wrap) {
				return
			}
		},
		_create: function() {
			this.wrap.append('<div class="phone-tips" id="J_PhoneTips"><i></i>\u624b\u673a\u53f7\u7801\u4e5f\u53ef\u4f5c\u4e3a\u8d26\u6237\u540d\u54e6<a href="http://service.taobao.com/support/knowledge-1119899.htm?dkey=catview" target="_blank">?</a></div>');
			this.el = b.one("#J_PhoneTips");
			this.el.on("mouseover", function() {
				this.onover = true
			},
			this).on("mouseout", function() {
				this.onover = false
			},
			this).on("click", function() {
				this.fire("click")
			},
			this)
		},
		show: function() {
			if (!this.el) {
				this._create()
			}
			this.el.show().addClass("show")
		},
		hide: function() {
			if (!this.el) {
				return
			}
			this.el.hide().removeClass("show")
		}
	});
	return a
},
{
	requires: ["event"]
});

