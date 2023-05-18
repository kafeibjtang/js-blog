import Template from "../control/template";
import $ from "jquery"
export default class MessAge {
    constructor(msg="未知错误") {
        this.msg = msg
        this.wrap = $(".blog-message")
    }
    success() {
        this.html("success")
    }
    info() {
        this.html("info")  
    }
    warning() {
        this.html("warning")
    }
    danger() {
        this.html("danger")
    }
    html(type) {
        this.render(  Template.render("message", { type, msg: this.msg }))
    }
    render(ele) {
        this.wrap.html(ele).addClass("animat")
        setTimeout(() => {
            this.wrap.html(ele).removeClass("animat")
        },2000)
    }
}
