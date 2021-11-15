from sqlite3.dbapi2 import Cursor
from warnings import resetwarnings
from app import api, mail
from flask_restplus import Resource, abort, fields
from util.models import *
from flask import request, send_file
from pandas.io.json import json_normalize
import pandas as pd
import sqlite3
import json
import os
from flask import flash, redirect, url_for
from werkzeug.utils import secure_filename
from flask_mail import Message

proj = api.namespace('proj', description='Project Services')

@proj.route('/project/recommand/<int:proj_id>')
class Recommand(Resource):
    @proj.response(200, 'Success',proj_list)
    @proj.response(400, 'invaild information')
    @proj.doc(description='recommand projects')
    def get(self, proj_id):
        db = sqlite3.connect('db/db.sqlite3')
        get_sql = 'select * from PROJECT where project_id = ' + str(proj_id)
        df_my = pd.io.sql.read_sql(get_sql, db) 
        if df_my.empty:
            return {}
        my_field = str(df_my.iloc[0]['field'])
        my_field = my_field.split(',')
        recommand_sql = 'select * from PROJECT'
        df_recommand = pd.io.sql.read_sql(recommand_sql, db)
        df_res = pd.DataFrame()
        for field in my_field:
            field = field.strip()
            if df_res.size == 0:
                df_res = df_recommand[df_recommand['field'].str.contains(field)]
            else:
                df_res = df_res.append(df_recommand[df_recommand['field'].str.contains(field)])
        df_res.drop_duplicates(subset=None, keep='first', inplace=True)
        df_res = df_res[df_res['project_id'] != proj_id]
        df_res = df_res.sort_values('average_score', ascending = False)
        db.commit()
        db.close()
        result = df_res.to_json(orient='records')
        parsed = json.loads(result)
        return {'result': parsed}

@proj.route('/project/recommand_user/<int:user_id>')
class Recommand_user(Resource):
    @proj.response(200, 'Success',proj_list)
    @proj.response(400, 'invaild information')
    @proj.doc(description='recommand projects')
    def get(self, user_id):
        db = sqlite3.connect('db/db.sqlite3')
        get_sql = 'select * from USER where id = ' + str(user_id)
        df_my = pd.io.sql.read_sql(get_sql, db) 
        if df_my.empty:
            return {}
        user_field = df_my.iloc[0]['major']
        user_degree = df_my.iloc[0]['degree']
        user_field = user_field.split(',')
        recommand_sql = 'select * from PROJECT'
        df_recommand = pd.io.sql.read_sql(recommand_sql, db)
        df_recommand = df_recommand[df_recommand['public'] == 1]
        df_recommand = df_recommand[df_recommand['prefered_degree'] == user_degree]
        print(df_recommand)
        df_recommand = df_recommand[df_recommand['user_id'] != user_id]
        db.commit()
        db.close()
        df_recommand = df_recommand.sort_values('average_score', ascending = False)
        result = df_recommand.to_json(orient='records')
        parsed = json.loads(result)
        return {'result': parsed}

@proj.route('/project/myProject/<int:user_id>')
class MyProject(Resource):
    @proj.response(200, 'Success',proj_list)
    @proj.response(400, 'invaild information')
    @proj.doc(description='get user`s projects')
    def get(self, user_id):
        db = sqlite3.connect('db/db.sqlite3')
        needsql = 'select * from PROJECT where user_id = ' + str(user_id)
        df_my = pd.io.sql.read_sql(needsql, db) 
        df_my = df_my.sort_values('average_score', ascending = False)
        db.commit()     
        db.close()
        result = df_my.to_json(orient='records')
        parsed = json.loads(result)
        return {'result': parsed}

@proj.route('/project/search')
class Search(Resource):
    @proj.response(200, 'Success',proj_list)
    @proj.response(400, 'invaild information')
    @proj.expect(search_details)
    @proj.doc(description='search the project')
    def post(self):
        keyword = request.json['keyword']
        field = request.json['field']
        db = sqlite3.connect('db/db.sqlite3')
        needsql = 'select * from PROJECT'
        df_my = pd.io.sql.read_sql(needsql, db) 
        db.commit()
        db.close()
        # 只显示公共项目
        df_my = df_my[df_my['public'] == 1]
        if field:
            df_my = df_my[df_my['field'].str.contains(field)]
        if keyword:
            df_my = df_my[df_my['title'].str.contains(keyword)]
        df_my = df_my.sort_values('average_score', ascending = False)
        result = df_my.to_json(orient='records')
        parsed = json.loads(result)
        return {'result': parsed}

@proj.route('/project/management')
class Project_management(Resource):
    @proj.response(201, 'Success')
    @proj.response(400, 'incorrect information')
    @proj.expect(upload_project)
    @proj.doc(description='upload a new project')
    # 创建一个新项目
    def post(self):
        df = pd.DataFrame.from_dict(json_normalize(request.json), orient='columns')
        db = sqlite3.connect('db/db.sqlite3')
        needsql = 'select * from PROJECT'
        df_db = pd.io.sql.read_sql(needsql, db)
        # project_id = 0
        project_id = int(df_db.iloc[-1]['project_id'] + 1) if len(df_db) > 0 else 0
        df['project_id'] = project_id
        df = df.set_index('project_id')  
        pd.io.sql.to_sql(df, 'PROJECT', con=db, if_exists = 'append') 
        db.commit()
        db.close()
        return {'project_id': project_id}
    @proj.response(200, 'Success')
    @proj.response(400, 'incorrect information')
    @proj.expect(project_id)
    @proj.doc(description='delete a project')
    def delete(self):
        proj_id = request.json['project_id']
        db = sqlite3.connect('db/db.sqlite3')
        delete_sql = 'DELETE FROM PROJECT WHERE project_id = ' + str(proj_id) 
        db.execute(delete_sql)
        db.commit()
        db.close()
        return {'success': 'ok'}

@proj.route('/project/<int:proj_id>/<int:user_id>')
class Project(Resource):
    @proj.response(200, 'Success',proj_details)
    @proj.response(400, 'invaild information')
    @proj.doc(description='projects detail')
    def get(self, proj_id, user_id):
        db = sqlite3.connect('db/db.sqlite3')
        get_sql = 'select * from PROJECT where project_id = ' + str(proj_id)
        df_my = pd.io.sql.read_sql(get_sql, db) 
        if df_my.empty:
            return {}
        comment_sql = 'select * from COMMENT where project_id = ' + str(proj_id)
        df_comment = pd.io.sql.read_sql(comment_sql, db)
        rank_sql = 'SELECT RANK.comment_id, RANK.rank FROM COMMENT, PROJECT, RANK where PROJECT.project_id = COMMENT.project_id and COMMENT.comment_id = RANK.comment_id and PROJECT.project_id = "{}" and RANK.user_id = "{}"'.format(proj_id, user_id)
        df_rank = pd.io.sql.read_sql(rank_sql, db)
        db.commit()
        db.close()
        detail = df_my.to_json(orient='records')
        parsed_detail = json.loads(detail)
        comment = df_comment.to_json(orient='records')
        parsed_comment = json.loads(comment)
        rank = df_rank.to_json(orient='records')
        parsed_rank = json.loads(rank)
        return { 'data': {
            'detail': parsed_detail,
            'comments': parsed_comment,
            'rank': parsed_rank
        }}

@proj.route('/project/file/<int:proj_id>')
class file(Resource):
    @proj.response(201, 'Success')
    @proj.response(400, 'invaild information')
    def post(self, proj_id):
        print(proj_id)
        if 'file' not in request.files:
            print('no file')
            return {"error": "no file"}, 400
        file = request.files['file']
        if file.filename == '':
            print('no file name')
            return {"error": "no file name"}, 400
        filename = secure_filename(file.filename)
        path = os.path.join(os.getcwd(), 'send_files', 'files')
        path = os.path.join(path, str(proj_id))
        if not os.path.exists(path):
            os.mkdir(path)
        file.save(os.path.join(path, filename))
        path = os.path.join(path, filename)
        db = sqlite3.connect('db/db.sqlite3')
        cursor = db.cursor()
        cursor.execute('update PROJECT set filepath = \'' + filename + '\' where project_id = ' + str(proj_id))
        db.commit()
        db.close()
        return {'sucess': 'ok'}, 201
    def get(self, proj_id):
        db = sqlite3.connect('db/db.sqlite3')
        get_sql = 'select * from PROJECT where project_id = ' + str(proj_id)
        df_my = pd.io.sql.read_sql(get_sql, db) 
        if df_my.empty:
            return {"error": "no file"}, 400
        file_path = df_my.iloc[0]['filepath']
        path = os.path.join('http://127.0.0.1:5000', 'send_files', 'files')
        path = os.path.join(path, str(proj_id))
        path = os.path.join(path, file_path)
        db.commit()
        db.close()
        return {'filepath' : path}
        
@proj.route('/project/invite_check')
class Project(Resource):
    @proj.response(200, 'Success', isAuthorised)
    @proj.response(400, 'invaild information')
    @proj.expect(invite_check)
    @proj.doc(description='check invite project and password')
    def post(self):
        j = request.json
        (pi, ps) = [j[i] for i in j]
        db = sqlite3.connect('db/db.sqlite3')
        get_sql = 'select * from PROJECT where project_id = ' + str(pi) + ' and password = \'' + str(ps) + '\''
        df_my = pd.io.sql.read_sql(get_sql, db) 
        if df_my.empty:
            abort(400, 'Invalid project id or password')
        else:
            return {'authorised': True}

@proj.route('/project/invite')
class Project(Resource):
    @proj.response(200, 'Success')
    @proj.response(400, 'invaild information')
    @proj.expect(invite_details)
    @proj.doc(description='check invite project and password')
    def post(self):
        email = request.json['email'].split(',')
        project_id = request.json['project_id']
        db = sqlite3.connect('db/db.sqlite3')
        existsql = 'select * from PROJECT where project_id = "{}"'.format(project_id)
        df_my = pd.io.sql.read_sql(existsql, db)
        url = 'http://localhost:3000/projectreview?projectId=' + str(project_id)
        if df_my.empty:
            abort(400, 'Project not found')     
        for i in email:
            send_e = i.strip()
            print(send_e)
            msg = Message('Invitation for peer review', sender = 'yourId@gmail.com', recipients = [send_e])
            msg.body = 'You are invited to view a document, here is the link: ' + url
            mail.send(msg)
        return {'sucess': 'ok'}, 200


# 页码获取
# page = int(request.args['page'])
# page_size = int(request.args['page_size'])
# total_number = df_db.shape[0]
# if (int(page) - 1) * int(page_size) > total_number:
#     return {"error message" : "invaild page number or page size"}, 400
# if int(page) * int(page_size) < total_number:
#     start_page = (int(page)-1) * int(page_size)
#     end_page = int(page) * int(page_size)
# else:
#     start_page = (int(page)-1) * int(page_size)
#     end_page = total_number = df_db.shape[0]
#df = df.iloc[:, start_page:end_page]
