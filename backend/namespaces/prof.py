from app import api
from flask_restplus import Resource, abort, fields
from util.models import *
from flask import request
import sqlite3
import pandas as pd
import json

prof = api.namespace('prof', description='Profile Services')

@prof.route('/<int:user_id>')
class Profile(Resource):
    @prof.response(200, 'Success',profile_details)
    @prof.response(400, 'invaild user ID')
    @prof.doc(description='profile')
    def get(self, user_id):
        db = sqlite3.connect('db/db.sqlite3')
        user_info_sql = 'select * from USER where id = ' + str(user_id)
        df_user = pd.io.sql.read_sql(user_info_sql, db)
        project_info_sql = 'select * from PROJECT where user_id = ' + str(user_id)
        df_project = pd.io.sql.read_sql(project_info_sql, db)
        df_user[['total_project_number']] = len(df_project)
        df_user[['average_project_rank_to']] = round(df_project[df_project['average_score'].notnull()]['average_score'].mean(), 2)
        df_user[['total_comment_number_from']] = df_project['comment_number'].sum()
        set_fields = set()
        df_project['field'].apply(lambda x: set_fields.update(x.split(',')))
        set_fields = list(filter(None, set_fields))
        df_user[['project_fields']] = ','.join(set_fields)
        comment_info_sql = 'select * from COMMENT where reviewer_id = ' + str(user_id)
        df_comment = pd.io.sql.read_sql(comment_info_sql, db)
        df_user[['total_comment_number_to']] = len(df_comment)
        df_user[['average_comment_rank_to']] = round(df_comment[df_comment['score'].notnull()]['score'].mean(), 2)
        # rank_info_sql = 'select * from RANK where user_id = ' + str(user_id)
        # df_rank = pd.io.sql.read_sql(rank_info_sql, db)
        # df_user[['average_comment_rank_to']] = round(df_rank[df_rank['rank'].notnull()]['rank'].mean(), 2)
        comm_rank_sql = 'select COMMENT.reviewer_id, RANK.rank from COMMENT, RANK where COMMENT.comment_id = RANK.comment_id and COMMENT.reviewer_id = ' + str(user_id)
        df_from_rank = pd.io.sql.read_sql(comm_rank_sql, db)
        df_user[['average_comment_rank_from']] = round(df_from_rank[df_from_rank['rank'].notnull()]['rank'].mean(), 2)
        proj_comm_sql = 'select PROJECT.user_id, COMMENT.average_rank from PROJECT, COMMENT where COMMENT.project_id = PROJECT.project_id and PROJECT.user_id = ' + str(user_id)
        df_from_project= pd.io.sql.read_sql(proj_comm_sql, db)
        df_user[['average_project_rank_from']] = round(df_from_project[df_from_project['average_rank'].notnull()]['average_rank'].mean(), 2)
        interest_fields_sql = 'select COMMENT.reviewer_id, PROJECT.field from PROJECT, COMMENT where COMMENT.project_id = PROJECT.project_id and COMMENT.reviewer_id = ' + str(user_id)
        df_interest_fields = pd.io.sql.read_sql(interest_fields_sql, db)
        set_fields = set()
        df_interest_fields['field'].apply(lambda x: set_fields.update(x.split(',')))
        set_fields = list(filter(None, set_fields))
        df_user[['interest_fields']] = ','.join(set_fields)

        image = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCADIAMgDASIAAhEBAxEB/8QAGgABAAMBAQEAAAAAAAAAAAAAAAMEBQECB//EAC8QAQACAgAGAQIEBQUAAAAAAAABAgMRBBIhMUFRYRNxBSIyoRQ0gZGxIzNCUnL/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAgEDBP/EABsRAQEBAQADAQAAAAAAAAAAAAABEQISIUEx/9oADAMBAAIRAxEAPwD6YA9TkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf2eqYr5bapWZ+U3DcNOaee/5axPny0qUpSvLWIiE24SKVfw+dR9S+viqWOBxRHWbTK0aR5VWK38Fh9WebcBjnta0fdbG+RjMy8Fem5rPNVW8z323NK2bg6ZZmYnllU6lZYzBLl4fJhnVqzr3CKJ36brABoAAAAAAAAAAAAJMGH6uatfHeXjp120OCwRSnPPe3+E9Ui1WIrWKx2dNa6ehzUAAAAH2AHJrE1nmjmifDN4vh/o3i1Yjkt+0tNFnpGTDas95jcKlLGQOzGp1rq4uJAGgAAAAAAAAAD1SnPkrX3LZiIisRHaIZfCRviKtVz6/SACVAAAAAAB69bHJnUb9dRuMfP0z3j56PD1e3NktPy8usRQBoAAAAAAAAASCbhP5mrX8sbBeKZ6WmdREtiP0xrtPWEdQgAhQAAAAAAT2n7DzkmYxWmO8Q0Y141e2u23HZnc/wCXHVIAAAAAAAAAASAO01zxv3DajtGmJ9u7V4TNGXDG/wBVen3T1PpE4RPvuOagAAAAABHnvyYbW+Eil+IZdVilfPWW8z2VQ87HZ9OOqQAAAAAAAAAAABPwuXkzRuY1ZAdY6x3hl9krc/v0FHg+Iva3Je2410he86lzsxQAwAAAGwR5c9MWuadTZl58n1s03iJiOyXjb83ETWJ6V6Ky+ZjABTAAAAAAAAAAAAAAHvFf6eWt/ET1bETzV5o7T1YnZf4LiOb/AEr947I6hF0I+whQAABPYKxckzOW0z5l5er/AO7b/wBS8usSANAAAAAAAAAAAAAO7taWvaKViZtI1yeyThf5invaxT8PmY/NfU+YT4eDpjvW3NabR23Cb1osdesT4l1x1zaAAAH0Y+eOXPePVpRw2ZxU3N5pWZlQ4rh5pfmpWeWevTw6SssVQ8imUAAAAAAA7ABFZtaIiJmZWsXBWtO76rE+GejFV6rivaY1S0tPHwuLH2ruU0RrtER/Rl6nxuKGLgLz1yTqPhdpipirqsR08vYi9aEd/uAxoAAAAAAa33AEWThsWTpNYrPwp5eBvTrjmJr6aJ/SVTrGWMOYms6mNW9T3GvkwUyx1r19wo5uDvj3MatVXlorDopjgACTFhvltqInX/Z5rS2S8Vrvc/s1sWKuGkVrrf8Ayn3KbcJHMXD0w11XXN5n2lBG6oAYAAAAAAAAAAAAAABPYAV8/C0yxuI5be2dkxXw3msxP39tlFnw1zUmN6tHaflU6LGQO3palpraOsfuOiWhweGMdJvbv4W/j0RqI6a0fLlbqoAMAAAAAAAAAAAAAAAAAAAAFbiuHjJHNH6oFnW+/YV5Br1ICQAAAAAAAAAAAAAAAAAAAAAA+3cAH//Z'
        df_user[['image']] = image
        df_user[['average_project_rank_from']] = df_user['average_project_rank_to']
        print(df_user)
        db.commit()
        db.close()
        result = df_user.to_json(orient='records')
        parsed = json.loads(result)
        return {'profile': parsed}
