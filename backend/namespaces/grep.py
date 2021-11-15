''' 
Ver:2.1 09/08/2021
bug fixed in get_major_analyzed
Ver:2.0 09/08/2021
Ready to lunch
Ver:1.8 08/08/2021
Update: new style in pdf
Ver:1.7 07/08/2021
Update:
 most_useful function can handle "none"(-1) ranks
Ver:1.6 06/08/2021
Update:
use top 10 reviews in function most_useful
Ver:1.5 06/08/2021
Update: bug in get_major_analyzed fixed 
change get_rank_analyzed to show bar chart
add function most_useful
data [[user_name,major,rank,content],....,[user_name,major,rank,content]] -> data [[user_name,major,rank,content,rank],....,[user_name,major,rank,content,rank]]
Ver:1.4 05/08/2021
Update: bug in get_frequency_analyzed fixed 
Ver:1.3 23/07/2021
Update: bugs fixed and a better style in pdf
Ver:1.2 20/07/2021
Update: bug in get_rank_analyzed fixed
Ver:1.1 17/07/2021
Update: bug in pie_jpg fixed
Ver:1.0 16/07/2021
input : data [[user_name,major,rank,content],....,[user_name,major,rank,content]] , path
output : a report pdf in path
you can use:  python3 get_report <data> <'report_output_path'> 
or use this with dis_level=0 for debug: 
import get_report
get_your_report(data,path,dis_level)

'''

from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from nltk.sentiment import vader 
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import matplotlib.pyplot as plt
import nltk
import os
from reportlab.platypus import SimpleDocTemplate, Image
from collections import Counter
from string import punctuation
from nltk.text import TextCollection
from nltk.tokenize import word_tokenize
import re



from reportlab.lib.styles import getSampleStyleSheet
def pie_jpg(data,labels,file_name,dis_level=1):
    #print(data,labels)###
    data_zero_check=[]
    labels_zero_check=[]
    for x in range(len(data)):
        if data[x]==0:
            data_zero_check.append(x)
            #labels.remove(labels[x])
    for x in data_zero_check:
        labels_zero_check.append(labels[x])
    #print("check0",data)
    new_data=[]
    for x in data:
        #print("check1",data,x)
        if x!=0:
            new_data.append(x)
    data=new_data    
    for x in labels_zero_check:
        labels.remove(x)
    #print(data_zero_check,labels_zero_check)#######
    #print(data,labels)
    explode =[0.5]
    if len(data)>1:
        for x in range(len(data)-1):
            explode.append(0)
    plt.axes(aspect='equal')
    plt.xlim(0,10)
    plt.ylim(0,10)
    plt.gca().spines['right'].set_color('none')
    plt.gca().spines['top'].set_color('none')
    plt.gca().spines['left'].set_color('none')
    plt.gca().spines['bottom'].set_color('none')


    plt.pie(x=data, 
    labels=labels,
    explode=explode,
    autopct='%.2f%%',
    pctdistance=0.8, 
    labeldistance=1.0,
    startangle=180,
    center=(5,5),
    radius=4.5,
    counterclock= True,
    textprops= {'fontsize':14,'color':'black'},
    frame=2) 
    plt.xticks(())
    plt.yticks(())
    plt.savefig(file_name)
    if dis_level<1:
        plt.show()
    plt.close('all')
    return

def get_content_analyzed(data,dis_level=1):
    # dis_level= 0 for debug,1 for 2 comments if possible,2 for all possible comments
#init vars
    sentences=[]
    output=[]
    pos_words="Good job! Many poeple gave you a positave review, such as: "
    neg_words="Lucky you! Someone helped you to find out your weakness: "
    neu_words="Here are some friendly advice: "
    compound_words="Interesting! They are talking about: "
    null_words="No comments here! Go get somebody here to see your masterpiece!"

    max_cat=2
    if dis_level>1:
        max_cat=4
    count_cat=0

    neg={}
    neu={}
    pos={}
    compound={}
    Analyzer = SentimentIntensityAnalyzer()
    for x in range(len(data)):
        sentences.append(data[x][3])



    if dis_level<1:
        print(' -- vader analyser --')
    for sentence in sentences:
        temp_max=-1
        cat='None'
        if dis_level<1:
            print('[{}]'.format(sentence), end=' --> ')
        kvp = Analyzer.polarity_scores(sentence)
        for k in kvp:
            if dis_level<1:
                print('{} = {}, '.format(k, kvp[k]), end='')
            if kvp[k]>=temp_max:
                temp_max=kvp[k]
        if dis_level<1:
            print()    
        for k in kvp:
            if kvp[k]==temp_max:
                cat=k
        if cat=='neg':
            neg[sentence]=temp_max        
        if cat=='neu':
            neu[sentence]=temp_max     
        if cat=='pos':
            pos[sentence]=temp_max
        if cat=='compound':
            compound[sentence]=temp_max
    if dis_level<1:    
        print(neg,neu,pos,compound)

    if pos:
        count_cat=count_cat+1
        max_=-1
        for x in pos:
            if pos[x] >=max_:
                max_=pos[x]        
        my_review=''
        for x in pos:
            if pos[x]==max_:
                my_review=list(pos.keys())[0]


        output.append(pos_words)
        output.append(my_review)
        if dis_level<1:
            print(pos_words)
            print(my_review)
    if neg:
        count_cat=count_cat+1
        max_=-1
        for x in neg:
            if neg[x] >=max_:
                max_=neg[x]     
        #print(max_)
        my_review=''
        for x in neg:
            if neg[x]==max_:
                my_review=x
        output.append(neg_words)
        output.append(my_review)
        if dis_level<1:
            print(neg_words)
            print(my_review)
    if neu and count_cat<max_cat:
        count_cat=count_cat+1
        max_=-1
        for x in neu:
            if neu[x] >=max_:
                max_=neu[x]        
        my_review=''
        for x in neu:
            if neu[x]==max_:
                my_review=x
        output.append(neu_words)
        output.append(my_review)
        if dis_level<1:
            print(neu_words)
            print(my_review)
    if compound and count_cat<max_cat:
        count_cat=count_cat+1
        max_=-1
        for x in compound:
            if compound[x] >=max_:
                max_=compound[x]        
        my_review=''
        for x in compound:
            if compound[x]==max_:
                my_review=x
        output.append(compound_words)
        output.append(my_review)
        if dis_level<1:
            print(compound_words)
            print(my_review)
    if count_cat==0:
        output.append(null_words)

        if dis_level<1:
            print(null_words)
    return output    


def get_rank(e):
    return e[2]
def biggest_fan(data,dis_level=1):
    output=[]
    max_=0
    if data:
        data.sort(key=get_rank)
        name=data[-1][0]
        rank=data[-1][2]
        major=data[-1][1]
        comment=data[-1][3]
        output.append(name+" from "+major+" seems really like your work, gaving you the highest mark: "+str(rank)+".")
        output.append(name+": "+comment)
    if dis_level<1:
        print(data)
        print(output)
    return output

def get_rank_analyzed(data,dis_level=1,file_name='./report_temp/rank_analyzed.jpg'):
    count=len(data)
    score=[0,0,0,0,0,0]#0-5
    pos=0
    neg=0
    med=0
    out=[]
    ave=0
    jpg_num=0
    for x in range(count):
        #print(data[x])
        ave=ave+data[x][2]
        score[data[x][2]]+=1
        if data[x][2]>=4:
            pos=pos+1
        if data[x][2]<=1:
            neg=neg+1
        if data[x][2]<4 and data[x][2]>1:
            med=med+1
        
    
    
    if dis_level<1:
        print("pos: ",pos)
        print("neg: ",neg)
        print("med: ",med)
        print("score: ",end='')
        for x in score:
            
            print(x,end=' ')
        print()
       
        
    if pos+neg+med!=0:
        ave=str(round(ave/len(data),2))
        jpg_num=1
        #plt_data=[pos,med,neg]
        #pkt_labels=['high(4-5)', 'medium(2-3)','low(0-1)']
        #pie_jpg(plt_data,pkt_labels,file_name,dis_level)
        if pos>=neg:
            pos_str='You got '+ave+' in average. There are '+str(count)+' reviews:'+str(round(pos/count*100,2))+'% people gave you a high mark(>= 4).'
            out.append(pos_str)
            if dis_level<1:
                print(pos_str)
        if pos<neg:
            neg_str='You got '+ave+' in average. There are '+str(count)+' reviews:'+str(round(neg/count*100,2))+'% people gave you a low mark(<= 1).'
            out.append(neg_str)
            if dis_level<1:
                print(neg_str)
    else:
        null_str="Nobody has reviewed your project!"
        out.append(null_str)
        if dis_level<1:
            print(null_str)
    if sum(score)!=0:
        #pstr='You got '+ave+' in average. There are '+str(count)+' reviews:'+str(round(pos/count*100,2))+'% people gave you a high mark(>= 4).'
        #out.append(str)
        plt.bar(["0","1","2","3","4","5"], score)
        plt.savefig(file_name)
        plt.close('all')
    
    return out,jpg_num
def get_total(e):
    return e[3]
def get_major_analyzed(data,dis_level=1):
    out=[]
    table=[]#[high 4-5,mid 2-3,low 0-1]
    major=set()
    jpg_num=0
    
    if data:
        for x in data:
            major.add(x[1])
        major=list(major)
        major_score=[]
        for x in range(len(major)):
            major_score.append([0,0])#count sum
            table.append([0,0,0])
        for x in data:
            major_score[major.index(x[1])][1]+=x[2]
            major_score[major.index(x[1])][0]+=1
            
            if x[2]>=4:
                table[major.index(x[1])][0]+=1
            if x[2]>=2 and x[2]<4:
                table[major.index(x[1])][1]+=1
            if x[2]<2:
                table[major.index(x[1])][2]+=1
        c=0
        for x in table:
            x.append(sum(x))
            x.append(c)
            c+=1
#         major_s={}
#         for x in range(len(major)):
#             major_s[major[x]]=table[x]+[x]
        
            
        table.sort(key=get_total,reverse=True)
        if dis_level<1:
            print("major: ",major)
            print("table: ",table)
            print("major_score: ",major_score)
            
        #pg_num+=1
        str0="Score distribution by major: "
        if len(major)>10:
            show_major=major[:10]
        else:
            show_major=major
        ########
        show_major=' '.join(show_major)
        str0=str0+show_major    
            
        out.append(str0)
        plt_major=[]
        for x in major:
            if len(x)>4:
                plt_major.append(x[0:4]+'.')
            else:
                plt_major.append(x)
        plt_major_data=[]
        for x in major_score:
            plt_major_data.append(round(x[1]/x[0],2))
        file_name='./report_temp/major_analyzed0.jpg'    
        #ie_jpg(plt_major_data,plt_major,file_name,dis_level)
        if len(plt_major)>10:
            plt_major=plt_major[:10]
            plt_major_data=plt_major_data[:10]
        #plt.close()
        plt.bar(plt_major, plt_major_data)
        
            
        plt.savefig(file_name)
        plt.close('all')
        max_show_range=2
        if len(table)<max_show_range:
            max_show_range=len(table)
        for x in range(max_show_range):
            str1= str(table[x][3])+" friends from "+major[table[x][-1]]+" gave their marks:"
            str2= "high(4-5): "+str(round(table[x][0]/table[x][3]*100,2))+"% medium(2-3): " + str(round(table[x][1]/table[x][3]*100,2))+"% low(0-1): " +str(round(table[x][2]/table[x][3]*100,2))+"% "
            plt_data=[table[x][0]/table[x][3]*100,table[x][1]/table[x][3]*100,table[x][2]/table[x][3]*100]
            pkt_labels=['high(4-5)', 'medium(2-3)','low(0-1)']
            
            out.append(str1)
            out.append(str2)
            file_name='./report_temp/major_analyzed'+str(jpg_num+1)+'.jpg'
            
            pie_jpg(plt_data,pkt_labels,file_name,dis_level)
            jpg_num+=1
            if dis_level<1:
                print(str1)
                print(str2)
    return out,jpg_num



def get_frequency_analyzed(data,dis_level=1,file_name='./report_temp/frequency_analyzed.jpg'):
    out=[]
    plt_data=[]
    pkt_labels=[]
    jpg_num=0
    hot_str="The most frequent words in comments are:"
    if data:
        out.append(hot_str)
        jpg_num=1
        stopwords = set(nltk.corpus.stopwords.words('english'))
        hot_words= Counter()
        for x in data:
            spl = x[3].split()
            hot_words.update(w.lower().rstrip(punctuation)  for w in spl if w  not in stopwords)
        #hot_words=hot_words[0]
        hw_count=0
        for x in hot_words:
            #print(x)
            hw_count+=1
            pkt_labels.append(x)
            plt_data.append(hot_words[x])
            if hw_count>=10:
                break
        plt.bar(pkt_labels, plt_data)
        plt.savefig(file_name)
        if dis_level<1:
            print(hot_words)
            plt.show()
    return out,jpg_num


def most_useful(data,dis_level=1):
    out=["According to the average rank of each comments:"]
    out1=[]
    str1="Here is a useful advice loved by others:"
    str1s="Here are some useful advices loved by others:"
    str2="Here is a useless advice, and you might ignore it:"
    str2s="Here are some useless advices , and you might ignore them:"
    max_=0
    min_=5
    for x in data:
         if x[-1]!=-1:
            if x[-1]>max_:
                max_=x[-1]
            if x[-1]<min_:
                min_=x[-1]
    useful=[]
    useless=[]
    for x in data:
        if x[4]==max_:
            useful.append(x[0]+':'+x[3])
        if x[4]==min_:
            useless.append(x[0]+':'+x[3])
    if useful:
        if len(useful)==1:
            out.append(str1)
        if len(useful)>1:
            out.append(str1s)
        count=0
        for x in useful:
            if count<=10:
                out.append(x)
                count+=1
    if useless:
        if len(useless)==1:
            out1.append(str2)
        if len(useless)>1:
            out1.append(str2s)
        count=0
        for x in useless:
             if count<=10:
                out1.append(x)
                count+=1

    if not useful and not useless:
        out=["Sorry! We don't have enough ranking data","Please wait for more comments get ranked."]
        out1=["You can share your document with more friends."]
    return out,out1


def get_your_report(data,path='./',dis_level=1):
    
    plt.switch_backend('agg') 
    title_order=0
    isExists=os.path.exists('./report_temp/')
    if not isExists:
        os.makedirs('./report_temp/') 
    
    doc = SimpleDocTemplate(path+"report.pdf")
    styles = getSampleStyleSheet()
    style1 = styles['Title']
    style2 = styles['BodyText']
    style4 = styles['Italic']
    style3 = styles['Definition']
    style5 = styles['Heading2']
    
    story =[]
    story.append(Paragraph("Summary for reviews of your project",style1))
    
    if not data:
        story.append(Paragraph("SORRY! No comments here. Go get somebody see your masterpiece",style2))
    else:
        ###score distribution
        title_order+=1
        title=str(title_order)+". Score Distribution"
        story.append(Paragraph(title,style5))
        description ="You can see how many comments you get for each score."
        story.append(Paragraph(description,style4))
        
        par,pic_count= get_rank_analyzed(data,dis_level)
        if pic_count==1:
            #print("test",par)
            #story.append(Paragraph(par[0],style2))
            for x in range(len(par)):
                
                story.append(Paragraph(par[x],style2))
            t = Image("./report_temp/rank_analyzed.jpg", width=200*1.75, height=133*1.75)
            story.append(t)
        ###Who love your document the most
        title_order+=1
        title=str(title_order)+". Who Love Your Document The Most"
        story.append(Paragraph(title,style5))
        description ="He/she loves your ideas. Having a further discussion with that person could help you a lot."
        story.append(Paragraph(description,style4))
        
        
        par=biggest_fan(data)
        story.append(Paragraph(par[0],style2))
        for x in range(1,len(par)):
                
            story.append(Paragraph(par[x],style3))
        ##most_useful
        
        title_order+=1
        title=str(title_order)+". The Most Useful Comment(s)"
        story.append(Paragraph(title,style5))
        description ="Our rank system allow users to rank other users' comments"
        story.append(Paragraph(description,style4))
        
        par,par0=most_useful(data)
        story.append(Paragraph(par[0],style2))
        story.append(Paragraph(par[1],style2))
        for x in range(2,len(par)):
                
            story.append(Paragraph(par[x],style3))
        story.append(Paragraph(par0[0],style2))
        for x in range(1,len(par0)):
                
            story.append(Paragraph(par0[x],style3))
        ##major distribution
        
        title_order+=1
        title=str(title_order)+". Major Distribution"
        story.append(Paragraph(title,style5))
        description ="Voices form different fidlds are very important. Here are some majors ordered by the number of comments."
        story.append(Paragraph(description,style4))
        
        par,pic_count=get_major_analyzed(data,dis_level)
        if pic_count>1:
            p = par.pop(0)
            story.append(Paragraph(p,style2))
            t = Image('./report_temp/major_analyzed0.jpg', width=200*1.75, height=133*1.75)
            story.append(t) 
            spl_list=[]
            for i in range(pic_count):
                spl_list.append(i*2)
            i=1
            
            for x in spl_list:
                
                story.append(Paragraph(par[x],style2))#
                story.append(Paragraph(par[x+1],style3))
                t = Image('./report_temp/major_analyzed'+str(i)+'.jpg', width=200*1.75, height=133*1.75)
                story.append(t) 
                i+=1
        
#         ##advice
        
#         title_order+=1
#         title=str(title_order)+". Some advice"
#         story.append(Paragraph(title,style5))
#         description ="Here are some representative comments might help you to improve."
#         story.append(Paragraph(description,style4))
        
#         par=get_content_analyzed(data,dis_level)
        
        
#         for x in range(len(par)):
#             if x%2==0:
#                 story.append(Paragraph(par[x],style2))#
#             else:
#                 story.append(Paragraph(par[x],style3))
#         ##Hot words
        
#         title_order+=1
#         title=str(title_order)+". Hot words"
#         story.append(Paragraph(title,style5))
#         description ="Hot words are the keywords of comments. They can give you a hit to improve your idea."
#         story.append(Paragraph(description,style4))
        
#         par,pic_count=get_frequency_analyzed(data,dis_level)
#         if pic_count==1:
#             for x in par:
#                 story.append(Paragraph(x,style2))
#             t = Image('./report_temp/frequency_analyzed.jpg', width=200*1.75, height=133*1.75)
#             story.append(t) 
        
    doc.build(story)
    if dis_level<1:
        print("done!")
    return


if __name__=="__main__":
    get_your_report(sys.argv[1],sys.argv[2])

