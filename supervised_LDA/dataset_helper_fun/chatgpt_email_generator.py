# reference: https://medium.com/geekculture/a-simple-guide-to-chatgpt-api-with-python-c147985ae28
import openai
import random
import steering_words
import csv
import time
import global_vars


def content_from_completion(chat_completion):
    return chat_completion.choices[0].message.content


def word_limit_str(word_limit):
    return f"Your response is limited to {word_limit} words."


TEMPERATURE = 1.


def create_completion(messages, max_tokens):
    # if server overloaded, wait with exponential backoff
    cur_wait_time = 5
    while True:
        try:
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo-0613",
                messages=messages,
                max_tokens=max_tokens,
                temperature=TEMPERATURE,
                n=1,
                presence_penalty=0.,
                frequency_penalty=0.
            )
            break
        except (openai.error.ServiceUnavailableError, openai.error.APIError) as e:
            print(f'error encountered: {e}')
            print(f'service unavailable, wait {cur_wait_time} seconds and retry...')
            time.sleep(cur_wait_time)
            cur_wait_time *= 2
    return completion


# The email's content should be described by a set of keywords provided by the user."""
USER_PROMPT_1 = "Generate only the email's title."
USER_PROMPT_2 = "Generate the above email's sender email address. Don't use placeholders."
USER_PROMPT_3 = "Generate the above email's body. Don't use placeholders."


def main():
    api_key = input('enter your api key:')
    openai.api_key = api_key

    email_rows = []
    current_row_index = 0
    for topic_desc_i in range(len(steering_words.TOPIC_DESCRIPTIONS)):
        topic_description = steering_words.TOPIC_DESCRIPTIONS[topic_desc_i]
        topic_description_label = steering_words.TOPIC_DESCRIPTION_LABELS[topic_desc_i]

        NUM_REPEAT = 10
        for j in range(NUM_REPEAT):
            user_prompt_1 = """Generate an email whose recipient is a university professor.
            Do not include extra formatting.
            """ + topic_description + USER_PROMPT_1

            # Generate title
            messages = [
                {'role': 'user', 'content': user_prompt_1 + word_limit_str(10)}
            ]
            completion = create_completion(messages, 20)
            email_title = completion.choices[0].message.content

            # Generate sender email address
            messages = [
                {'role': 'user', 'content': user_prompt_1},
                {'role': 'assistant', 'content': email_title},
                {'role': 'user', 'content': USER_PROMPT_2}
            ]
            completion = create_completion(messages, 25)
            email_sender_address = completion.choices[0].message.content

            # Generate body
            word_limit = random.choice((40, 60, 80, 100, 120, 150, 200))
            messages = [
                {'role': 'user', 'content': user_prompt_1},
                {'role': 'assistant', 'content': email_title},
                {'role': 'user', 'content': USER_PROMPT_2},
                {'role': 'assistant', 'content': email_sender_address},
                {'role': 'user', 'content': USER_PROMPT_3 + word_limit_str(word_limit)},
            ]
            completion = create_completion(messages, word_limit * 2)
            email_body = completion.choices[0].message.content
            print(email_title)
            print(email_sender_address)
            print(email_body)

            email_labels = [0] * global_vars.NUM_EMAIL_LABEL_CATEGORIES
            email_labels[topic_description_label] = 1
            email_rows.append([current_row_index, email_sender_address, email_title, email_body] +
                              email_labels)
            current_row_index += 1

    # save the email rows to a csv file
    with open('chatgpt_prof_emails.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writer.writerow(global_vars.CSV_EMAIL_TITLES)
        for row in email_rows:
            writer.writerow(row)

    with open('chatgpt_prof_emails.csv', 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in reader:
            print(row)


if __name__ == '__main__':
    main()
