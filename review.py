import openpyxl
import datetime


def review(file_name, learn_words='5'):
    learn_words = int(learn_words)
    res = []
    wave = '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
    workbook = openpyxl.load_workbook(file_name)
    sheet = workbook.active

    today = datetime.date.today()
    next_date_one = today + datetime.timedelta(days=1)
    today_str = today.strftime('%Y-%m-%d')
    next_date_one = next_date_one.strftime('%Y-%m-%d')

    curve = [1,2,4,7,10,15,20,30,40,60]
    row = 2
    new_word = 1
    new_word_list = []
    for entry in sheet.iter_rows(min_row=2,values_only=True):
        if entry[3] == None:
            if new_word > learn_words:
                for word in new_word_list:
                    res.append(word[0]+'\n')
                    res.append(word[1]+'\n')
                break
            res.append(wave+'\n'+entry[0]+'\n\n'+entry[1]+'\n'+wave+'\n')
            sheet.cell(row=row, column=3).value = today_str
            sheet.cell(row=row, column=4).value = next_date_one
            sheet.cell(row=row, column=5).value = '1'
            new_word += 1
            new_word_list.append([entry[0],entry[1]])
        elif entry[3] <= today_str:
            if entry[3] < today_str:
                delta = (today - datetime.datetime.strptime(entry[3], '%Y-%m-%d').date()).days
            else:
                delta = 0
            res.append(entry[0]+'\n')
            res.append(entry[1]+'\n')
            times = int(entry[4])
            first_date = datetime.datetime.strptime(entry[2], '%Y-%m-%d').date()
            next_date = first_date + datetime.timedelta(days=curve[times]+delta)
            next_date = next_date.strftime('%Y-%m-%d')
            sheet.cell(row=row, column=4).value = next_date
            sheet.cell(row=row, column=5).value = str(times+1)
        row += 1

    days = sheet.cell(row=2, column=8).value
    if sheet.cell(row=2, column=9).value != today_str:
        new_days = int(days)+1
        sheet.cell(row=2, column=8).value = str(new_days)
        sheet.cell(row=2, column=9).value = today_str
    else:
        new_days = days

    workbook.save(file_name)
    
    return res, new_days