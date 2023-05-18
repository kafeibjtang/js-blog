import Template from './template'
import Router from '../route'
import HTTP from '../model/http'
import Editor from "wangeditor"
import Edite from "../model/editor"
import Qs from "qs"
import $ from "jquery"
import MessAge from '../model/message'
import Comment from '../model/comment'
import articleLike from '../model/articleLike'
import config from '../config/config'
const Route_Map = {
    'user': {
        wrap: ".blog-login",
    },
    'index': {
        wrap: '.blog-index',
    },
    "articles": {
        wrap: '.art-right',
        tempName: "articles"
    },
    'write': {
        wrap: '.section-banner',
        tempName: "write"
    },

    "article": {
        wrap: '.section-banner',
        tempName: "article"
    },
    "columns": {
        wrap: '.section-banner',
        tempName: "columns"
    },
    "userInfo": {
        wrap: '.section-banner',
        tempName: "userInfo"
    },
}

// const OFF = {
//     "article": true,
//     "articles": true,
//     "user": false,
//     "index": false,
//     "write": true,
//     "columns": true,

// }

function routeHandle(routeName) {
    if (Route_Map[routeName]?.['wrap']) {
        Route['_mount'] = document.querySelector(Route_Map[routeName]['wrap'])
    }
}


function renderHandle(routeName, data) {
    routeHandle(routeName)
    let { tempName } = Route_Map[routeName];

    if (!tempName) {
        tempName = routeName
    }
    return {
        dom: Template.render(tempName, data)
    }
}

const Route = new Router('page')

Route.use((req) => {
    let type = req.body.routeName
    req.routeName = type
})

Route.route('/articles', async (req, res, next) => {
    let columnId = req.body.column_id
    try {
        if (columnId) {
            let { list } = await HTTP({ type: 'articles', data: { query: Qs.stringify({ column: columnId }) } })
            if (!list.length) {
                Route.go("/columns")
                new MessAge("当前分类没有文章哦,去写一篇吧").warning()
                return false
            }
            list = list.map(item => {
                item.content = `${$(item.content).text().slice(0, 60)}...`
                return item
            })
            res.render(renderHandle("article", { list }))
            return false
        }
    } catch (error) {
        console.log(error);

    }
})

Route.route('/article', async (req, res, next) => {
    let routeName = req.routeName
    try {
        let id = req.body.id
        let result = await HTTP({ type: "getArticleById", data: { id } })
        res.render(renderHandle(routeName, result))
        Comment.execute({
            eleInput: ".textarea-comment",
            eleSubmit: ".oButton",
            aid: id
        }, async (data) => {
            if (!data) {
                return false
            }
            await HTTP({ type: "postComment", data })
            // Route.go('/index', { routeName: "index" })
            Route.reload(`/article`, { routeName: 'article', id })

        })
        articleLike.exeLike({
            likeBtn: ".article_like",
            aid: id
        }, async (aid) => {
            await HTTP({ type: "likes", data: { id: aid } })
            new MessAge("感谢点赞").success()
            // Route.go('/articles', { routeName: "article" })
            Route.reload(`/article`, { routeName: 'article', id })
        })
    } catch (error) {
        console.log(error);
    }
})

Route.route('/columns', async (req, res, next) => {
    let routeName = "columns"
    try {
        let uid = sessionStorage.getItem("uid")

        let { list } = await HTTP({ type: 'columns', data: { query: Qs.stringify({ uid }) } })
        res.render(renderHandle(routeName, { list }))

    } catch (error) {
        new MessAge("请先登录").danger()
        console.log(error);
    }
})

Route.route('/userInfo', async (req, res, next) => {
    let routeName = req.routeName
    let data = config[routeName]
    try {
        let result = await HTTP({ type: routeName })
        data.formData = data.formData.map(item => {
            let key = item.query
            item.value = result[key]
            return item
        })
        res.render(renderHandle(routeName, data))
    } catch (error) {
        console.log(error);
    }

})


Route.route('/user', (req, res, next) => {
    let routeName = req.routeName
    let nickname = sessionStorage.getItem("nickname")
    res.render(renderHandle(routeName, { isLogin: true, nickname }))
})

Route.route('/index', async (req, res, next) => {
    let nickname = sessionStorage.getItem("nickname")
    res.render(renderHandle("user", { isLogin: nickname, nickname }))
    res.render(renderHandle("index"))
    try {
        let tempName = "articles"
        let result = await HTTP({ type: tempName })
        let list = result.list.slice(0, 5)
        list = list.map(item => {
            item.content = `${$(item.content).text().slice(0, 60)}...`
            return item
        })
        res.render(renderHandle(tempName, { list }))
    } catch (error) {
        console.log(error);
    }
})

Route.route('/write', async (req, res, next) => {
    let routeName = "write"
    try {
        let { list } = await HTTP({
            type: 'columns', data: {
                query: Qs.stringify({ uid: sessionStorage.getItem('uid') })
            }
        })
        list = list.map(item => {
            item.content = `${$(item.content).text().slice(0, 60)}...`
            return item
        })
        res.render(renderHandle(routeName, { list }))

        new Edite(async function (data) {
            if (!data) {
                return false;
            }
            let result = await HTTP({ type: 'postArticle', data })
            Route.go(`/article`, { routeName: 'article', id: result.id })
        })
    } catch (error) {
        new MessAge("请先登录").danger()
        console.log(error);
    }
})


Route.route('*', (req, res, next) => {
    if (!req.routeName || req.routeName === 'undefined') {
        Route.go('/index', { routeName: "user" })
    }
})

export default Route