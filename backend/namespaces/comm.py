from sqlite3.dbapi2 import Cursor
from app import api
from flask_restplus import Resource, abort, fields
from util.models import *
from flask import request
from pandas.io.json import json_normalize
import pandas as pd
import sqlite3
import json
import time
comm = api.namespace('Comm', description='Comment Services')

@comm.route('/comment')
class Search(Resource):
    @comm.response(200, 'Success')
    @comm.response(401, 'Already commented before')
    @comm.response(400, 'invaild information')
    @comm.expect(comment_details)
    @comm.doc(description='comment on a project')
    def post(self):
        project_id = request.json['project_id']
        reviewer_id = request.json['reviewer_id']
        db = sqlite3.connect('db/db.sqlite3')
        existsql = 'select * from COMMENT where project_id = "{}" and reviewer_id = "{}"'.format(project_id, reviewer_id)
        df_my = pd.io.sql.read_sql(existsql, db)
        if not df_my.empty:
            abort(401, 'You have commented before')

        projectsql = 'select * from PROJECT where project_id = "{}"'.format(project_id)
        project_df = pd.read_sql(projectsql, db)
        if project_df.empty:
            abort(400, 'invalid information')
        # write in to COMMENT table
        df = pd.DataFrame.from_dict(json_normalize(request.json), orient='columns')
        df['time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) 
        df = df.set_index('project_id')
        df.to_sql('COMMENT', con=db, if_exists='append')
        # add score to project
        score = request.json['score']
        project_df = project_df.set_index('project_id')
        total_score = project_df['total_score']
        new_total_score = score if not total_score.values[0] else total_score.values[0] + score
        comment_number = project_df['comment_number']
        new_comment_number = 1 if not comment_number.values[0] else comment_number.values[0] + 1
        new_average_score = new_total_score / new_comment_number
        cursor = db.cursor()
        cursor.execute('update PROJECT set total_score = "{}", comment_number = "{}", average_score = "{}" where project_id = "{}"'.format(new_total_score, new_comment_number, new_average_score, project_id))
        db.commit()
        cursor.close()
        db.close()
        return {'success': 'ok'}

@comm.route('/rank')
class Search(Resource):
    @comm.response(200, 'Success')
    @comm.response(401, 'Already ranked before')
    @comm.response(400, 'invaild information')
    @comm.expect(rank_details)
    @comm.doc(description='rank on a comment')
    def post(self):
        comment_id = request.json['comment_id']
        user_id = request.json['user_id']
        db = sqlite3.connect('db/db.sqlite3')
        existsql = 'select * from RANK where comment_id = "{}" and user_id = "{}"'.format(comment_id, user_id)
        df_my = pd.io.sql.read_sql(existsql, db)
        if not df_my.empty:
            abort(401, 'You have ranked before')


        # add rank to comment
        commentsql = 'select * from COMMENT where comment_id = "{}"'.format(comment_id)
        comment_df = pd.read_sql(commentsql, db)
        if comment_df.empty:
            abort(400, 'invalid information')
        # write into RANK table
        df = pd.DataFrame.from_dict(json_normalize(request.json), orient='columns')
        df['time'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) 
        df = df.set_index('comment_id')
        df.to_sql('RANK', con=db, if_exists='append')
        rank = request.json['rank']
        comment_df = comment_df.set_index('comment_id')
        total_rank = comment_df['total_rank']
        new_total_rank = rank if not total_rank.values[0] else total_rank.values[0] + rank
        total_number = comment_df['total_number']
        new_total_number = 1 if not total_number.values[0] else total_number.values[0] + 1
        new_average_rank = new_total_rank / new_total_number
        cursor = db.cursor()
        cursor.execute('update COMMENT set total_rank = "{}", total_number = "{}", average_rank = "{}" where comment_id = "{}"'.format(new_total_rank, new_total_number, new_average_rank, comment_id))
        db.commit()
        db.close()
        return {'success': 'ok'}