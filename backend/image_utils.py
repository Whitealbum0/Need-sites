import io
import base64
from PIL import Image
from typing import Optional, Tuple


def compress_image(
    base64_image: str, 
    quality: int = 85, 
    max_size: Tuple[int, int] = (1200, 1200),
    format: str = "JPEG"
) -> str:
    """
    Сжимает изображение из base64 строки.
    
    Args:
        base64_image: Base64 строка изображения
        quality: Качество сжатия (1-100)
        max_size: Максимальный размер изображения (ширина, высота)
        format: Формат изображения (JPEG, PNG, WebP)
    
    Returns:
        Сжатая base64 строка
    """
    try:
        # Декодируем base64
        image_data = base64.b64decode(base64_image)
        
        # Открываем изображение
        with Image.open(io.BytesIO(image_data)) as img:
            # Конвертируем в RGB если это RGBA (для JPEG)
            if img.mode in ('RGBA', 'LA') and format == 'JPEG':
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Изменяем размер если нужно
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Сжимаем изображение
            output = io.BytesIO()
            img.save(output, format=format, quality=quality, optimize=True)
            
            # Кодируем обратно в base64
            compressed_data = output.getvalue()
            return base64.b64encode(compressed_data).decode('utf-8')
            
    except Exception as e:
        print(f"Ошибка сжатия изображения: {e}")
        return base64_image  # Возвращаем оригинал если не удалось сжать


def create_thumbnail(
    base64_image: str, 
    size: Tuple[int, int] = (300, 300),
    quality: int = 80
) -> str:
    """
    Создает миниатюру изображения.
    
    Args:
        base64_image: Base64 строка изображения
        size: Размер миниатюры
        quality: Качество сжатия
    
    Returns:
        Base64 строка миниатюры
    """
    return compress_image(
        base64_image, 
        quality=quality, 
        max_size=size, 
        format="JPEG"
    )


def get_image_info(base64_image: str) -> Optional[dict]:
    """
    Получает информацию об изображении.
    
    Args:
        base64_image: Base64 строка изображения
    
    Returns:
        Словарь с информацией об изображении
    """
    try:
        image_data = base64.b64decode(base64_image)
        
        with Image.open(io.BytesIO(image_data)) as img:
            return {
                'width': img.width,
                'height': img.height,
                'format': img.format,
                'mode': img.mode,
                'size_bytes': len(image_data)
            }
    except Exception as e:
        print(f"Ошибка получения информации об изображении: {e}")
        return None


def validate_image_size(base64_image: str, max_size_mb: int = 10) -> bool:
    """
    Проверяет размер изображения.
    
    Args:
        base64_image: Base64 строка изображения
        max_size_mb: Максимальный размер в МБ
    
    Returns:
        True если размер в пределах нормы
    """
    try:
        image_data = base64.b64decode(base64_image)
        size_mb = len(image_data) / (1024 * 1024)
        return size_mb <= max_size_mb
    except:
        return False