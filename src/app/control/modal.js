import Template from "./template"
import config from '../config/config'
import $ from "jquery"

export default class Modal {
    constructor({ warp = $(".blog-modal"), modalType }) {
        this.data = {}
        this.warp = warp
        this.modalType = modalType
        this.html = ''

    }
    //数据渲染
    render() {
        let data = config[this.modalType]
        this.html = Template.render("modal", data)
        this.draw()
    }

    //渲染
    draw() {
        this.clean()
        this.warp.removeAttr("hidden")
        this.warp.html(this.html).show()
        this.drawCallback && this.drawCallback(this.modalType)
    }
    //清空
    clean() {
        this.warp.html("")
    }
    //取消按钮
    close() {
        this.reset()
    }
    //确认按钮
    confirm() {
        console.log("confirm");
    }

    //重置表单
    reset() {
        this.warp.hide()
        this.warp.attr("hidden", true)
    }
}