project_df.to_sql('PROJECT', con=db, if_exists='replace')
# projectsql = 'select * from PROJECT where project_id = "{}"'.format(1)
# project_df = pd.read_sql(projectsql, db)