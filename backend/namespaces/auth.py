from sqlite3.dbapi2 import Cursor
from warnings import resetwarnings
from app import api
from flask_restplus import Resource, abort, fields
from util.models import *
from flask import request
import sqlite3
auth = api.namespace('auth', description='Authentication Services')

@auth.route('/login')
class Login(Resource):
    @auth.response(200, 'Success',login_results)
    @auth.response(400, 'Missing Username/Password')
    @auth.response(403, 'Invalid Username/Password')
    @auth.expect(login_details)
    @auth.doc(description='login')
    def post(self):
        j = request.json
        (em, ps) = [j[i] for i in j]
        if em == '' or  ps == '':
            abort(400, 'Email and password cannot be empty')
        conn = sqlite3.connect('db/db.sqlite3')
        cursor = conn.cursor()
        cursor.execute('select * from USER where email = "{}" and password = "{}"'.format(em, ps))
        re = cursor.fetchone()
        print (re)
        if not re:
            abort(403, 'Invalid Email/Password')
        cursor.close()
        conn.close()
        return {
            'user_id': re[0],
            'user_name' : re[6]
        }

@auth.route('/signup')
class Signup(Resource):
    @auth.response(200, 'Success',signup_results)
    @auth.response(400, 'Missing Username/Password')
    @auth.response(409, 'Email Taken')
    @auth.expect(signup_details)
    @auth.doc(description='signup')
    def post(self):
        j = request.json
        (em, name, ps, mj, dg) = [j[i] for i in j]
        if em == '' or name == '' or ps == '' or mj == '' or dg == '':
            abort(400, 'Information cannot be empty')
        conn = sqlite3.connect('db/db.sqlite3')
        cursor = conn.cursor()
        cursor.execute('select * from USER where email = "{}"'.format(em))
        re = cursor.fetchone()
        if re:
            abort(409, 'Email Taken')
        cursor.execute('INSERT INTO USER (email,name,password,major,degree) VALUES ("{}","{}","{}","{}","{}")'.format(em, name, ps, mj, dg))
        conn.commit()
        userid = cursor.execute('select * from USER where email = "{}"'.format(em)).fetchone()
        cursor.close()
        conn.close()
        return {
            'user_id': userid[0],
            'user_name' : userid[6]
        }