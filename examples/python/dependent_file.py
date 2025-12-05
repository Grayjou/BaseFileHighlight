# This file should NOT be highlighted (default color)
# It imports from a local module

import numpy as np
from base_file import process_data

def extended_processing():
    """Use local module for processing."""
    base_result = process_data()
    array = np.array([1, 2, 3, 4, 5])
    
    return {
        'base': base_result,
        'extended': array.tolist()
    }

if __name__ == '__main__':
    print(extended_processing())
