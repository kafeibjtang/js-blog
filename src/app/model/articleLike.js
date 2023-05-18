import $ from 'jquery'
export default class articleLike {
  constructor({ likeBtn, aid }, callback) {
    this.likeBtn = likeBtn
    this.aid = aid
    this.callback = callback
    this.init()
    this.like = null
  }

  static exeLike({ likeBtn, aid }, callback) {
    if (!this.like) {
      this.like = new articleLike({ likeBtn, aid }, callback)
    }
    return this.like
  }

  init() {
    this.linsten()
  }
  linsten() {
    $(document).on('click', this.likeBtn, async (e) => {
      e.preventDefault()
      this.callback(this.aid)
    })
  }

}
