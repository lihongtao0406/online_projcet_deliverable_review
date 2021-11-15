import sqlite3
import pandas as pd
import json
from pandas import json_normalize
score = 5
conn = sqlite3.connect('db/db.sqlite3')
cursor = conn.cursor()

projectsql = 'select * from PROJECT where project_id = "{}"'.format(1)
project_df = pd.read_sql(projectsql, conn)
print(project_df)
project_df = project_df.set_index('project_id')
total_score = project_df['total_score']
new_total_score = score if not total_score.values[0] else total_score.values[0] + score
print(new_total_score)
comment_number = project_df['comment_number']
new_comment_number = 1 if not comment_number.values[0] else comment_number.values[0] + 1
print(new_comment_number)
new_average_score = new_total_score / new_comment_number
print(new_average_score)
cursor.execute('update PROJECT set total_score = "{}", comment_number = "{}", average_score = "{}" where project_id = "{}"'.format(new_total_score, new_comment_number, new_average_score, 1))
conn.commit()
# print(new_total_score)
# project_df['total_score'] = str(score if project_df['total_score'].empty else project_df['total_score'] + score)
# project_df['comment_number'] = str(1 if project_df['comment_number'].empty else project_df['comment_number'] + 1)
# project_df['average_score'] = str(project_df['total_score'] / project_df['comment_number'])
# project_df.set_index('project_id')
# project_df.to_sql('PROJECT', con=db, if_exists='append')
# projectsql = 'select * from PROJECT where project_id = "{}"'.format(1)
# project_df = pd.read_sql(projectsql, db)
# print(project_df)