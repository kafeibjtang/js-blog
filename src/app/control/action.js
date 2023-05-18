import Modal from "./modal"
import Validate from "../model/validate"
import Http from "../model/http"
import Route from "./router"
import $ from "jquery"
import MessAge from "../model/message"
const Res_Handle = {
    sign() {
        this.index()
    },
    login() {
        this.index()
    },
    index() {
        Route.go('/user', { routeName: 'user' })
    },
    postColumn() {
        this.index()
        Route.go('/columns', { routeName: 'columns' })
    },
    putUserInfo() {
        new MessAge("修改成功").success()
        Route.reload('/index', { routeName: 'index' })
    }
}


function cleanErrMsg(form) {
    let errInput = $(form).find(".blog-error--input")
    if (errInput.length === 0) {
        return false;
    }
    errInput.removeClass('blog-error--input')[0].dataset['msg'] = ''
}

export default class Action {
    constructor() {
        this.modalAgency()
        this.formAgency()
        this.routeAgency()
        this.init()
        this.columnsAgency()
        this.tabsAgency()
    }

    init() {
        Route.go('/index', { routeName: 'index' })
    }


    modalAgency() {
        $(document).on("click", "[data-modal]", (e) => {
            let target = $(e.target)
            let modalType = target.data("modal")
            let token = sessionStorage.getItem("token")
            if (token && modalType !== "postColumn") {
                new MessAge("请先退出登录").danger()
                return false;
            }
            if (!modalType) {
                return false;
            }
            this.modal = new Modal({ modalType })
            this.modal.render()
        })


        $("body").on('click', '[data-modal-btn]', (e) => {
            e.stopPropagation()
            let target = $(e.target)

            let btnType = target.data("modal-btn")
            if (this.modal && btnType) {
                this.modal[btnType]()
            }
        })

        $("body").on('click', '[data-down]', async (e) => {
            let target = $(e.target)
            let btnType = target.data("down")
            if (btnType === "logout") {
                sessionStorage.clear()
                if (!sessionStorage.getItem("token")) {
                    Route.go("/logout", { routeName: "index" })
                    new MessAge("退出登录").success()
                }
                return false
            }
            Route.go("/userInfo", { routeName: "userInfo" })
        })

    }

    formAgency() {
        $("form").on("blur", "input", (e) => {
            let target = $(e.target)
            let form = target.parent("form")
            cleanErrMsg(form)
        })

        $(document).on("submit", "form", async (e) => {
            let target = $(e.target)
            let formType = target[0].id
            cleanErrMsg(target)
            try {
                let formData = await new Validate(formType)
                console.log(formData, formType);
                let result = await Http({
                    type: formType,
                    data: formData
                })
                if (formType in Res_Handle) {
                    Res_Handle[formType](result)
                }
                this.modal && this.modal.close()

            } catch (error) {
                console.log(error);
            }
        })
    }

    routeAgency() {
        $(document).on('click', '[data-router]', function (e) {
            let target = $(this)
            let routeName = target.data('router')
            let id = target.data('id')
            let column_id = target.data('column-id')
            Route.go(`/${routeName}`, { routeName: routeName, id, column_id })
        })
    }
    columnsAgency() {
        $(document).on('click', '[data-column]', function (e) {
            $(this).addClass("selected").siblings("li").removeClass("selected")
        })
    }
    tabsAgency() {
        $(document).on('click', '[data-tab]', function (e) {
            $(this).addClass("current").siblings("li").removeClass("current")
        })
    }

}