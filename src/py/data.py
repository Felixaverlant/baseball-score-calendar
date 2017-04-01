import pandas as pd
from sqlalchemy import create_engine

engine = create_engine('postgresql://felixaverlant@localhost:5432/retrosheet')
df = pd.read_sql_table('games', engine)
df_teams = pd.read_sql_table('teams', engine)
df_teams.to_csv('/Users/felixaverlant/Documents/projects/baseball-score-calendar/dist/data/teams.csv')

for index, row in df_teams.iterrows():

    df_a = df[df['away_team_id'] == row['team_id']]
    df_h = df[df['home_team_id'] == row['team_id']]

    team_name = df_teams[df_teams['team_id'] == row['team_id']]
    team_name = team_name.to_string(columns=['loc_team_tx', 'name_team_tx'], header=False, index=False)

    df_a['s'] = df_a['away_score_ct'] - df_a['home_score_ct']
    df_h['s'] = df_h['home_score_ct'] - df_h['away_score_ct']

    df_final = pd.concat([df_a,df_h])
    df_final['team_name'] = team_name
    df_final = df_final[['game_dt', 's', 'team_name']]


    df_final.to_csv('/Users/felixaverlant/Documents/project/baseball-score-calendar/dist/data/'+str(row['team_id'])+'.csv')
