import tensorflow as tf
import json

model = tf.keras.models.load_model('cattle_classifier.keras')
out_shapes = [list(out.shape) for out in model.outputs]

with open("tf_output.json", "w") as f:
    json.dump({"shapes": out_shapes}, f)
