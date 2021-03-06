import numpy as np
from PIL import Image, ImageDraw


def process_img(img_path, username):
    img_path = './' + img_path
    img = Image.open(img_path).convert("RGB")

    height, width = img.size

    min_size = min(height, width)

    x = (height - min_size) // 2
    y = (width - min_size) // 2

    img = img.crop((x, y, x + min_size, y + min_size))

    width, height = min_size, min_size
    np_image = np.array(img)

    alpha = Image.new('L', img.size, 0)
    draw = ImageDraw.Draw(alpha)
    draw.pieslice([0, 0, height, width], 0, 360, fill=255)

    np_alpha = np.array(alpha)
    np_image = np.dstack((np_image, np_alpha))

    Image.fromarray(np_image).save('./media/images/{}.png'.format(username))

    return '/media/images/{}.png'.format(username)


if __name__ == '__main__':
    process_img('/Users/gwyrwch/PycharmProjects/splitwise/media/images/group_default.jpg', 'group_default')
