from werkzeug import FileStorage
from app import api
from flask_restplus import fields

login_results = api.model('login_results',{
    'user_id': fields.Integer(),
    'user_name' : fields.String()
})

login_details = api.model('login_details',{
    'email': fields.String(example="1234@123.com"),
    'password': fields.String(example="123")
})

signup_results = api.model('signup_results',{
    'user_id': fields.Integer(),
    'user_name' : fields.String()

})

signup_details = api.model('signup_details',{
    'email': fields.String(example="1234@123.com"),
    'name': fields.String(),
    'password': fields.String(),
    'major': fields.String(),
    'degree': fields.String()
})

user_id = api.model('user_id',{
    'user_id': fields.Integer()
})

project_id = api.model('project_id',{
    'project_id': fields.Integer()
})

comment_details = api.model('comment_details',{
    'content': fields.String(),
    'score': fields.Integer(),
    'rank': fields.Float()
})

proj = api.model('proj',{
    'project_id': fields.Integer(),
    'user_id': fields.Integer(),
    'user_name': fields.String(),
    'title': fields.String(),
    'field': fields.String(),
    'summary': fields.String(),
    'time': fields.String(),
    'filepath': fields.String(),
    'total_score': fields.Float(),
    'average_score': fields.Float(),
    'comment_number': fields.Integer(),
    'public': fields.Integer(),
    'prefered_major': fields.String(),
    'prefered_degree': fields.String(),
    'password': fields.String()

})

proj_list = api.model('proj_list', {
    'result': fields.List(fields.Nested(proj))
})

proj_details = api.model('proj_details',{
    'project_id': fields.Integer(),
    'user_id': fields.Integer(),
    'user_name': fields.String(),
    'title': fields.String(),
    'field': fields.String(),
    'summary': fields.String(),
    'time': fields.String(),
    'filepath': fields.String(),
    'total_score': fields.Float(),
    'average_score': fields.Float(),
    'comment_number': fields.Integer(),
    'public': fields.Integer(),
    'prefered_major': fields.String(),
    'prefered_degree': fields.String(),
    'password': fields.String(),
    'comments': fields.List(fields.Nested(comment_details))
})

upload_project = api.model('upload_project',{
    'user_id': fields.Integer(),
    'user_name': fields.String(),
    'title': fields.String(),
    'field': fields.String(),
    'summary': fields.String(),
    'time': fields.String(),
    'filepath': fields.String(),
    'public': fields.String(),
    'prefered_major': fields.String(),
    'prefered_degree': fields.String(),
    'password': fields.String()
})

search_details = api.model('search_details',{
    'keyword': fields.String(),
    'field': fields.String()
})

comment_details = api.model('comment_details',{
    'project_id':fields.Integer(),
    'reviewer_id':fields.Integer(),
    'reviewer_name':fields.String(),
    'score':fields.Float(),
    'content':fields.String()
})

rank_details = api.model('rank_details',{
    'comment_id':fields.Integer(),
    'user_id':fields.Integer(),
    'rank':fields.Float()
})

invite_check = api.model('invite_check', {
    'project_id': fields.Integer(),
    'password': fields.String
})

isAuthorised = api.model('isAuthorised', {
    'authorised': fields.Integer()
})

invite_details = api.model('invite_details', {
    'email': fields.String(),
    'project_id': fields.Integer()
})

profile_details = api.model('profile_details', {
    'id': fields.Integer(),
    'name': fields.String(),
    'email': fields.String(),
    'major': fields.String(),
    'degree': fields.String(),
    'coin': fields.Integer(),
    'image': fields.String(),
    'total_project_number': fields.Integer(),
    'total_comment_number_to': fields.Integer(),
    'total_comment_number_from': fields.Integer(),
    'average_project_rank_to': fields.Float(),
    'average_project_rank_from': fields.Float(),
    'average_comment_rank_to': fields.Float(),
    'average_comment_rank_from': fields.Float(),
    'project_fields': fields.String(),
    'interest_fields': fields.String(),
})