/**
 * Created by Administrator on 2018/3/19/009.
 */

export default {
  'index.category': '/home/web/category/get_list',          // 获取所有领域的接口（带分页）
  'category.articles': '/home/web/category/article_list',   // 获取领域名称下新闻列表(带分页)
  'carouselById': '/home/web/carousel/get_by_group_id',     // 根据轮播图分组id获取轮播图列表\
  'carouselByName': '/home/web/carousel/get_by_group_name', // 根据轮播图分组名称获取轮播图列表\
  'index.recommend': '/home/web/index/article',              // 推荐文章列表（带分页）
  'articalDetail': '/home/web/article/detail',               // 新闻详情页
  'professor.professorList': '/home/web/user/get_expert_list',  // 专家列表
  'professor.professorInfo': '/home/web/user/get',  // 专家基本信息
  'professor.professorAtricle': '/home/web/article/get_list', // 专家的文章
  'search': '/home/web/article/search',     // 关键词搜索
  'articleListByTag': '/home/web/tag/get_article_list',  // 根据标签获取新闻列表
  'login': '/home/web/user/login',   // 用户登录
  'register': '/home/web/user/register',  // 用户注册
  'register.getAuthCodeByEmail': '/home/web/user/get_register_identifying_code_from_email',  // 注册模块：通过邮箱获取验证码
  'register.getAuthCodeByPhone': '/home/web/user/get_register_identifying_code_from_phone',  // 注册模块：通过手机号获取验证码
  'modifyPasswd': '/home/web/user/modify_passwd',   // 修改密码
  'resetPasswd': '/home/web/user/find_passwd',   // 找回密码
  'resetPasswd.getAuthCodeByEmail': '/home/web/user/get_find_passwd_identifying_code_from_email',  // 找回密码：通过邮箱获取验证码
  'resetPasswd.getAuthCodeByPhone': '/home/web/user/get_find_passwd_identifying_code_from_phone',   // 找回密码：通过手机号获取验证码
  'getUserDetailInfo': '/home/web/user/userinfo',      // 获取用户详细信息新闻列表
  'addCollections': '/home/web/article/article_collect',   // 收藏新闻
  'cancelCollections': '/home/web/article/article_cancel_collect',  // 取消收藏新闻
  'getCollections': '/home/web/article/get_collect_list',  // 获取用户收藏新闻列表
  'modifyUserInfo': '/home/web/user/modify_userinfo',    // 修改用户信息
  'modifyUserInfo.phone': '/home/web/user/modify_bind_phone',   // 修改用户绑定的手机换号
  'modifyUserInfo.email': '/home/web/user/modify_bind_email',   // 修改用户绑定的邮箱
  'modifyUserInfo.getAuthCodeByPhone': '/home/web/user/get_modify_phone_identifying_code_from_phone',
  'modifyUserInfo.getAuthCodeByEmail': '/home/web/user/get_modify_email_identifying_code_from_email',
  'feedback': '/home/web/feedback/add',    // 意见反馈
  'collect': '/home/web/article/article_collect',   // 收藏文章
  'cancelCollect': '/home/web/article/article_cancel_collect', // 取消收藏
  'thumbUp': '/home/web/article/article_thumb_up',   // 对文章点赞
  'cancelThumbUp': '/home/web/article/article_cancel_thumb_up',   // 对文章取消点赞
  'logout': '/home/web/user/logout'  // 注销登录
}
