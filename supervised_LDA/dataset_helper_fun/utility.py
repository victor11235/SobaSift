import pandas as pd
import numpy as np
import codecs
import csv
import dataset_scripts.global_vars as global_vars


def load_prof_email_dataset(file_path, file_encoding, concat_title=False):
    # read emails
    df_emails = pd.read_csv(file_path, encoding=file_encoding, engine='python', escapechar='\\')
    prof_emails_labels = df_emails[global_vars.CSV_EMAIL_LABEL_TITLES].values
    categories = np.argmax(prof_emails_labels, axis=1)

    if concat_title:
        df_emails["SUB+BOD"] = df_emails["title"] + " | " + df_emails["content"]
        contents = df_emails['SUB+BOD'].values
    else:
        contents = df_emails['content'].values
    return df_emails, categories, prof_emails_labels, contents


def read_email_csv_file(csv_path):
    """
    read csv file and return a list of rows without the title row
    """
    with open(csv_path, 'r') as file:
        reader = csv.reader(file, delimiter=',', quotechar='"')
        next(reader)  # skip the first line, which is header for csv files
        emails = [row for row in reader]
    return emails


def write_email_csv_file(target_path, emails):
    with open(target_path, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writer.writerow(global_vars.CSV_EMAIL_TITLES)
        writer.writerows(emails)


def to_new_format(input_path, output_path):
    with codecs.open(input_path, 'r', 'utf-8') as sourceFile:
        contents = sourceFile.read()

    with codecs.open(output_path, 'w', 'gbk') as targetFile:
        targetFile.write(contents)

    with open(output_path, 'r') as file:
        reader = csv.reader(file, delimiter=',', quotechar='"')
        rows = [row[:4] + row[8:12] for row in reader]
    write_email_csv_file(output_path, rows)


def remove_spam_row_and_column(input_path, output_path):
    with open(input_path, 'r') as file:
        reader = csv.reader(file, delimiter=',', quotechar='"')
        next(reader)
        rows = [row[:-1] for row in reader if row[-1] != '1']
    write_email_csv_file(output_path, rows)