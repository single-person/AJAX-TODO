from utils import log
from routes import (
    json_response,
    current_user,
)
from models.weibo import Weibo
from models.comment import Comment

def all(request):
    weibos = Weibo.all_json()
    log('weibos',weibos)
    return json_response(weibos)

def comment_all(request):
    comments = Comment.all_json()
    log('comments', comments)
    return json_response(comments)

def comment_add(request):
    form = request.json()
    weibo_id = int(form.get('weibo_id'))
    c = Comment.new(form,weibo_id)
    return json_response(c.json())

def comment_delete(request):
    comment_id = int(request.query.get('id'))
    t = Comment.delete(comment_id)
    return json_response(t.json())

def add(request):
    u = current_user()
    form = request.json()
    w = Weibo.new(form,u.id)
    return json_response(w.json())

def delete(request):
    weibo_id = int(request.query.get('id'))
    t = Weibo.delete(weibo_id)
    return json_response(t.json())

def update(request):
    form = request.json()
    weibo_id = int(form.get('id'))
    t = Weibo.update(weibo_id, form)
    return json_response(t.json())

def route_dict():
    d = {
        '/api/weibo/all': all,
        '/api/weibo/add': add,
        '/api/weibo/delete': delete,
        '/api/weibo/update':update,
        '/api/weibo/comment': comment_all,
        '/api/weibo/comment/add': comment_add,
        '/api/weibo/comment/delete': comment_delete
    }
    return d