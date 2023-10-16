import pandas as pd
import numpy as np
import random
import os
import global_vars


def load_prof_email_dataset(file_path, file_encoding):
    # read emails
    df_emails = pd.read_csv(file_path, encoding=file_encoding)
    prof_emails_labels = df_emails[global_vars.CSV_EMAIL_LABEL_TITLES].values
    categories = np.argmax(prof_emails_labels, axis=1)
    contents = df_emails['content'].values
    return df_emails, categories, prof_emails_labels, contents


def main():
    DATASET_FILE = '../datasets/prof_emails_151_gbk.csv'
    ANNOTATION_SAVE_FILE = './prof_emails_151_annotation.csv'
    df, categories, prof_emails_labels, content_list = load_prof_email_dataset(DATASET_FILE, 'gbk')
    ordering = list(range(len(content_list)))
    random.seed(123)  # for reproducibility between different annotators
    random.shuffle(ordering)
    reveal_answer = input('Do you want to reveal the true label after an incorrect answer? (Y=yes, N=no) ') == 'Y'

    if os.path.exists(ANNOTATION_SAVE_FILE):
        df_annotations = pd.read_csv(ANNOTATION_SAVE_FILE, encoding='gbk')
        num_existing_annotations = len(df_annotations)
    else:
        df_annotations = pd.DataFrame(columns=['Index', 'annotation'])
        num_existing_annotations = 0
    for i in range(num_existing_annotations, len(ordering)):
        email_idx = ordering[i]
        content = content_list[email_idx]
        true_label = categories[email_idx]
        print()
        print(content)
        print()
        annotation = int(input('Input the category (0-4):'))
        if reveal_answer:
            if annotation == true_label:
                print('Label matches with annotation')
            else:
                print(f'True label is {true_label}')
        df_annotations.loc[i] = [email_idx, annotation]
        df_annotations.to_csv(ANNOTATION_SAVE_FILE, encoding='gbk', index=False)
    print('All emails have been annotated... exiting...')


if __name__ == '__main__':
    main()
