export default {
    "sign": {
        title: '登录',
        formType: "sign",
        formData: [
            {
                label: "用户名",
                query: "username",
                type: "text",
                placeholder: " 6-8位 字母数字"
            },
            {
                label: "密码",
                query: "password",
                type: "password",
                placeholder: "6-12位 最少包含一位(数字/大小写字母)"
            }
        ],
        btns: [
            {
                targetName: 'close',
                name: '取消'
            },
            {
                targetName: 'confirm',
                name: '提交',
                isSubmit: true
            }
        ]
    },
    "login": {
        title: '注册',
        formType: "login",
        formData: [
            {
                label: "昵称",
                query: "nickname",
                type: "text",
                placeholder: " 请输入昵称"
            },
            {
                label: "用户名",
                query: "username",
                type: "text",
                placeholder: " 6-8位 字母数字"
            },

            {
                label: "密码",
                query: "password",
                type: "password",
                placeholder: " 6-12位 最少包含一位(数字/大小写字母)"
            },
            {
                label: "邮箱",
                query: "email",
                type: "text",
                placeholder: "请输入邮箱地址"
            }
        ],
        btns: [
            {
                targetName: 'close',
                name: '取消'
            },
            {
                targetName: 'confirm',
                name: '提交',
                isSubmit: true
            }
        ]
    },
    "postColumn": {
        title: '添加分类',
        formType: "postColumn",
        formData: [
            {
                label: "分类名称",
                query: "name",
                type: "text",
                placeholder: "请输入需要添加的分类"
            }
        ],
        btns: [
            {
                targetName: 'close',
                name: '取消'
            },
            {
                targetName: 'confirm',
                name: '提交',
                isSubmit: true
            }
        ]
    },
    "userInfo": {
        title: '用户信息',
        formType: "putUserInfo",
        formData: [
            {
                label: "昵称",
                query: "nickname",
                type: "text",
                placeholder: " 请输入昵称"
            },
            {
                label: "用户名",
                query: "username",
                readonly: true,
                type: "text",
                placeholder: " 6-8位 字母数字"
            },

            {
                label: "修改密码",
                query: "password",
                type: "password",
                placeholder: " 6-12位 最少包含一位(数字/大小写字母)"
            },
            {
                label: "邮箱",
                query: "email",
                type: "text",
                placeholder: "请输入邮箱地址"
            },
            {
                label: "个性签名",
                query: "signature",
                type: "text",
                placeholder: "这个人很懒，什么都没有留下...."
            }
        ],
        btns: [
            {
                targetName: 'close',
                name: '取消'
            },
            {
                targetName: 'confirm',
                name: '提交',
                isSubmit: true
            }
        ]
    },
}