import sys
import subprocess

try:
    from PIL import Image, ImageChops
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageChops

def make_square_favicon():
    input_path = 'src/assets/kits_logo.jpg'
    output_path = 'src/assets/kits_favicon.png'
    
    # Open the image
    img = Image.open(input_path).convert('RGB')
    
    # Create a white background to find difference
    bg = Image.new('RGB', img.size, (255, 255, 255))
    diff = ImageChops.difference(img, bg)
    bbox = diff.getbbox()
    
    if bbox:
        # Crop the image to just the logo and text
        img = img.crop(bbox)
        
    width, height = img.size
    
    # We want a square. Find the max dimension.
    max_dim = max(width, height)
    
    # Let's add 10% padding to the max dimension
    padding = int(max_dim * 0.1)
    new_dim = max_dim + (padding * 2)
    
    # Create new square white image
    squared = Image.new('RGB', (new_dim, new_dim), (255,255,255))
    
    # Paste centered
    x_offset = (new_dim - width) // 2
    y_offset = (new_dim - height) // 2
    squared.paste(img, (x_offset, y_offset))
    
    # Resize to perfect 128x128 favicon
    favicon = squared.resize((128, 128), Image.Resampling.LANCZOS)
    
    # Save as PNG
    favicon.save(output_path)
    print(f"Successfully generated perfect square favicon at {output_path}")

make_square_favicon()
