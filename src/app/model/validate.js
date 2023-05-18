import util from "../util/util"
import Validator from "validator.tool"

export default class RegExpVerify {
  constructor(type) {
    this.type = type
    this.form = $(`#${type}`)

    return this.submitIntercept()
  }

  submitIntercept() {
    this.formMap = {
      login: {
        nickname: "required|is_nickname",
        email: "required|is_email",
        username: "required|is_username",
        password: "required|is_pwd"
      },
      sign: {
        username: "required|is_username",
        password: "required|is_pwd"
      },
      putUserInfo: {

      },
      postColumn: {
        name: "required",
      }
    }
    this.msgMap = {
      login: {
        nickname: "昵称必须填哦|昵称格式 除符号的任意字符 2-10位",
        username: "账号必须填哦|账号格式 数字+字母 6-8位",
        password: "密码必须填哦|密码格式 至少包含大写字母或小写字母+数字 8-12位 ",
        email: "邮箱必须填哦|请填写正确的邮箱格式 "
      },
      sign: {
        username: "账号必须填哦|账号格式 数字+字母 6-8位",
        password: "密码必须填哦|密码格式 至少包含大写字母或小写字母+数字 8-12位 "
      },
      putUserInfo: {

      },
      postColumn: {
        name: "文章类型必须填哦",
      }
    }
    return this.validatorFactory()
  }
  //验证代理
  validatorFactory() {
    let rulesObj = this.formMap[this.type]
    let msgObj = this.msgMap[this.type]
    let validateArr = this.outPutValidator(msgObj, rulesObj)
    return this.creawteRev(validateArr)
  }
  //创建校验对象
  creawteRev(validateArr) {
    let type = this.type
    return new Promise((resolve, reject) => {
      new Validator(type, validateArr, (obj, evt) => {

        if (obj.errors.length === 0) {
          let formData = util.getFormData(this.form)
          resolve(formData)
          return false;
        }

        this.errorControl(obj)
        reject(obj.errors)
      }).validate()
    })

  }


  outPutValidator(msg, rules) {
    return Object.entries(rules).map(([key, value]) => {
      return {
        'name': key,
        'display': msg[key],
        'rules': value
      }
    })
  }


  errorControl(obj) {
    obj.errors[0]["element"].focus()
    obj.errors.map(({ message, element }) => {
      $(element).parent().addClass('blog-error--input')[0].dataset['msg'] = message
    })
  }
}