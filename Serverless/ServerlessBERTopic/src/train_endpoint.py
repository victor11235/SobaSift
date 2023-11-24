import pandas as pd
import logging
import requests
import os
from bertopic_model import BERTopicModel


MIN_DATASET_SIZE = 50


def send_data_to_supabase(supabase_data):
    # Specify the Supabase function URL
    supabase_url = 'https://nhnknprxifgvehayvrsh.supabase.co/functions/v1/receive-predictions'

    # Specify the headers
    supabase_headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obmtucHJ4aWZndmVoYXl2cnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY0MDgzNDcsImV4cCI6MjAwMTk4NDM0N30.dnuBB0FfKjq3Xa8U-xXS7oXFIMf8KwJWFXg_O1xwnQQ'
    }

    # Send a POST request to the Supabase function
    supabase_response = requests.post(supabase_url, json=supabase_data, headers=supabase_headers)

    # Check if the Supabase function executed successfully
    if supabase_response.status_code == 200:
        print("Successfully communicated with the Supabase function!")
    else:
        print("Failed to communicate with the Supabase function:", supabase_response.content)


def train(job):
    try:
        json_request = job['input']
        # Get JSON data from the request
        uid = json_request.get('uid')
        train_emails = json_request.get('train_emails')  # an array of emails
        train_categories = json_request.get('train_categories')
        access_token = json_request.get('access_token')

        # Convert email content and categories to lists
        train_email_content = [email['uniqueBody']['content'] for email in train_emails]
        train_email_categories = train_categories  # already a list

        # Pad the dataset if it's too small
        original_len = len(train_email_content)
        if len(train_email_content) < MIN_DATASET_SIZE:
            dup_count = int(MIN_DATASET_SIZE / len(train_email_content)) + 1
            train_email_content = train_email_content * dup_count
            train_email_categories = train_email_categories * dup_count

        # Create a DataFrame from the padded lists
        df = pd.DataFrame({
            'emails': train_email_content,
            'labels': train_email_categories
        })

        model = BERTopicModel()

        # get a list of predictions for the topics and the probabilities for each of the topics
        topics, probs = model.fit(df['emails'], df['labels'])
        model.save_model_to_s3(uid)

        # get the topic df for topic names
        topic_df = model.get_topic_info()

        # create a topic names dictionary
        topic_name_dict = dict(zip(topic_df.loc[:, 'Topic'], topic_df.loc[:, 'Name']))

        # send the uid, topics, emails, auth_token, and topic_name_dict to a supabase endpoint to put emails into new folders
        # Prepare the data to send to the Supabase function
        topics = topics[:original_len]
        send_data_to_supabase({
            'request_type': 'train',
            'uid': uid,
            'topics': topics,
            'topic_names': topic_name_dict,
            'emails': train_emails,
            'access_token': access_token
        })

        return {"status": "success"}

    except Exception as e:
        raise e


def predict(job):
    try:
        json_request = job['input']
        uid = json_request.get('uid')
        test_emails = json_request.get('test_emails')  # an array of emails
        access_token = json_request.get('access_token')
        model = BERTopicModel()
        model.load_model_from_s3(uid)

        test_email_content = [email['uniqueBody']['content'] for email in test_emails]
        test_predictions = model.predict(test_email_content)

        reply = {
            'request_type': 'test',
            'uid': uid,
            'topics': test_predictions,
            'emails': test_emails,
            'access_token': access_token
        }
        send_data_to_supabase(reply)

        return reply

    except Exception as e:
        raise e
