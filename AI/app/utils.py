from PIL import Image
import os

def resize_image(image_path, max_size=(1024, 1024), quality=85):
    try:
        img = Image.open(image_path)
        img_format = img.format
        if img.mode in ("RGBA", "P"):
             img = img.convert("RGB")
             img_format = "JPEG"

        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        save_suffix = ".jpg" if img_format == "JPEG" else os.path.splitext(image_path)[1]
        
        img.save(image_path, format="JPEG", quality=quality, optimize=True)
        
        print(f"Resized and compressed image saved to: {image_path}")
        return image_path
    
    except Exception as e:
        print(f"Error resizing image {image_path}: {e}")
        return image_path