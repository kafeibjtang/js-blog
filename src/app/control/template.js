import message from "../../views/message.hbs"
import modal from '../../views/modal.hbs'
import user from "../../views/user.hbs"
import articles from "../../views/articles.hbs"
import article from "../../views/article.hbs"
import write from "../../views/write.hbs"
import columns from "../../views/columns.hbs"
import index from "../../views/index.hbs"
import userInfo from "../../views/info.hbs"


const TEMP_MAP = {
  modal, user, message, articles, article, write, columns, index, userInfo
}

export default class Template {
  constructor({
    wrap = "body", name, data
  }) {
    this.wrap = $(wrap)
    this.name = name
    this.data = data
    this.init()
  }

  init() {

    this.tempHandle = TEMP_MAP[this.name]
    this.render()
  }

  render() {
    this.wrap.html(this.getHTML())

  }

  getHTML() {
    return this.tempHandle(this.data)
  }

  static render(tempName, data) {
    let html = '';

    if (tempName in TEMP_MAP) {
      html = TEMP_MAP[tempName](data)
    }

    return html
  }


}