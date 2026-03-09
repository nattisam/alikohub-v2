import pika
import json
import sys

# connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
# But since I'm running on the host and RabbitMQ is in docker:
connection = pika.BlockingConnection(pika.URLParameters('amqp://guest:guest@localhost:5672'))
channel = connection.channel()

exchange_name = 'payment_events'
channel.exchange_declare(exchange=exchange_name, exchange_type='fanout', durable=True)

payload = {
    "userId": "CwurqpSPR2WZSbOJwnDDJ7IA5AX2",
    "amount": 500,
    "purpose": "COURSE_PURCHASE_5",
    "metadata": {
        "courseId": 5,
        "enrollmentId": 29,
        "userId": "CwurqpSPR2WZSbOJwnDDJ7IA5AX2"
    }
}

channel.basic_publish(
    exchange=exchange_name,
    routing_key='',
    body=json.dumps(payload)
)

print(f" [x] Sent {payload}")
connection.close()
