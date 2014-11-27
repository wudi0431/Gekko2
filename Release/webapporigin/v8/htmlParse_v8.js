function htmlNode(parser, parent, tagName, plainText, plainComment) {
	this.parser = parser;
	if (tagName) {
		this._tagName = tagName;
		this._attrs = {};
		this._children = [];
	}
	if (plainText) {
		this._plainText = plainText;
	}
	if (plainComment) {
		this._plainComment = plainComment;
	}
	if (tagName || plainComment) {
		this._htmlStart = -1;
		this._htmlEnd = -1;
		this._ohtmlStart = -1;
		this._ohtmlEnd = -1;
	}
	this._parent = parent;
	if (parent) {
		parent._children.push(this);
	}
}
htmlNode.prototype.children = function () {
	return this._children || null;
};
htmlNode.prototype.parent = function () {
	return this._parent || null;
};
htmlNode.prototype.tagName = function () {
	return this._tagName || null;
};
htmlNode.prototype.find = function (tagName, attrs) {
	tagName = (tagName || '*').toLowerCase();
	if (this._type(attrs) != 'object') {
		attrs = {};
	}
	var ret = null;
	if (this._tagName) {
		for (var i = 0; i < this._children.length; i++) {
			if (this._children[i]._tagName) {
				if (tagName == '*' || this._children[i]._tagName == tagName) {
					if (this._compareAttr(this._children[i]._attrs, attrs)) {
						ret = this._children[i];
						break;
					}
				}
				ret = this._children[i].find(tagName, attrs);
				if (ret) {
					break;
				}
			}
		}
	}
	return ret;
};
htmlNode.prototype.findAll = function (tagName, attrs) {
	tagName = (tagName || '*').toLowerCase();
	if (this._type(attrs) != 'object') {
		attrs = {};
	}
	var ret = [];
	if (this._tagName) {
		for (var i = 0; i < this._children.length; i++) {
			if (this._children[i]._tagName) {
				if (tagName == '*' || this._children[i]._tagName == tagName) {
					if (this._compareAttr(this._children[i]._attrs, attrs)) {
						ret.push(this._children[i]);
					}
				}
				ret = ret.concat(this._children[i].findAll(tagName, attrs));
			}
		}
	}
	return ret;
};
htmlNode.prototype.comment = function () {
	var ret = [];
	if (this._tagName) {
		for (var i = 0; i < this._children.length; i++) {
			if (this._children[i]._plainComment) {
				ret.push(this._children[i]);
			}
			if (this._children[i]._tagName) {
				ret = ret.concat(this._children[i].comment());
			}
		}
	}
	return ret;
};
htmlNode.prototype._compareAttr = function (nodeAttrs, attrs) {
	for (var key in attrs) {
		if (attrs.hasOwnProperty(key)) {
			if (nodeAttrs.hasOwnProperty(key)) {
				switch (this._type(attrs[key])) {
				case 'string':
					if (attrs[key] != nodeAttrs[key]) {
						return false;
					}
					break;
				case 'regexp':
					if (nodeAttrs[key].test(atts[key])) {
						return false;
					}
					break;
				}
			} else {
				return false;
			}
		}
	}
	return true;
};
htmlNode.prototype._type = function (obj) {
	if (typeof obj == "undefined") return "undefined";
	if (obj === null) return "object";
	var arr = Object.prototype.toString.call(obj).match(/^\[object (.+)\]$/);
	return arr ? arr[1].toLowerCase() : '';
};
htmlNode.prototype.html = function () {
	var ret = '';
	if (this._htmlStart != -1) {
		ret = this.parser._html.substring(this._htmlStart, this._htmlEnd + 1);
	}
	return ret;
};
htmlNode.prototype.ohtml = function () {
	var ret = '';
	if (this._ohtmlStart != -1) {
		ret = this.parser._html.substring(this._ohtmlStart, this._ohtmlEnd + 1);
	}
	return ret;
};
htmlNode.prototype.text = function () {
	var ret = [];
	if (this._plainText) {
		ret.push(this._plainText);
	} else if (this._tagName) {
		for (var i = 0; i < this._children.length; i++) {
			ret.push(this._children[i].text());
		}
	}
	return ret.join(' ');
};
htmlNode.prototype.attr = function (attrKey, attrValue) {
	if (this._type(attrValue) == 'undefined') {
		var ret = null;
		if (this._attrs && this._attrs.hasOwnProperty(attrKey)) {
			ret = this._attrs[attrKey];
		}
		return ret;
	} else {
		this._attrs[attrKey] = attrValue;
		return this;
	}
};
htmlNode.prototype.remove = function () {
	if (this == this.parser.root) {
		for (var i = node._children.length; i >= 0; i--) {
			node._children[i].remove();
		}
		return;
	}
	if (this._ohtmlStart == -1 || this._ohtmlEnd == -1) {
		return;
	}
	// calc position
	var p1 = this._ohtmlStart,
		p2 = this._ohtmlEnd + 1;
	var start = this._ohtmlEnd;
	var len = this._ohtmlStart - this._ohtmlEnd - 1;
	// remove node
	var children = this._parent._children;
	for (var i = 0; i < children.length; i++) {
		if (children[i] == this) {
			children.splice(i, 1);
			break;
		}
	}
	this._parent = null;
	// fix this node postion
	this.parser.root._fixPosition(start, len);
	this._fixPosition(0, -start);
	// fix html
	this.parser._html = this.parser._html.slice(0, p1) + this.parser._html.slice(p2);
	// add flag
	this._remove = true;
	return this.parser.root;
};
htmlNode.prototype._fixPosition = function (start, len) {
	var arr = ['_htmlStart', '_htmlEnd', '_ohtmlStart', '_ohtmlEnd'];
	for (var i = 0; i < arr.length; i++) {
		if (this[arr[i]] >= start) {
			this[arr[i]] += len;
		}
	}
	if (this._tagName) {
		for (var i = 0; i < this._children.length; i++) {
			this._children[i]._fixPosition(start, len);
		}
	}
};

function htmlParse(html) {
	this._html = '';
	this._parse(html);
};
htmlParse.prototype._autoCloseTag = (function () {
	var tagArr = '!DOCTYPE,input,br,hr,area,base,img,meta,link'.split(',');
	var tagHash = {};
	for (var i = 0; i < tagArr.length; i++) {
		tagHash[tagArr[i]] = 1;
	}
	return tagHash;
})();
htmlParse.prototype._ignoreTag = (function () {
	var tagArr = 'script,textarea,pre'.split(',');
	var tagHash = {};
	for (var i = 0; i < tagArr.length; i++) {
		tagHash[tagArr[i]] = 1;
	}
	return tagHash;
})();
htmlParse.prototype._parse = function (html) {
	if (htmlNode.prototype._type(html) == 'string') {
		this._html = html || '';
	}
	var commentStart = '<!--',
		commentEnd = '-->';
	var commentStartChar = commentStart.substr(0, 1);
	var commentEndChar = commentEnd.substr(0, 1);
	var codeArr = this._html.split("");
	var curNode = this.root = new htmlNode(this, null, 'root', null, null);
	curNode._htmlStart = curNode._ohtmlStart = 0;
	curNode._htmlEnd = curNode._ohtmlEnd = this._html.length - 1;
	var s = 'text',
		isIgnore = false,
		isClose, tagName, start, attrKey, attrValue, plainText = '',
		plainComment = '',
		isQuote = '',
		isError = false;
	for (var i = 0; i < codeArr.length; i++) {
		var t = codeArr[i],
			pt = codeArr[i - 1],
			nt = codeArr[i + 1];
		var isLast = i == codeArr.length - 1;
		switch (s) {
		case 'text':
			if (!isIgnore && t == commentStartChar && codeArr.slice(i, i + commentStart.length).join('') == commentStart) {
				start = i;
				plainComment = commentStart;
				s = 'comment';
				i += commentStart.length - 1;
			} else if (isLast || !isIgnore && t == '<' && nt && !/^\s$/.test(nt) || isIgnore && t == '<' && codeArr.slice(i, i + tagName.length + 2).join('') == '</' + tagName && /^[>\/\s]$/.test(codeArr[i + tagName.length + 2])) {
				if (this._trim(plainText)) {
					new htmlNode(this, curNode, null, plainText, null);
				}
				tagName = '';
				start = i;
				s = 'tagName';
				isIgnore = false;
				if (nt == '/') {
					isClose = true;
					i++;
				} else {
					isClose = false;
				}
			} else {
				plainText += t;
			}
			break;
		case 'comment':
			if (isLast || t == commentEndChar && codeArr.slice(i, i + commentEnd.length).join('') == commentEnd) {
				s = 'text';
				var node = new htmlNode(this, curNode, null, null, plainComment + commentEnd);
				node._ohtmlStart = start;
				node._htmlStart = start + commentStart.length;
				node._htmlEnd = i - 1;
				i += commentEnd.length - 1;
				node._ohtmlEnd = i;
			} else {
				plainComment += t;
			}
			break;
		case 'tagName':
			if (/^[>\/\s]$/.test(t)) {
				if (!isClose) {
					curNode = new htmlNode(this, curNode, tagName, null, null);
					isIgnore = this._ignoreTag.hasOwnProperty(tagName);
					curNode._ohtmlStart = start;
				}
				attrKey = '';
				attrValue = '';
				s = 'attrKey';
				if (t == '>') {
					i--;
				}
			} else {
				tagName += t.toLowerCase();
			}
			break;
		case 'attrKey':
			if (t == '>') {
				if (isClose) {
					var t = curNode;
					var wfcArr = [];
					while (t) {
						if (t._tagName == tagName) {
							for (var j = 0; j < wfcArr.length; j++) {
								wfcArr[j]._htmlEnd = wfcArr[j]._ohtmlEnd = start - 1;
							}
							t._htmlEnd = start - 1;
							t._ohtmlEnd = i;
							curNode = t._parent;
							break;
						} else {
							wfcArr.push(t);
						}
						t = t._parent;
					}
				} else {
					if (this._autoCloseTag.hasOwnProperty(tagName)) {
						curNode._ohtmlEnd = i;
						curNode = curNode._parent;
					} else {
						curNode._htmlStart = i + 1;
					}
				}
				plainText = '';
				s = 'text';
			} else if (attrKey && t == '=') {
				attrValue = '';
				s = 'attrValue';
			} else if (/^[\/\s]$/.test(t)) {
				if (!isClose) {
					this._addAttr(curNode, attrKey, attrValue);
				}
			} else {
				attrKey += t;
			}
			break;
		case 'attrValue':
			if (isQuote) {
				if (t == isQuote) {
					isQuote = false;
					if (!isClose) {
						this._addAttr(curNode, attrKey, attrValue);
					}
					//update weixj start
					attrKey = '';
					attrValue = '';
					//update weixj end
					s = 'attrKey';
				} else {
					attrValue += t;
				}
			} else if (!attrValue && /^[\'\"]$/.test(t)) {
				isQuote = t;
			} else if (attrValue && /^\s$/.test(t) || t == '>') {
				if (!isClose) {
					this._addAttr(curNode, attrKey, attrValue);
				}
				attrKey = '';
				attrValue = '';
				s = 'attrKey';
				if (t == '>') {
					i--;
				}
			} else {
				if (attrValue || /^\s$/.test(t)) {
					attrValue += t;
				}
			}
			break;
		}
	}
	switch (s) {
	case 'text':
	case 'comment':
	case 'tagName':
		break;
	case 'attrKey':
	case 'attrValue':
		curNode._parent.pop();
		break;
	}
	while (curNode != this.root) {
		t._htmlEnd = t._ohtmlEnd = codeArr.length - 1;
		curNode = curNode._parent;
	}
};
htmlParse.prototype._addAttr = function (node, attrKey, attrValue) {
	if (attrKey && !node._attrs.hasOwnProperty(node)) {
		node._attrs[attrKey] = attrValue;
	}
};
htmlParse.prototype._trim = function (str) {
	return str.replace(/^\s+|\s+$/g, '');
};