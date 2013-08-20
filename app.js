var express = require('express');
var app = express();

var defPath = __dirname; //静态文件路径
global.etagSession = {}; //全局保存session的对象
global.etagCount = 1; //全局的etag标识


app.use(express.bodyParser()); //使用post


app.get('/login/load', function(req, res){
  	 res.sendfile(defPath+'/login_load.html');
});


app.get('/login/index', function(req, res){
  res.sendfile(defPath+'/login_index.html');
});


app.post('/login/index', function(req, res){

	var uobj={}
	uobj.username = req.body.username ||''; 
	uobj.sex = req.body.sex ||'';
	uobj.age = req.body.age ||'';
	uobj.desc = req.body.desc ||'';
	uobj.etag = req.body.etag || '';

	if(uobj.etag && uobj.username){
		global.etagSession[uobj.etag] = uobj
	}

	res.redirect('/login/index')
});


app.get('/etag_session.js', function(req, res){
	var etagStr = req.headers["if-none-match"];
	var jsonStr;


  	if(!etagStr){
  		etagStr = Date.now() + '-' + global.etagCount++;
  	}


  	res.setHeader('Cache-Control', 'max-age=0');
  	res.setHeader('ETag', etagStr);
  	res.setHeader('Content-Type', 'text/javascript');
  	res.setHeader('Transfer-Encoding', 'chunked');
    
    if(!global.etagSession[etagStr]){
    	jsonStr = {
    		etag : etagStr
    	}
    }
    else{
    	jsonStr = global.etagSession[etagStr]
    }

    jsonStr = JSON.stringify(jsonStr);

    res.end('window.uinfo = '+jsonStr);

});




app.listen(3001);
console.log('app starting listen port: 3001')