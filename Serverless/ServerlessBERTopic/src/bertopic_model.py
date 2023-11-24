import torch
from bertopic import BERTopic
from bertopic.representation import KeyBERTInspired
from sentence_transformers import SentenceTransformer
from umap import UMAP
import shutil
import boto3
from botocore.exceptions import ClientError
import logging

from bertopic.vectorizers import ClassTfidfTransformer
from bertopic.dimensionality import BaseDimensionalityReduction
from sklearn.linear_model import LogisticRegression


class BERTopicModel:
    def __init__(self):
        if torch.cuda.is_available():
            logging.info("CUDA is available. Using GPU.")
        else:
            logging.info("CUDA is not available. Using CPU.")

        self.sentence_model = SentenceTransformer("all-MiniLM-L6-v2", cache_folder="./src/cache")
        empty_dimensionality_model = BaseDimensionalityReduction()
        clf = LogisticRegression()
        ctfidf_model = ClassTfidfTransformer(reduce_frequent_words=True)
        self.topic_model = BERTopic(
            embedding_model=self.sentence_model,
            umap_model=empty_dimensionality_model,
            hdbscan_model=clf,
            ctfidf_model=ctfidf_model
        )

    def save_model_to_s3(self, uid):
        # save the model
        ZIP_PATH = './model_weights'
        self.topic_model.save("./save_model_weights_dir", serialization="safetensors",
                         save_ctfidf=True, save_embedding_model=self.sentence_model)
        shutil.make_archive(ZIP_PATH, 'zip', './save_model_weights_dir')

        s3_client = boto3.client('s3')
        try:
            s3_client.upload_file(f'{ZIP_PATH}.zip', 'scholars-email-filter-s3-bucket', f'models/{uid}.zip')
        except ClientError as e:
            logging.error(e)

    def load_model_from_s3(self, uid):
        s3 = boto3.client('s3')
        s3.download_file('scholars-email-filter-s3-bucket', f'models/{uid}.zip', 'temp.zip')
        shutil.unpack_archive('temp.zip', './load_model_weights_dir', 'zip')
        self.topic_model = BERTopic.load('./load_model_weights_dir', embedding_model=self.sentence_model)

    def fit(self, email_arr, email_labels):
        topics, probs = self.topic_model.fit_transform(email_arr, y=email_labels)
        return topics, probs

    def get_topic_info(self):
        return self.topic_model.get_topic_info()

    def predict(self, email_arr):
        predictions = self.topic_model.transform(email_arr)[0]
        predictions = [predictions[i].item() for i in range(len(predictions))]
        return predictions

