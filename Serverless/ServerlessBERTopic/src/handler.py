#!/usr/bin/env python

import runpod
import train_endpoint


def handler(job):
    """
    This is the handler function that will be called by the serverless.
    """
    request_type = job['input']['request_type']
    if request_type == 'train':
        result = train_endpoint.train(job)
    elif request_type == 'test':
        result = train_endpoint.predict(job)
    else:
        print(f'unknown request type {request_type}!')
    return result


runpod.serverless.start({"handler": handler})
