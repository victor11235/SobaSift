
import csv
import global_vars
import utility


NUM_VALIDATION_PER_CLASS = 5


def main():
    emails = utility.read_email_csv_file('../datasets/prof_emails_151_gbk.csv')

    # count occurrences of each label
    label_counts = [0] * global_vars.NUM_EMAIL_LABEL_CATEGORIES

    with open('../datasets/train.csv', 'w', newline='') as train_file, open('../datasets/val.csv', 'w', newline='') as val_file:
        train_writer = csv.writer(train_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        val_writer = csv.writer(val_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

        # write the headers
        for writer in (train_writer, val_writer):
            writer.writerow(global_vars.CSV_EMAIL_TITLES)

        rows_by_classes = [[] for i in range(global_vars.NUM_EMAIL_LABEL_CATEGORIES)]
        for i in range(len(emails)):
            row = emails[i]
            label = None
            for j in range(global_vars.NUM_EMAIL_LABEL_CATEGORIES):
                if row[4 + j] == '1':
                    label = j
                    label_counts[j] += 1
            rows_by_classes[label].append(row)

        instances_by_class = [len(class_rows) for class_rows in rows_by_classes]
        instances_per_class = min(instances_by_class)
        for label in range(global_vars.NUM_EMAIL_LABEL_CATEGORIES):
            class_rows = rows_by_classes[label]
            for i in range(instances_per_class):
                if i < NUM_VALIDATION_PER_CLASS:
                    writer = val_writer
                else:
                    writer = train_writer
                writer.writerow(class_rows[i])

        print(label_counts)


if __name__ == '__main__':
    main()
