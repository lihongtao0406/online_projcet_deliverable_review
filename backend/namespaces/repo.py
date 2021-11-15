# coding=utf-8
from app import api
from util.models import *
from flask_restplus import Resource
import pandas as pd
import sqlite3
import os
from namespaces.grep import get_your_report
import numpy as np
repo = api.namespace('repo', description='Report Services')

@repo.route('/report/<int:proj_id>')
class Report(Resource):
    @repo.response(200, 'Success')
    @repo.response(400, 'invaild information')
    @repo.doc(description='report')
    def get(self, proj_id):
        need_sql = 'select COMMENT.reviewer_name, USER.major, COMMENT.score, COMMENT.content, COMMENT.average_rank from COMMENT, USER where COMMENT.project_id = ' + str(proj_id) + ' and COMMENT.reviewer_id = USER.id'
        db = sqlite3.connect('db/db.sqlite3')
        df_comm = pd.io.sql.read_sql(need_sql, db)
        df_comm = df_comm.replace(np.nan, -1)
        list_comm = df_comm.values.tolist()
        print(list_comm)
        # list_test =[
        # ['a', 'ACC', 5, 'great work', 4],
        # ['b', 'ACC', 4, 'great work, but', 3],
        # ['c', 'IT', 2, 'bad', 4],
        # ['d', 'IT', 3, 'not too bad', 2],
        # ['e', 'IT', 4, 'good', 4],
        # ['f', 'EE', 5, 'great', 2],
        # ['g', 'LAW', 1, 'very bad', 5],
        # ['h', 'EE', 2, 'bad', 4],
        # ['i', 'EE', 3, 'not too bad', 3],
        # ['j', 'LAW', 4, 'good but', 4]]
        db.commit()
        db.close()
        path = os.path.join(os.getcwd(), 'send_files', 'reports', str(proj_id), '')
        if not os.path.exists(path):
            os.mkdir(path)
        get_your_report(list_comm, path)
        return {'report_path': os.path.join('http://127.0.0.1:5000', 'send_files', 'reports', str(proj_id), 'report.pdf')}