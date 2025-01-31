import numpy as np

def classify_eye_contact_with_camera(gaze_vector):
    """
    Classify eye contact based on the deviation of the gaze vector from the camera direction.

    Parameters:
    gaze_vector (array-like): 3D vector representing the gaze direction.

    Returns:
    str: Classification of eye contact strength ('Strong', 'Medium', 'Weak').
    float: Angle of deviation from the camera in degrees.
    """
    # Convert the gaze vector to a NumPy array
    gaze_vector = np.array(gaze_vector)

    # Define the reference vector (camera direction)
    camera_reference = np.array([0, 0, -1])  # Assuming the camera is at the origin

    # Calculate the dot product between the gaze vector and the reference vector
    dot_product = np.dot(gaze_vector, camera_reference)

    # Calculate the magnitudes of the vectors
    gaze_magnitude = np.linalg.norm(gaze_vector)
    camera_magnitude = np.linalg.norm(camera_reference)

    # Calculate cosine of the angle
    cos_theta = dot_product / (gaze_magnitude * camera_magnitude)

    # Ensure the cosine value is within the valid range [-1, 1]
    cos_theta = np.clip(cos_theta, -1.0, 1.0)

    # Calculate the angle in radians and convert to degrees
    theta_radians = np.arccos(cos_theta)
    theta_degrees = np.degrees(theta_radians)

    # Classify eye contact based on angle
    if theta_degrees <= 5:  # Adjust threshold based on application
        classification = 'Strong'
    elif theta_degrees <= 15:
        classification = 'Medium'
    else:
        classification = 'Weak'

    return classification, theta_degrees