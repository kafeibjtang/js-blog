import Editor from 'wangeditor'
import MessAge from './message'
import $ from 'jquery'

const URL = 'http://127.0.0.1:3000/upload/article'

const ERROR_MAP = {
  title: '标题不能为空',
  content: '内容不能为空',
  column: '请选择分类',
  cover: '请上传封面图'
}

export default class Edite {
  constructor(callback) {
    this.editor = null
    this.callback = callback
    this.init()
  }
  init (ele = '.editor-content') {
    this.editor = new Editor(ele)
    this.upload()
    this.create()
  }

  upload() {
    this.editor.config.uploadImgServer = URL
    this.editor.config.uploadImgMaxSize = 5 * 1024 * 1024 // 5M
    this.editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
    this.editor.config.uploadImgMaxLength = 1
    this.editor.config.uploadFileName = 'file'
    this.editor.config.uploadImgHeaders = {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
    }
    this.editor.config.menus = ['head','bold','fontSize','fontName','italic','underline','strikeThrough','indent','lineHeight','link','list','todo','justify','quote','code','splitLine','undo','redo', 'image',]
  }



  create() {
    this.linsten()
    this.editor.create()
  }

  linsten() {
    
    $('.section-write').on('click', '.oButton', (e) => {
      e.preventDefault()
      let data = {}
      let content = this.editor.txt.html()
      let $content = $(content)
      let column = $('.classify-column>.selected').data('column')
      let coverURL = $content.find('img')[0]?.src
      data.title = $('#blog-write-title').val()
      data.content = content
      data.detailed = content
      data.column = column;
      data.cover = coverURL
      data.writer = sessionStorage.getItem("uid")
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