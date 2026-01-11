import hashlib

def calculate_crc16(data: str) -> str:
    """Standard CRC16-CCITT (0xFFFF) used by EMVCo and Bakong"""
    crc = 0xFFFF
    for char in data:
        x = ((crc >> 8) ^ ord(char)) & 0xFF
        x ^= x >> 4
        crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF
    return hex(crc & 0xFFFF).upper()[2:].zfill(4)

def format_emv_tag(tag: str, value: str) -> str:
    """Formats a tag into [Tag][Length][Value] format"""
    length = str(len(value)).zfill(2)
    return f"{tag}{length}{value}"