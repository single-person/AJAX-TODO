// WEIBO API
// 获取所有 weibo
var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
}

var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(id, callback) {
    var path = `/api/weibo/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}

var apiCommentAll = function(callback) {
    var path = `/api/weibo/comment`
    ajax('GET', path, '', callback)
}

var apiCommentAdd = function(form, callback) {
    var path = '/api/weibo/comment/add'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(id, callback) {
    var path = `/api/weibo/comment/delete?id=${id}`
    ajax('GET', path, '', callback)
}

// WEIBO DOM
var weiboTemplate = function(weibo) {
    var w = `
        <div class="weibo-cell">
            <button data-id=${weibo.id} class="weibo-delete">删除</button>
            <button data-id=${weibo.id} class="weibo-edit">编辑</button>
            <span data-id=${weibo.user_id} class="weibo-content" >${weibo.content}</span>
            <input class="input-comment">
            <button data-id=${weibo.id} class="comment-add">添加评论</button>
            <div class="weibo-comment" id=id-weibo_id-${weibo.id}></div>
        </div>
    `
    return w
}

var commentTemplate = function(comment) {
    var c = `
        <div class="comment-cell">
            <button data-id=${comment.id} class="comment-delete">删除评论</button>
            <span data-weibo_id=${comment.weibo_id} class="comment-content" >${comment.content}</span>
        </div>
    `
    return c
}


var weiboUpdateTemplate = function(weibo_id) {
    var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input">
            <button data-id=${weibo_id} class="weibo-update">更新</button>
        </div>
    `
    return t
}


var insertWeibo = function(weibo) {
    var weiboCell = weiboTemplate(weibo)
    // 插入 weibo-list
    var weiboList = e('.weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
}

var insertComments = function(comment) {
    var commentCell = commentTemplate(comment)
    // 插入 weibo-list
    var commentList = e(`#id-weibo_id-${comment.weibo_id}`)
    log('插入新的评论')
    commentList.insertAdjacentHTML('beforeend', commentCell)
}


var loadComments = function() {
    // 调用 ajax api 来载入数据
    apiCommentAll(function(r) {
        console.log('Comment all', r)
        // 解析为 数组
        var comments = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < comments.length; i++) {
            var comment = comments[i]
            insertComments(comment)
        }
    })
}

var loadWeibos = function() {
    // 调用 ajax api 来载入数据
    apiWeiboAll(function(r) {
        console.log('Weibo all', r)
        // 解析为 数组
        var weibos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)
        }
    })
    loadComments()
}


var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        var form = {
            content: content,
        }
        apiWeiboAdd(form, function(response) {
            // 收到返回的数据, 插入到页面中
            var weibo = JSON.parse(response)
            insertWeibo(weibo)
        })
    })
}

var bindEventCommentAdd = function() {
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('comment-add')) {
            log('点到了添加评论按钮')

            var weiboCell = self.closest('.weibo-cell')
            var commentList = weiboCell.querySelector('.weibo-comment')
            var input = weiboCell.querySelector('.input-comment')
            log('输入的新评论',input.value)
            var weiboId = self.dataset.id
            var form = {
                weibo_id: weiboId,
                content: input.value,
            }
            // var comment = input.value
            log('微博id',weiboId)
            apiCommentAdd(form, function(response) {
                log('CommentAdd', response)
                var comment = JSON.parse(response)
                log('评论的内容',comment)
                var value = commentTemplate(comment)
                commentList.insertAdjacentHTML('beforeend',value)
            })

        } else {
            log('点到了 weibo cell')
        }
    })
}


var bindEventWeiboDelete = function() {
    var weiboList = e('.weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function (event) {
        log(event)
        // 我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        log('被点击的元素', self)
        // 通过比较被点击元素的 class
        // 来判断元素是否是我们想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('weibo-delete')) {
            log('点到了 完成按钮, id 是', self.dataset.id)
            var weibo_id = self.dataset.id
            apiWeiboDelete(weibo_id, function(response) {
                // 删除 self 的父节点
                self.parentElement.remove()
            })
        } else {
            log('点到了 weibo cell')
        }
    })
}

var bindEventCommentDelete = function() {
    var weiboList = e('.weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function (event) {
        log(event)
        // 我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        log('被点击的元素', self)
        // 通过比较被点击元素的 class
        // 来判断元素是否是我们想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('comment-delete')) {
            log('点到了删除评论按钮, id 是', self.dataset.id)
            var comment_id = self.dataset.id
            apiCommentDelete(comment_id, function(response) {
                // 删除 self 的父节点
                self.parentElement.remove()
            })
        } else {
            log('点到了 weibo cell')
        }
    })
}

var bindEventWeiboEdit = function() {
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('weibo-edit')) {
            log('点到了编辑按钮')
            var weibo_id = self.dataset.id
            var w = weiboUpdateTemplate(weibo_id)
            self.parentElement.insertAdjacentHTML('beforeend', w)
        } else {
            log('点到了 weibo cell')
        }
    })
}

var bindEventWeiboUpdate = function() {
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('weibo-update')) {
            log('点到了更新按钮')

            var weiboCell = self.closest('.weibo-cell')
            var input = weiboCell.querySelector('.weibo-update-input')
            var weiboId = self.dataset.id
            var form = {
                id: weiboId,
                content: input.value,
            }
            apiWeiboUpdate(form, function(response) {
                log('update', response)

                var updateForm = weiboCell.querySelector('.weibo-update-form')
                updateForm.remove()

                var weibo = JSON.parse(response)
                var weiboTag = weiboCell.querySelector('.weibo-content')
                weiboTag.innerHTML = weibo.content
            })

        } else {
            log('点到了 weibo cell')
        }
    })
}


var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventCommentAdd()
    bindEventCommentDelete()
}


var __weibomain = function() {
    bindEvents()
    loadWeibos()

}

__weibomain()
