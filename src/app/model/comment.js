import $ from 'jquery'
import MessAge from './message'

const ERROR_MAP = {
  content: '内容不能为空'
}

export default class Comment {
  constructor({ eleInput, eleSubmit, aid }, callback) {
    this.eleInput = eleInput
    this.eleSubmit = eleSubmit
    this.aid = aid
    this.content = ''
    this.callback = callback
    this.comment = null
    this.init()
  }

  static execute({ eleInput, eleSubmit, aid }, callback) {
    if (!this.comment) {
      this.comment = new Comment({ eleInput, eleSubmit, aid }, callback)
    }
    return this.comment
  }

  init() {
    this.linsten()
  }
  linsten() {
    $(document).on('click', this.eleSubmit, (e) => {
      e.preventDefault()
      let data = {}
      let content = $(this.eleInput).html() || $(this.eleInput).val()
      data.content = content
      data.aid = this.aid;
      Object.entries(data).some(([key, value]) => {
        let isPass = !value || value.trim().length === 0
        if (isPass) {
          new MessAge(ERROR_MAP[key]).warning()
          data = null
        }
        return isPass
      })

      this.callback(data)
    })
  }

}
