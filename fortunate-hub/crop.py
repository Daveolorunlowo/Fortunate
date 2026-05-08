from PIL import Image

# menu-template.png is 210 x 1024.
# It has 3 food images. We can eyeball the vertical coordinates.
# 1st dish: top part, maybe y=160 to y=300
# 2nd dish: middle part, maybe y=420 to y=560
# 3rd dish: bottom part, maybe y=680 to y=820

img_menu = Image.open('public/menu-template.png')
w, h = img_menu.size

# Since it's 210x1024, the aspect ratio is weird, it's very narrow. Let's just crop based on percentages.
# Visually checking the first image provided (the 3 dishes), they are roughly spaced evenly.
dish1 = img_menu.crop((0, int(h * 0.15), w, int(h * 0.29)))
dish1.save('public/dish1.png')

dish2 = img_menu.crop((0, int(h * 0.41), w, int(h * 0.55)))
dish2.save('public/dish2.png')

dish3 = img_menu.crop((0, int(h * 0.67), w, int(h * 0.81)))
dish3.save('public/dish3.png')

# checkout-template.png is 348 x 1024
# The food image is at the top.
img_check = Image.open('public/checkout-template.png')
wc, hc = img_check.size
dish_check = img_check.crop((0, int(hc * 0.05), wc, int(hc * 0.25)))
dish_check.save('public/dish_checkout.png')

print("Cropped successfully!")
