const pool = require("../pool.js");
const express = require("express");
var router = express.Router();

//fs fileSystem 文件系统模块
//操作文件:创建/删除/移动文件
const fs = require("fs");
const multer = require("multer");
//创建multer对象指定上传文件目录
//指定上传文件目录
var upload = multer({ dest: "public/img/" });
/** ---------------------
 *
 * user_account
 *
 * ----------------------*/
//注册
router.post("/registe", (req, res) => {
  //获取用户名称
  var $uname = req.body.username;
  var $upwd = req.body.userpwd;
  if (!$uname) {
    res.send({ code: 400, msg: "用户名不能为空" });
    return;
  }
  if (!$upwd) {
    res.send({ code: 400, msg: "密码不能为空" });
    return;
  }
  var sql = "select * from user where " + "userName=?";
  pool.query(sql, [$uname], (err, result) => {
    if (err) throw err;
    if (result.length < 1) {
      var sql =
        "INSERT INTO user(userName,userPwd ,userPhoto ,userNickName,userDescribe ,userIntegral,userFans) VALUES (?,?,'http://127.0.0.1:3000/img/userimg/def.png',?,'去添加个人简介','10','0') ";
      pool.query(sql, [$uname, $upwd, $uname], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.send("1");
        } else {
          res.send({ code: 400, msg: "注册失败！" });
        }
      });
    } else {
      res.send({ code: 400, msg: "用户名已存在！" });
    }
  });
});

//用户登录
router.post("/login", (req, res) => {
  var $uname = req.body.username;
  var $upwd = req.body.userpwd;
  if (!$uname) {
    res.send({ code: 400, msg: "用户名不能为空" });
    return;
  }
  if (!$upwd) {
    res.send({ code: 400, msg: "请输入密码" });
    return;
  }
  var sql = "select * from user where " + "userName=? and userPwd=?";
  pool.query(sql, [$uname, $upwd], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send({ code: 200, data: result[0] });
    } else {
      res.send({ code: 400, msg: "用户名或密码错误" });
    }
    return;
  });
});

//获取个人信息
router.post("/getUserInfo", (req, res) => {
  //获取用户名称
  var $username = req.body.username;
  var sql = "select * from user where " + "userId=?";
  pool.query(sql, [$username], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send({ code: 200, data: result[0] });
    } else {
      res.send({ code: 400, msg: "获取资料失败" });
    }
  });
});

//修改个人信息
router.post("/addmymsg", (req, res) => {
  //获取用户名称
  var $username = req.body.username;
  var $usernc = req.body.usernc;
  var $userjj = req.body.userjj;
  var sql = "update usermsg set usernc=?,userjj=? WHERE username=?";
  pool.query(sql, [$usernc, $userjj, $username], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      var sql = "select * from usermsg where username=?";
      pool.query(sql, [$username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          res.send({ code: 200, data: result[0] });
        } else {
          res.send({ code: 400, msg: "修改失败！" });
        }
      });
    } else {
      res.send({ code: 400, msg: "修改失败！" });
    }
    return;
  });
});

/** ---------------------
 *
 * user_note
 *
 * ----------------------*/

// 获取笔记类型
router.get("/getNoteType", (req, res) => {
  var sql = "select * from noteType";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.send({ code: 200, data: result });
  });
});
// 增加个人笔记
router.post("/addnote", (req, res) => {
  //获取用户名称
  var $userId = req.body.userId;
  var $userPhoto = req.body.userPhoto;
  var $userNickName = req.body.userNickName;
  var $noteType = req.body.noteType;
  var $title = req.body.title;
  var $creatTime = req.body.creatTime;
  var $describes = req.body.describes;
  var $content = req.body.content;
  var $noteRemarks = req.body.noteRemarks;
  if (!$userNickName) {
    res.send({ code: 400, msg: "无用户信息！" });
    return;
  } else if (!$noteType) {
    res.send({ code: 400, msg: "请选择笔记类型！" });
    return;
  } else if (!$title) {
    res.send({ code: 400, msg: "请输入标题！" });
    return;
  } else if (!$describes) {
    res.send({ code: 400, msg: "请输入说明" });
    return;
  } else if (!$content) {
    res.send({ code: 400, msg: "请输入代码" });
    return;
  }
  var sql =
    "INSERT INTO noteList(userId,userPhoto,userNickName,noteType,title,creatTime,describes,content,readNum,noteState,noteRemarks) VALUES (?,?,?,?,?,?,?,?,0,0,?) ";
  pool.query(
    sql,
    [$userId, $userPhoto, $userNickName, $noteType, $title, $creatTime, $describes, $content, $noteRemarks],
    (err, result) => {
      if (err) throw err;
      if (result.affectedRows > 0) {
        res.send({ code: 200, data: result });
      } else {
        res.send({ code: 400, msg: "上传失败" });
      }
    }
  );
});

// _________________________________________________________________________________________________________________________________________________

// 获取关注数据
router.post("/myguanzhu", (req, res) => {
  //获取用户名称
  var $username = req.body.username;
  var sql = "select * from usergz where username=?";
  pool.query(sql, [$username], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send({ code: 200, data: result[0] });
    } else {
      res.send({ code: 400, msg: "获取关注列表失败！" });
    }
  });
});
// 添加关注
router.post("/addmyguanzhu", (req, res) => {
  //获取用户名称
  var $username = req.body.username;
  var $kcid = req.body.kcid;
  var sql = "INSERT INTO usergz(username,kcid) VALUES (?,?) ";
  pool.query(sql, [$username, $kcid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 200, msg: "关注成功！" });
    } else {
      res.send({ code: 400, msg: "关注失败！" });
    }
  });
});
// 获取订阅数据
router.post("/mydinyue", (req, res) => {
  //获取用户名称
  var $username = req.body.username;
  var sql = "select * from userdy where username=?";
  pool.query(sql, [$username], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send({ code: 200, data: result[0] });
    } else {
      res.send({ code: 400, msg: "获取订阅列表失败！" });
    }
  });
});
// 是否订阅
router.post("/isdinyue", (req, res) => {
  var $username = req.body.username;
  var $id = req.body.kcid;
  var sql = "select * from userdy where username=? and kcid=?";
  pool.query(sql, [$username, $id], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send("1");
    } else {
      res.send("0");
    }
  });
});
// 添加订阅
router.post("/addmydinyue", (req, res) => {
  //获取用户名称
  var $username = req.body.username;
  var $kcid = req.body.kcid;
  var $userjf = req.body.userjf;
  var sql = "INSERT INTO userdy(username,kcid) VALUES (?,?) ";
  pool.query(sql, [$username, $kcid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      // 修改积分
      var sql2 = "update usermsg set userjf=? where username=?";
      pool.query(sql2, [$userjf, $username], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.send({ code: 200, msg: "订阅成功！" });
        } else {
          res.send({ code: 400, msg: "订阅失败！" });
        }
      });
    } else {
      res.send({ code: 400, msg: "订阅失败！" });
    }
  });
});

// -------------------------------------------------------
// 添加课程
router.post("/addkclistone", upload.array("kcaudio", 1), (req, res) => {
  //获取参数
  var $kcauthor = req.body.kcauthor;
  var $kcclass = req.body.kcclass;
  var $kcname = req.body.kcname;
  var $kcjf = req.body.kcjf;
  var $kcaudio = "";
  console.log($kcjf);
  if (!$kcauthor) {
    res.send({ code: 400, msg: "作者名不能为空" });
    return;
  }
  if (!$kcclass) {
    res.send({ code: 400, msg: "请选择课程类型" });
    return;
  }
  if (!$kcname) {
    res.send({ code: 400, msg: "课程名不能为空" });
    return;
  }
  if (!$kcjf) {
    res.send({ code: 400, msg: "课程积分不能为空" });
    return;
  }
  for (var i = 0; i < 1; i++) {
    console.log(req.files);
    //获取上传文件类型 音频

    var type = req.files[i].mimetype;
    var i2 = type.indexOf("mp3");
    if (i2 == -1) {
      res.send({ code: -2, msg: "上传只能是mp3音频" });
      return;
    }
    //创建新文件名
    var src = req.files[i].originalname;
    var i3 = src.lastIndexOf(".");
    var fRand = Math.floor(Math.random() * 9999);
    var suff = src.substring(i3, src.length);
    var des = "./public/audio/" + fRand + suff;
    //将临时文件移动upload目录下
    fs.renameSync(req.files[i].path, des);
    //得到上传图片路径
    $kcaudio = "http://127.0.0.1:3000/audio/" + fRand + suff;
    console.log($kcaudio);
  }
  var sql = "INSERT INTO kclist(kcname,kcclass,kcauthor,kcaudio,kcjf,other,isshow) VALUES (?,?,?,?,?,?,'false') ";
  pool.query(sql, [$kcname, $kcclass, $kcauthor, $kcaudio, $kcjf, $kcclass], (err, result) => {
    if (err) throw err;
  });
});

// 添加课程
router.post("/addkclist", upload.array("kcimg", 1), (req, res) => {
  //获取参数
  var $kcauthor = req.body.kcauthor;
  var $kcclass = req.body.kcclass;
  var $kcname = req.body.kcname;
  var $kcjj = req.body.kcjj;
  var $kcjf = req.body.kcjf;
  var $kcgs = req.body.kcgs;
  var $kcimg = "";
  if (!$kcauthor) {
    res.send({ code: 400, msg: "作者名不能为空" });
    return;
  }
  if (!$kcclass) {
    res.send({ code: 400, msg: "请选择课程类型" });
    return;
  }
  if (!$kcname) {
    res.send({ code: 400, msg: "课程名不能为空" });
    return;
  }
  if (!$kcjj) {
    res.send({ code: 400, msg: "课程简介不能为空" });
    return;
  }
  if (!$kcjf) {
    res.send({ code: 400, msg: "积分不能为空" });
    return;
  }
  if (!$kcgs) {
    res.send({ code: 400, msg: "课程概述不能为空" });
    return;
  }
  for (var i = 0; i < 1; i++) {
    console.log(req.files);
    var size = req.files[i].size / 1000 / 1000;
    if (size > 2) {
      res.send({ code: -1, msg: "上传图片过大 超过2MB" });
      return;
    }
    //获取上传文件类型  图片
    //image/gif image/png image/jpg  text/css
    var type = req.files[i].mimetype;
    var i2 = type.indexOf("image");
    if (i2 == -1) {
      res.send({ code: -2, msg: "上传只能是图片" });
      return;
    }
    //创建新文件名
    var src = req.files[i].originalname;
    var i3 = src.lastIndexOf(".");
    var fRand = Math.floor(Math.random() * 9999);
    var suff = src.substring(i3, src.length);
    var des = "./public/img/shop/" + fRand + suff;
    //将临时文件移动upload目录下
    fs.renameSync(req.files[i].path, des);
    //得到上传图片路径
    $kcimg = "http://127.0.0.1:3000/img/shop/" + fRand + suff;
  }

  var sql = "update kclist set kcimg=?,kcjj=?,kcmb=? where kcauthor=? and kcname=? and kcclass=? and kcjf=?";
  pool.query(sql, [$kcimg, $kcjj, $kcgs, $kcauthor, $kcname, $kcclass, $kcjf], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send("上传成功,待审核");
    } else {
      res.send({ code: 400, msg: "上传失败！" });
    }
  });
});

// 添加用户头像
router.post("/adduserimg", upload.array("userimg", 1), (req, res) => {
  //获取参数
  var $username = req.body.username;
  var $userimg = "";
  for (var i = 0; i < 1; i++) {
    var size = req.files[i].size / 1000 / 1000;
    if (size > 2) {
      res.send({ code: -1, msg: "上传图片过大 超过2MB" });
      return;
    }
    //获取上传文件类型  图片
    //image/gif image/png image/jpg  text/css
    var type = req.files[i].mimetype;
    var i2 = type.indexOf("image");
    if (i2 == -1) {
      res.send({ code: -2, msg: "上传只能是图片" });
      return;
    }
    //创建新文件名
    var src = req.files[i].originalname;
    var i3 = src.lastIndexOf(".");
    var fRand = Math.floor(Math.random() * 9999);
    var suff = src.substring(i3, src.length);
    var des = "./public/img/userimg/" + fRand + suff;
    //将临时文件移动upload目录下
    fs.renameSync(req.files[i].path, des);
    //得到上传图片路径
    $userimg = "http://127.0.0.1:3000/img/userimg/" + fRand + suff;
  }
  var sql = "update usermsg set userimg=? WHERE username=?";
  pool.query(sql, [$userimg, $username], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      var sql = "select * from usermsg where username=?";
      pool.query(sql, [$username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          res.send({ code: 200, data: result[0] });
        } else {
          res.send({ code: 400, msg: "修改失败！" });
        }
      });
    } else {
      res.send({ code: 400, msg: "修改失败！" });
    }
  });
});

// 添加评论数据
router.post("/addkcpj", (req, res) => {
  //获取用户名称
  var $username = req.body.username;
  var $kcpjmsg = req.body.kcpjmsg;
  var $kcid = req.body.kcid;
  var $userimg = req.body.userimg;
  var $pjtime = req.body.pjtime;
  var sql = "INSERT INTO kcpj(username,kcpjmsg,kcid,userimg,pjtime) VALUES(?,?,?,?,?)";
  pool.query(sql, [$username, $kcpjmsg, $kcid, $userimg, $pjtime], (err, result) => {
    if (err) throw err;
    console.log(result);
    if (result.affectedRows > 0) {
      var sql = "select * from kcpj where kcid=?";
      pool.query(sql, [$kcid], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          res.send({ code: 200, data: result[0] });
        } else {
          res.send({ code: 400, msg: "添加评论列表失败！" });
        }
      });
    } else {
      res.send({ code: 400, msg: "添加评论列表失败！" });
    }
  });
});

// 获取评论数据
router.post("/kcpj", (req, res) => {
  //获取用户名称
  var $kcid = req.body.kcid;
  var sql = "select * from kcpj where kcid=?";
  pool.query(sql, [$kcid], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send({ code: 200, data: result[0] });
    } else {
      res.send({ code: 400, msg: "获取评论列表失败！" });
    }
  });
});

// 获取用户头像
router.post("/getusermsg", (req, res) => {
  //获取用户名称
  var $username = req.body.username;
  var sql = "select * from usermsg ";
  pool.query(sql, [$username], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send({ code: 200, data: result[0] });
    } else {
      res.send({ code: 400, msg: "获取资料失败！" });
    }
  });
});

//导出
module.exports = router;
