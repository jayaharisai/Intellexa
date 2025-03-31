import json
import re
import jwt
import datetime

def read_json_file(file_path):
    """
    Reads a JSON file and returns its contents as a dictionary.
    :param file_path: Path to the JSON file.
    :return: Dictionary containing JSON data.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error reading JSON file: {e}")
        return None
    
def is_valid_email(email):
    """
    Validates whether the given string is a valid email address.
    :param email: String to validate.
    :return: True if valid email, False otherwise.
    """
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None


def create_jwt_token(payload, secret, algorithm='HS256'):
    """
    Creates a JWT token.
    :param payload: Data to encode in the token.
    :param secret: Secret key for encoding.
    :param algorithm: Encoding algorithm (default: HS256).
    :return: Encoded JWT token.
    """
    payload["exp"] = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    return jwt.encode(payload, secret, algorithm=algorithm)

def decode_jwt_token(token, secret, algorithms=['HS256']):
    """
    Decodes a JWT token.
    :param token: JWT token to decode.
    :param secret: Secret key for decoding.
    :param algorithms: List of algorithms to use for decoding.
    :return: Decoded payload or None if invalid.
    """
    try:
        return jwt.decode(token, secret, algorithms=algorithms)
    except jwt.ExpiredSignatureError:
        print("Token has expired")
    except jwt.InvalidTokenError:
        print("Invalid token")
    return None